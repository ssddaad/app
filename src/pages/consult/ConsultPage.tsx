import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/components/userContext';
import {
    MessageSquare,
    Calendar,
    FileText,
    Send,
    Paperclip,
    Image,
    Smile,
    PhoneCall,
    Video,
    Star,
    ChevronRight,
    HelpCircle,
    Stethoscope,
    Sparkles,
    ArrowRight,
    MoreHorizontal, // 确保引入 MoreHorizontal 图标
    Phone
} from 'lucide-react';
import Header from '@/components/header';
import AIAssistant from '@/components/AIAssistant/AIAssistant';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import './ConsultPage.css';
import img1 from '@/components/ai.png';
import { appendMessage, subscribeMessages, loadMessages, type SharedMessage } from './chatStore';

// Message Type
interface Message {
    id: string;
    type: 'user' | 'doctor';
    content: string;
    timestamp: Date;
    quickReplies?: string[];
    attachments?: { type: 'image' | 'file'; name: string }[];
}

// Doctor Info Type
interface DoctorInfo {
    name: string;
    title: string;
    hospital: string;
    experience: string;
    rating: number;
    consultations: number;
    responseTime: string;
    tags: string[];
    avatar: string;
    specialty: string;
}

// Doctor Info
const DOCTOR_INFO: DoctorInfo = {
    name: '李医生',
    title: '乳腺科主治医师',
    hospital: '市中心医院',
    experience: '15年',
    rating: 4.9,
    consultations: 3280,
    responseTime: '< 5分钟',
    tags: ['乳腺健康', '癌症预防', '术后康复'],
    avatar: '李',
    specialty: '擅长乳腺癌早期筛查、乳腺良性肿瘤诊治、乳腺癌术后康复指导',
};

// Quick Questions Type
type QuickQuestion = string;

// Quick Questions
const QUICK_QUESTIONS: QuickQuestion[] = [
    '乳腺癌的早期症状有哪些？',
    '如何进行乳腺自我检查？',
    '乳腺癌筛查多久做一次？',
    '术后需要注意什么？',
    '如何缓解化疗副作用？',
    '乳腺增生需要治疗吗？',
];

// FAQ Type
interface FAQItem {
    q: string;
    a: string;
}

// FAQ List
const FAQ_LIST: FAQItem[] = [
    { q: '乳腺癌会遗传吗？', a: '约5-10%的乳腺癌与遗传有关，BRCA基因突变携带者风险较高。' },
    { q: '乳腺增生会变成癌症吗？', a: '单纯性乳腺增生癌变风险极低，但不典型增生需要密切随访。' },
    { q: '哺乳期可以做乳腺检查吗？', a: '建议哺乳期结束后再进行乳腺X光检查，超声检查相对安全。' },
    { q: '乳腺癌术后能怀孕吗？', a: '治疗结束后2-3年，经医生评估后可考虑怀孕。' },
    { q: '乳腺结节需要手术吗？', a: '大多数良性结节无需手术，定期随访即可。恶性或可疑结节需手术。' },
    { q: '男性也会得乳腺癌吗？', a: '男性也可能患乳腺癌，约占所有乳腺癌病例的1%。' },
    { q: '乳腺癌筛查从几岁开始？', a: '一般建议40岁开始筛查，有家族史者可能需要更早开始。' },
    { q: '乳腺疼痛是癌症吗？', a: '大多数乳腺疼痛与月经周期相关，是良性症状，但持续疼痛应就医。' },
];

// Service Type
interface ServiceItem {
    icon: React.FC;
    name: string;
    desc: string;
    path: string;
    color: string;
}

// Service List with links
const SERVICE_LIST: ServiceItem[] = [
    { icon: Calendar, name: '预约挂号', desc: '快速预约专家号', path: '/appointment', color: 'appointment' },
    { icon: Calendar, name: '预约陪诊', desc: '预约专业陪诊服务', path: '/booking', color: 'appointment' },
    { icon: FileText, name: '检查报告', desc: '查看您的检查报告', path: '/reports', color: 'record' },
    { icon: Stethoscope, name: '我的医生', desc: '管理您的医生团队', path: '/doctors', color: 'consult' },
];

