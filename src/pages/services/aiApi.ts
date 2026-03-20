// 硅基流动 API 服务
// 文档: https://docs.siliconflow.cn/

const API_BASE_URL = 'https://api.siliconflow.cn/v1';

// 从环境变量获取 API Key（请在 .env 中配置 VITE_SILICONFLOW_API_KEY）
const API_KEY = import.meta.env.VITE_SILICONFLOW_API_KEY as string || '';

// 默认模型 - 可以根据需要修改
const DEFAULT_MODEL = import.meta.env.VITE_SILICONFLOW_MODEL || 'deepseek-ai/DeepSeek-V2.5';

// 系统提示词 - 定义AI助手的角色
const SYSTEM_PROMPT = `你是一位专业的乳腺健康AI助手，专注于乳腺癌预防、诊断、治疗和康复方面的咨询。

你的职责：
1. 解答用户关于乳腺健康的各类问题
2. 提供科学、准确的健康信息
3. 给予预防和筛查建议
4. 解释检查报告和治疗方案
5. 提供心理支持和康复指导

重要提示：
- 你的回答仅供参考，不能替代专业医生的诊断
- 对于紧急或严重症状，建议用户立即就医
- 保持专业、温暖、耐心的态度
- 使用通俗易懂的语言解释医学概念
- 适当使用emoji让回复更亲切

回答风格：
- 结构清晰，分点说明
- 语言温暖，给予鼓励
- 必要时提醒就医`;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 发送聊天请求到硅基流动API
 * @param userMessage 用户消息
 * @param history 历史消息（可选）
 * @returns AI回复内容
 */
export async function sendChatMessage(
  userMessage: string,
  history: ChatMessage[] = []
): Promise<string> {
  if (!API_KEY) {
    throw new Error('未配置API Key，请在.env文件中设置 VITE_SILICONFLOW_API_KEY');
  }

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: userMessage },
  ];

  const requestBody: ChatCompletionRequest = {
    model: DEFAULT_MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 2048,
    stream: false,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API请求失败: ${response.status} ${response.statusText}`
      );
    }

    const data: ChatCompletionResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }
    
    throw new Error('API返回数据格式异常');
  } catch (error) {
    console.error('硅基流动API调用失败:', error);
    throw error;
  }
}

/**
 * 流式发送聊天请求（用于实时显示回复）
 * @param userMessage 用户消息
 * @param onChunk 每次收到数据片段时的回调
 * @param history 历史消息（可选）
 */
export async function sendChatMessageStream(
  userMessage: string,
  onChunk: (chunk: string) => void,
  history: ChatMessage[] = []
): Promise<void> {
  if (!API_KEY) {
    throw new Error('未配置API Key，请在.env文件中设置 VITE_SILICONFLOW_API_KEY');
  }

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: userMessage },
  ];

  const requestBody: ChatCompletionRequest = {
    model: DEFAULT_MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 2048,
    stream: true,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API请求失败: ${response.status} ${response.statusText}`
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法获取响应流');
    }

    const decoder = new TextDecoder('utf-8');
    let buffer = '';

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
              onChunk(content);
            }
          } catch (e) {
            // 忽略解析错误的行
          }
        }
      }
    }
  } catch (error) {
    console.error('硅基流动API流式调用失败:', error);
    throw error;
  }
}

/**
 * 获取可用的模型列表
 */
export async function getAvailableModels(): Promise<string[]> {
  // 硅基流动支持的常用模型列表
  // 用户可以根据需要选择
  return [
    'deepseek-ai/DeepSeek-V2.5',
    'deepseek-ai/DeepSeek-V3',
    'Qwen/Qwen2.5-72B-Instruct',
    'Qwen/Qwen2.5-32B-Instruct',
    'Qwen/Qwen2.5-14B-Instruct',
    'THUDM/glm-4-9b-chat',
    '01-ai/Yi-1.5-34B-Chat',
    'meta-llama/Meta-Llama-3.1-70B-Instruct',
  ];
}

/**
 * 检查API配置是否正确
 */
export function checkApiConfig(): { valid: boolean; message: string } {
  if (!API_KEY) {
    return {
      valid: false,
      message: '未配置API Key，请在.env文件中设置 VITE_SILICONFLOW_API_KEY',
    };
  }
  
  if (API_KEY.length < 10) {
    return {
      valid: false,
      message: 'API Key格式不正确',
    };
  }
  
  return {
    valid: true,
    message: 'API配置正常',
  };
}
