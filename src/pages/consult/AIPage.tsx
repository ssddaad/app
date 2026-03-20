import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Lightbulb, MessageSquare, Clock, Calendar, Stethoscope, FileText, Phone, ChevronRight, History, Trash2, Bookmark, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, type Message } from '../services/api';
import './AIPage.css'; 
import aiimg2 from '../../components/ai.png'
interface UIMessage extends Message {
  timestamp: Date;
}


interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
  preview: string;
}

const WELCOME_MESSAGE = `你好！我是你的AI乳腺健康助手 🤗

我是一位专业的乳腺外科医生，可以为你解答关于乳腺癌预防、诊断、治疗和康复方面的问题。

虽然我的建议不能替代专业医生的面诊，但可以为你提供有用的健康信息和指导。

有什么我可以帮你的吗？`;

const CHAT_HISTORY: ChatHistoryItem[] = [
  { id: '1', title: '乳腺癌早期症状咨询', date: '今天', preview: '乳腺癌的早期症状包括...' },
  { id: '2', title: '术后康复注意事项', date: '昨天', preview: '术后需要注意以下几点...' },
  { id: '3', title: '乳腺自我检查方法', date: '3天前', preview: '乳腺自我检查步骤如下...' },
];

const FEATURES = [
  { icon: Stethoscope, title: '智能问诊', desc: '基于医学知识库的专业解答' },
  { icon: Calendar, title: '检查提醒', desc: '定期提醒复查和随访' },
  { icon: FileText, title: '报告解读', desc: '辅助理解检查报告内容' },
  { icon: Phone, title: '紧急联系', desc: '一键拨打24小时热线' },
];

export default function AIPage() {
  const [messages, setMessages] = useState<UIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGE,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<{ id: string; text: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 加载建议
  useEffect(() => {
    api.fetchSuggestions().then(setSuggestions);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    setError(null);

    // 添加用户消息
    const userMessage: UIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 准备对话数据
    const convo = {
      id: 'current',
      messages: messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: m.timestamp.getTime(),
        })),
    };

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      createdAt: Date.now(),
    };

    try {
      // 使用流式API
      await api.sendMessageStream(convo, userMsg, (chunk) => {
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg.role === 'assistant' && lastMsg.id !== 'welcome') {
            // 更新现有助手消息
            return [
              ...prev.slice(0, -1),
              { ...lastMsg, content: lastMsg.content + chunk },
            ];
          } else {
            // 创建新的助手消息
            return [
              ...prev,
              {
                id: Date.now().toString(),
                role: 'assistant',
                content: chunk,
                timestamp: new Date(),
              },
            ];
          }
        });
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '请求失败，请稍后重试';
      setError(errorMessage);
      console.error('发送消息失败:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: WELCOME_MESSAGE,
        timestamp: new Date(),
      },
    ]);
    setError(null);
  };

  return (
    <div className="ai-page">
      {/* 头部 */}
      <div className="ai-header">
        <Link to="/consult" className="back-btn" style={{ fontSize: '15px' }}>
          返回
        </Link>
        <div className="ai-header-info">
          <div className="ai-avatar-small">
            <img src={aiimg2} alt="AI助手" />
          </div>
          <div className="ai-header-text">
            <h1>AI健康助手</h1>
            <span className="ai-status">
              <span className="status-dot"></span>
              在线
            </span>
          </div>
        </div>
        <div className="ai-badge">
          <Sparkles size={14} />
          <span>AI驱动</span>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="ai-main-content">
        {/* 左侧边栏 */}
        <div className="ai-sidebar">
          <div className="sidebar-tabs">
            <button 
              className={`sidebar-tab ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare size={16} />
              <span className='text-[16px]'>当前对话</span>
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <History size={16} />
              <span className='text-[16px]'>历史记录</span>
            </button>
          </div>

          {activeTab === 'chat' ? (
            <>
              <div className="sidebar-section">
                <h4 className="sidebar-title">快捷功能</h4>
                <div className="feature-list">
                  {FEATURES.map((feature, index) => (
                    <Link key={index} to={feature.title === '紧急联系' ? '/emergency' : feature.title === '报告解读' ? '/reports' : '/appointment'} className="feature-item">
                      <div className="feature-icon">
                        <feature.icon size={18} />
                      </div>
                      <div className="feature-info">
                        <span className="feature-name">{feature.title}</span>
                        <span className="feature-desc">{feature.desc}</span>
                      </div>
                      <ChevronRight size={14} />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="sidebar-section">
                <h4 className="sidebar-title">对话统计</h4>
                <div className="stats-grid-small">
                  <div className="stat-item-small">
                    <span className="stat-value-small">{messages.length - 1}</span>
                    <span className="stat-label-small">消息数</span>
                  </div>
                  <div className="stat-item-small">
                    <span className="stat-value-small">{Math.floor((messages.length - 1) / 2)}</span>
                    <span className="stat-label-small">问答数</span>
                  </div>
                  <div className="stat-item-small">
                    <span className="stat-value-small">{new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                    <span className="stat-label-small">今天</span>
                  </div>
                </div>
              </div>

              <button className="clear-chat-btn" onClick={clearChat}>
                <Trash2 size={14} />
                清空对话
              </button>
            </>
          ) : (
            <div className="history-list">
              {CHAT_HISTORY.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-header">
                    <MessageSquare size={14} />
                    <span className="history-title">{item.title}</span>
                  </div>
                  <p className="history-preview">{item.preview}</p>
                  <div className="history-footer">
                    <span className="history-date">
                      <Clock size={12} />
                      {item.date}
                    </span>
                    <Bookmark size={14} className="bookmark-icon" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 聊天区域 */}
        <div className="ai-chat-container">
          {/* 错误提示 */}
          {error && (
            <div className="api-error-banner">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          <div className="ai-messages">
            {messages.map((message) => (
              <div key={message.id} className={`ai-message ${message.role}`}>
                <div className="message-avatar">
                  {message.role === 'assistant' ? (
                    <img src={aiimg2} alt="AI" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    {message.content.split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="ai-message assistant">
                <div className="message-avatar">
                  <img src="/ai-doctor.png" alt="AI" />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 快捷问题 */}
          {messages.length < 3 && suggestions.length > 0 && (
            <div className="quick-questions">
              <div className="quick-header">
                <Lightbulb size={14} />
                <span className='text-[15px]'>常见问题，点击快速提问</span>
              </div>
              <div className="quick-tags">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    className="quick-tag"
                    onClick={() => sendMessage(suggestion.text)}
                    disabled={isTyping}
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 输入区域 */}
          <div className="ai-input-area">
            <div className="input-wrapper">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入您的问题，AI助手会为您解答..."
                rows={1}
                disabled={isTyping}
              />
              <button
                className="send-btn"
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
              >
                <Send size={18} />
              </button>
            </div>
            <p className="input-hint">AI助手提供的信息仅供参考，不能替代专业医生的诊断</p>
          </div>
        </div>
      </div>
    </div>
  );
}