/** 将 SharedMessage 转为本地 Message 格式 */
const sharedToLocal = (sm: SharedMessage): Message => ({
    id: sm.id,
    type: sm.from === 'patient' ? 'user' : 'doctor',
    content: sm.content,
    timestamp: new Date(sm.timestamp),
    // quickReplies: sm.quickReplies, // 如果 SharedMessage 中有 quickReplies
    // attachments: sm.attachments, // 如果 SharedMessage 中有 attachments
});

// Typing Indicator Component
const TypingIndicator: React.FC = () => (
    <div className="chat-message doctor">
        <div className="chat-message-avatar doctor">{DOCTOR_INFO.avatar}</div>
        <div className="chat-message-content">
            <div className="chat-typing">
                <div className="typing-dots">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                </div>
                <span className="typing-text">医生正在回复...</span>
            </div>
        </div>
    </div>
);

// Message Bubble Component
const MessageBubble: React.FC<{ message: Message; onQuickReply?: (text: string) => void }> = ({
    message,
    onQuickReply
}) => {
    const isUser = message.type === 'user';

    return (
        <div className={`chat-message ${message.type}`}>
            <div className={`chat-message-avatar ${message.type}`}>
                {isUser ? '我' : DOCTOR_INFO.avatar}
            </div>
            <div className="chat-message-content">
                <div className="chat-message-bubble">
                    {message.content}
                    {message.attachments && message.attachments.length > 0 && (
                        <div className="message-attachments">
                            {message.attachments.map((att, idx) => (
                                <div key={idx} className="message-attachment">
                                    {att.type === 'image' ? <Image size={16} /> : <FileText size={16} />}
                                    <span>{att.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="chat-message-time">
                    {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </div>
                {!isUser && message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="chat-quick-replies">
                        {message.quickReplies.map((reply, index) => (
                            <button
                                key={index}
                                className="chat-quick-reply"
                                onClick={() => onQuickReply?.(reply)}
                            >
                                {reply}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const ConsultPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    // 如果登录角色是医生，自动跳转到医生工作台
    useEffect(() => {
        if (user?.role === 'doctor') {
            navigate('/doctor-consult', { replace: true });
        }
    }, [user, navigate]);
    // 从共享 store 初始化消息，若为空则插入欢迎语
    const [messages, setMessages] = useState<Message[]>(() => {
        const stored = loadMessages();
        if (stored.length > 0) return stored.map(sharedToLocal);
        return [
            {
                id: 'welcome',
                type: 'doctor',
                content: `您好！我是${DOCTOR_INFO.name}，${DOCTOR_INFO.title}。很高兴为您服务！\n\n请问有什么乳腺健康方面的问题需要咨询吗？我会尽力为您解答。`,
                timestamp: new Date(),
                quickReplies: QUICK_QUESTIONS.slice(0, 3),
                attachments: [],
            },
        ];
    });
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showDoctorDetail, setShowDoctorDetail] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 订阅共享 store 变化（医生端发消息后同步过来）
    useEffect(() => {
        const unsub = subscribeMessages((sharedMsgs) => {
            if (sharedMsgs.length === 0) return;
            setMessages(sharedMsgs.map(sharedToLocal));
            // 如果最新一条是医生发的，停止 typing 动画
            const last = sharedMsgs[sharedMsgs.length - 1];
            if (last.from === 'doctor') {
                setIsTyping(false);
                if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
            }
        });
        return unsub;
    }, []);

    const scrollToBottom = useCallback(() => {
        if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            container.scrollTop = container.scrollHeight;
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, scrollToBottom]);

    // 发送消息 — 写入共享 store
    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;
        appendMessage({ from: 'patient', content: content.trim(), timestamp: Date.now() });
        setInputValue('');
        setIsTyping(true);
        // 30秒后若医生未回复，自动停止 typing 动画
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => setIsTyping(false), 30_000);
    }, []);

    const handleSend = useCallback(() => {
        sendMessage(inputValue);
    }, [inputValue, sendMessage]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    const handleFileUpload = () => {
        toast.info('文件上传功能开发中', { description: '您可以先通过文字描述您的情况' });
    };
    const handleImageUpload = () => {
        toast.info('图片上传功能开发中', { description: '您可以先通过文字描述您的情况' });
    };
    const handleVoiceCall = () => {
        toast.info('语音通话功能开发中', { description: '请使用文字咨询或预约门诊' });
    };
    const handleVideoCall = () => {
        toast.info('视频通话功能开发中', { description: '请使用文字咨询或预约门诊' });
    };

    const toggleFaq = useCallback((index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    }, [expandedFaq]);

    // 使用 useMemo 缓存 groupedMessages，避免每次渲染都重新计算
    const groupedMessages = useMemo(() => {
        return messages.reduce((groups, message) => {
            const date = message.timestamp.toLocaleDateString('zh-CN');
            if (!groups[date]) groups[date] = [];
            groups[date].push(message);
            return groups;
        }, {} as Record<string, Message[]>);
    }, [messages]);

    return (
        <div className="page-bg">
            <Header onSearch={() => { }} />


            <div className="consult-page">
                <div className="consult-container">
                    <div className="consult-layout">
                        {/* 左侧边栏 */}
                        <aside className="consult-sidebar">
                            <div className="sidebar-card">
                                <div className="sidebar-header">
                                    <h3 className="sidebar-title">服务导航</h3>
                                </div>
                                <nav className="sidebar-nav">
                                    <Link to="/consult" className="sidebar-nav-item active">
                                        <div className="sidebar-nav-icon"><MessageSquare size={14} /></div>
                                        <span className='text-[16px]'>在线咨询</span>
                                        <span className="sidebar-nav-badge">在线</span>
                                    </Link>
                                    <Link to="/appointment" className="sidebar-nav-item">
                                        <div className="sidebar-nav-icon"><Calendar size={14} /></div>
                                        <span className='text-[16px]'>预约挂号</span>
                                    </Link>
                                    <Link to="/booking" className="sidebar-nav-item">
                                        <div className="sidebar-nav-icon"><Calendar size={14} /></div>
                                        <span className='text-[16px]'>预约陪诊</span>
                                    </Link>
                                    <Link to="/reports" className="sidebar-nav-item">
                                        <div className="sidebar-nav-icon"><FileText size={14} /></div>
                                        <span className='text-[16px]'>检查报告</span>
                                    </Link>
                                    <Link to="/doctors" className="sidebar-nav-item">
                                        <div className="sidebar-nav-icon"><Star size={14} /></div>
                                        <span className='text-[16px]'>我的医生</span>
                                    </Link>
                                    <Link to="/faq" className="sidebar-nav-item">
                                        <div className="sidebar-nav-icon"><HelpCircle size={14} /></div>
                                        <span className='text-[16px]'>常见问题</span>
                                    </Link>
                                </nav>
                            </div>

                            <Link to="/ai" className="ai-entry-card">
                                <div className="ai-entry-img"><img src={img1} alt="AI助手" /></div>
                                <div className="ai-entry-content">
                                    <div className="ai-entry-title">
                                        <Sparkles size={19} />
                                        <span className='text-[16px]'>AI助手入口</span>
                                    </div>
                                    <span className='text-[14px]'>24小时在线，随时为您解答健康问题</span>
                                </div>
                                <ChevronRight size={18} className="ai-entry-arrow" />
                            </Link>

                            <div className="sidebar-services">
                                <h4 className="sidebar-services-title">快捷服务</h4>
                                <div className="sidebar-services-list">
                                    {SERVICE_LIST.map((service, index) => (
                                        <Link key={index} to={service.path} className="sidebar-service-item">
                                            <span className='text-[16px]'>{service.name}</span>
                                            <ArrowRight size={14} className="sidebar-service-arrow" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* 中间主内容区 */}
                        <main className="consult-main">
                            {/* 聊天卡片 */}
                            <div className="chat-card">
                                {/* 聊天头部 */}
                                <div className="chat-header">
                                    <div className="chat-header-info" onClick={() => setShowDoctorDetail(true)} style={{ cursor: 'pointer' }}>
                                        <div className="chat-avatar online">{DOCTOR_INFO.avatar}</div>
                                        <div className="chat-header-text">
                                            <div className="chat-header-name">{DOCTOR_INFO.name}</div>
                                            <div className="chat-header-status">在线为您服务</div>
                                        </div>
                                    </div>
                                    <div className="chat-header-actions">
                                        <button className="chat-action-btn" title="语音通话" onClick={handleVoiceCall}>
                                            <PhoneCall size={18} />
                                        </button>
                                        <button className="chat-action-btn" title="视频通话" onClick={handleVideoCall}>
                                            <Video size={18} />
                                        </button>
                                        <button className="chat-action-btn" title="更多">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* 聊天消息区 */}
                                <div className="chat-messages" ref={messagesContainerRef}>
                                    {Object.entries(groupedMessages).map(([date, msgs]) => (
                                        <div key={date} style={{ display: 'contents' }}>
                                            <div className="chat-date-divider">
                                                <span className="chat-date-text">{date}</span>
                                            </div>
                                            {msgs.map(message => (
                                                <MessageBubble
                                                    key={message.id}
                                                    message={message}
                                                    onQuickReply={sendMessage}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                    {isTyping && <TypingIndicator />}
                                </div>

                                {/* 聊天输入区 */}
                                <div className="chat-input-area">
                                    <div className="chat-input-wrapper">
                                        <div className="chat-input-actions">
                                            <button className="chat-input-btn" title="添加附件" onClick={handleFileUpload}>
                                                <Paperclip size={18} />
                                            </button>
                                            <button className="chat-input-btn" title="发送图片" onClick={handleImageUpload}>
                                                <Image size={18} />
                                            </button>
                                            <button className="chat-input-btn" title="表情">
                                                <Smile size={18} />
                                            </button>
                                        </div>
                                        <textarea
                                            className="chat-input-field"
                                            placeholder="输入您的问题，医生会尽快回复..."
                                            value={inputValue}
                                            onChange={e => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            rows={1}
                                            style={{ height: '44px' }}
                                        />
                                        <button
                                            className="chat-send-btn"
                                            onClick={handleSend}
                                            disabled={!inputValue.trim()}
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 底部常见问题区域 */}
                            <div className="faq-section">
                                <div className="faq-section-header">
                                    <h3 className="faq-section-title">常见问题解答</h3>
                                    <p className="faq-section-subtitle">点击问题查看详细解答，或直接点击发送到咨询窗口</p>
                                </div>
                                <div className="faq-grid">
                                    {FAQ_LIST.map((faq, index) => (
                                        <div
                                            key={index}
                                            className={`faq-card ${expandedFaq === index ? 'expanded' : ''}`}
                                        >
                                            <div
                                                className="faq-card-question"
                                                onClick={() => toggleFaq(index)}
                                            >
                                                <span className="faq-q-badge">Q</span>
                                                <span className="faq-question-text">{faq.q}</span>
                                                <ChevronRight
                                                    size={16}
                                                    className={`faq-expand-icon ${expandedFaq === index ? 'rotated' : ''}`}
                                                />
                                            </div>
                                            {expandedFaq === index && (
                                                <div className="faq-card-answer">
                                                    <p>{faq.a}</p>
                                                </div>
                                            )}
                                            <button
                                                className="faq-send-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    sendMessage(faq.q);
                                                }}
                                            >
                                                <MessageSquare size={12} />
                                                咨询此问题
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="faq-section-footer">
                                    <Link to="/faq" className="view-all-faq-btn">
                                        查看更多问题
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </main>

                        {/* 右侧医生信息栏 */}
                        <aside className="consult-info">
                            <div className="info-card doctor-card" onClick={() => setShowDoctorDetail(true)}>
                                <div className="info-card-body">
                                    <div className="doctor-info">
                                        <div className="doctor-avatar-large">{DOCTOR_INFO.avatar}</div>
                                        <div className="doctor-name">{DOCTOR_INFO.name}</div>
                                        <div className="doctor-title">{DOCTOR_INFO.title}</div>
                                        <div className="doctor-hospital">{DOCTOR_INFO.hospital}</div>
                                        <div className="doctor-tags">
                                            {DOCTOR_INFO.tags.map((tag, index) => (
                                                <span key={index} className={`doctor-tag ${index === 0 ? 'primary' : 'secondary'}`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="doctor-stats">
                                            <div className="doctor-stat">
                                                <div className="doctor-stat-value">{DOCTOR_INFO.rating}</div>
                                                <div className="doctor-stat-label">评分</div>
                                            </div>
                                            <div className="doctor-stat">
                                                <div className="doctor-stat-value">{DOCTOR_INFO.consultations}</div>
                                                <div className="doctor-stat-label">咨询量</div>
                                            </div>
                                            <div className="doctor-stat">
                                                <div className="doctor-stat-value">{DOCTOR_INFO.experience}</div>
                                                <div className="doctor-stat-label">经验</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link to="/emergency" className="info-card contact-card">
                                <div className="info-card-header">
                                    <div className="info-card-icon"><Phone size={14} color="black"/></div>
                                    <h4 className="info-card-title">紧急联系</h4>
                                </div>
                                <div className="info-card-body">
                                    <div className="contact-item"><span>400-123-4567</span></div>
                                    <div className="contact-item"><span>help@rcax.com</span></div>
                                    <div className="contact-item"><span>24小时服务热线</span></div>
                                </div>
                            </Link>
                        </aside>
                    </div>
                </div>
            </div>

            {/* AI助手浮动按钮 */}
            <AIAssistant />

            {/* 医生详情弹窗 */}
            <Dialog open={showDoctorDetail} onOpenChange={setShowDoctorDetail}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>医生详情</DialogTitle>
                    </DialogHeader>
                    <div className="doctor-detail">
                        <div className="doctor-detail-avatar">{DOCTOR_INFO.avatar}</div>
                        <div className="doctor-detail-name">{DOCTOR_INFO.name}</div>
                        <div className="doctor-detail-title">{DOCTOR_INFO.title}</div>
                        <div className="doctor-detail-hospital">{DOCTOR_INFO.hospital}</div>
                        <div className="doctor-detail-specialty">
                            <strong>擅长：</strong>{DOCTOR_INFO.specialty}
                        </div>
                        <div className="doctor-detail-stats">
                            <div className="detail-stat">
                                <span className="detail-stat-value">{DOCTOR_INFO.rating}</span>
                                <span className="detail-stat-label">患者评分</span>
                            </div>
                            <div className="detail-stat">
                                <span className="detail-stat-value">{DOCTOR_INFO.consultations}</span>
                                <span className="detail-stat-label">咨询次数</span>
                            </div>
                            <div className="detail-stat">
                                <span className="detail-stat-value">{DOCTOR_INFO.responseTime}</span>
                                <span className="detail-stat-label">平均回复</span>
                            </div>
                        </div>
                        <div className="doctor-detail-actions">
                            <Button className="detail-btn primary" onClick={() => setShowDoctorDetail(false)}>
                                <MessageSquare size={16} />
                                继续咨询
                            </Button>
                            <Link to="/appointment">
                                <Button className="detail-btn secondary" variant="outline">
                                    <Calendar size={16} />
                                    预约门诊
                                </Button>
                            </Link>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ConsultPage;
