// src/services/api.ts - AI助手API服务

const uid = (p = 'id') => `${p}-${Math.random().toString(36).slice(2, 10)}`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: number;
}

export interface Conversation {
  id: string;
  messages: Message[];
}

export interface Suggestion {
  id: string;
  text: string;
}

// API配置（从环境变量读取，避免 Key 泄漏到 Git 和打包产物）
const API_KEY = import.meta.env.VITE_SILICONFLOW_API_KEY as string;
const API_URL = "https://api.siliconflow.cn/v1/chat/completions";
const MODEL = (import.meta.env.VITE_SILICONFLOW_MODEL as string) ||
  "ft:LoRA/Qwen/Qwen2.5-7B-Instruct:d5rp7rmcnncc738k5sq0:breastcancer:oclicfelnbkxecoruzqr-ckpt_step_231";

// 内容格式化函数：替换*为空格，清理思考过程
const formatContent = (content: string): string => {
  return content
    // 移除常见的思考过程标记
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .replace(/【思考】[\s\S]*?【\/思考】/g, '')
    // 将 Markdown 列表符号 * 和 - 替换为两个空格
    .replace(/^\s*\*\s*/gm, '  ')
    .replace(/^\s*-\s*/gm, '  ')
    // 清理多余空行
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// 系统提示词
const SYSTEM_PROMPT = `你是一位专业的乳腺外科医生，具备丰富的乳腺癌诊疗经验。

你的专长包括：
- 乳腺癌的早期筛查与诊断
- 乳腺疾病的鉴别诊断
- 乳腺癌治疗方案的制定
- 术后康复与随访指导
- 患者心理支持与护理建议

回答要求：
1. 使用专业、准确、易懂的语言
2. 回答结构清晰，分点说明
3. 必要时提醒患者及时就医
4. 保持温暖、耐心的态度
5. 强调你的建议仅供参考，不能替代面诊
6. 【重要】回答时请直接给出最终答案，不要输出思考过程、分析步骤或"让我想想"等推理内容，也不要使用星号*作为列表标记

请记住：患者的健康和安全是第一位的。`;

export const api = {
  /**
   * 发送消息到AI模型
   * @param convo 对话对象
   * @param userMsg 用户消息
   * @returns 助手回复和分块内容
   */
  async sendMessage(
    convo: Conversation,
    userMsg: Message
  ): Promise<{ assistantMsg: Message; chunks?: string[] }> {
    console.log('开始调用API...', userMsg.content);

    try {
      // 构建消息历史
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...convo.messages.map((m) => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content,
        })),
        { role: 'user', content: userMsg.content },
      ];

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API错误:', errorData);
        throw new Error(`API错误 ${response.status}: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      let assistantContent = data.choices?.[0]?.message?.content || '抱歉，我没有得到有效的回复。';

      // 格式化内容：替换*为空格，清理思考过程
      assistantContent = formatContent(assistantContent);

      console.log('API响应成功:', assistantContent.slice(0, 100) + '...');

      // 分割成chunks用于流式显示
      const chunks: string[] = [];
      const chunkSize = 8; // 每个chunk的字符数
      for (let i = 0; i < assistantContent.length; i += chunkSize) {
        chunks.push(assistantContent.slice(i, i + chunkSize));
      }

      return {
        assistantMsg: {
          id: data.id || uid('m'),
          role: 'assistant',
          content: '', // 初始为空，通过chunks流式填充
          createdAt: Date.now(),
        },
        chunks,
      };
    } catch (error) {
      console.error('发送消息失败:', error);

      // 使用备用回复
      const fallbackText =
        '抱歉，我暂时无法连接到服务器。请检查网络连接后重试。如果问题持续存在，建议直接联系医院乳腺外科进行咨询。';

      const chunks: string[] = [];
      for (let i = 0; i < fallbackText.length; i += 8) {
        chunks.push(fallbackText.slice(i, i + 8));
      }

      return {
        assistantMsg: {
          id: uid('m'),
          role: 'assistant',
          content: '',
          createdAt: Date.now(),
        },
        chunks,
      };
    }
  },

  /**
   * 流式发送消息（实时返回内容）
   * @param convo 对话对象
   * @param userMsg 用户消息
   * @param onChunk 每次收到内容时的回调
   */
  async sendMessageStream(
    convo: Conversation,
    userMsg: Message,
    onChunk: (chunk: string) => void
  ): Promise<Message> {
    console.log('开始流式调用API...', userMsg.content);

    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...convo.messages.map((m) => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content,
        })),
        { role: 'user', content: userMsg.content },
      ];

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API错误 ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }

      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let fullContent = '';
      // 用于检测是否在 <think>...</think> 块内，流式过程中过滤掉思考内容
      let inThinkBlock = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;

          if (trimmedLine.startsWith('data: ')) {
            try {
              const jsonStr = trimmedLine.slice(6);
              const json = JSON.parse(jsonStr);
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                fullContent += content;

                // 流式过滤：跳过 <think>...</think> 块内容，不推送到界面
                let visible = content;
                if (inThinkBlock) {
                  const endIdx = visible.indexOf('</think>');
                  if (endIdx !== -1) {
                    inThinkBlock = false;
                    visible = visible.slice(endIdx + 8);
                  } else {
                    visible = '';
                  }
                }
                if (!inThinkBlock) {
                  const startIdx = visible.indexOf('<think>');
                  if (startIdx !== -1) {
                    inThinkBlock = true;
                    visible = visible.slice(0, startIdx);
                  }
                }
                if (visible) onChunk(visible);
              }
            } catch (e) {
              // 忽略解析错误的行
            }
          }
        }
      }

      // 流式读取完成，返回完整消息
      return {
        id: uid('m'),
        role: 'assistant',
        content: fullContent,
        createdAt: Date.now(),
      };
    } catch (error) {
      console.error('流式发送消息失败:', error);
      const fallbackText =
        '抱歉，我暂时无法连接到服务器。请检查网络连接后重试。';
      onChunk(fallbackText);
      return {
        id: uid('m'),
        role: 'assistant',
        content: fallbackText,
        createdAt: Date.now(),
      };
    }
  },

  /**
   * 获取常见问题建议
   */
  async fetchSuggestions(): Promise<Suggestion[]> {
    await sleep(150);
    return [
      { id: uid('sug'), text: '乳腺癌有哪些早期症状？' },
      { id: uid('sug'), text: '如何进行乳腺癌自我检查？' },
      { id: uid('sug'), text: '乳腺癌的高危因素有哪些？' },
      { id: uid('sug'), text: '乳腺癌筛查建议多久做一次？' },
      { id: uid('sug'), text: '乳腺结节需要手术吗？' },
      { id: uid('sug'), text: '乳腺癌术后需要注意什么？' },
    ];
  },

  /**
   * 提交评分反馈
   */
  async submitRating(convoId: string, score: number, feedback?: string): Promise<void> {
    await sleep(200);
    console.log('提交评分:', { convoId, score, feedback });
  },

  /**
   * 检查API连接状态
   */
  async checkHealth(): Promise<{ ok: boolean; message: string }> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'user', content: '你好' }],
          max_tokens: 5,
        }),
      });

      if (response.ok) {
        return { ok: true, message: 'API连接正常' };
      } else {
        return { ok: false, message: `API错误: ${response.status}` };
      }
    } catch (error) {
      return { ok: false, message: '无法连接到API服务器' };
    }
  },
};

export default api;