/**
 * 医生端在线咨询页面
 * 三栏布局：左侧患者队列 | 中间双端聊天 | 右侧患者信息
 * 「在线患者」通过 chatStore (localStorage) 与患者端实时同步
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Send, Paperclip, Image, Smile, PhoneCall, Video, MoreHorizontal,
  Users, CheckCircle, MessageSquare, FileText, ClipboardList,
  Bell, Settings, LogOut, ChevronDown, Stethoscope, AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import './DoctorConsultPage.css';
import {
  appendMessage, subscribeMessages, loadMessages, clearMessages,
  type SharedMessage,
} from './chatStore';

// ─── 类型定义 ────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  from: 'doctor' | 'patient';
  content: string;
  timestamp: Date;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: '女' | '男';
  chiefComplaint: string;
  lastMsg: string;
  lastTime: Date;
  status: 'waiting' | 'chatting' | 'done';
  unread: number;
  phone: string;
  diagnosis: string;
  visitCount: number;
  lastVisit: string;
  allergyHistory: string;
  messages: ChatMessage[];
  isLive?: boolean; // 标记为真实在线患者
}

// ─── 「在线患者」占位（与患者端打通）───────────────────────────────────────
const LIVE_PATIENT_ID = 'live';

function makeLivePatient(msgs: ChatMessage[]): Patient {
  const last = msgs[msgs.length - 1];
  const newUnread = msgs.filter(m => m.from === 'patient').length;
  return {
    id: LIVE_PATIENT_ID,
    name: '在线患者',
    age: 0,
    gender: '女',
    chiefComplaint: last?.content.slice(0, 20) + '…' || '等待咨询',
    lastMsg: last?.content || '（暂无消息）',
    lastTime: last ? last.timestamp : new Date(),
    status: msgs.length > 0 ? 'chatting' : 'waiting',
    unread: newUnread,
    phone: '—',
    diagnosis: '待诊断',
    visitCount: 1,
    lastVisit: '今日',
    allergyHistory: '—',
    messages: msgs,
    isLive: true,
  };
}

// ─── 模拟患者数据 ─────────────────────────────────────────────────────────────

const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: '张女士',
    age: 42,
    gender: '女',
    chiefComplaint: '乳房肿块咨询',
    lastMsg: '我今年42岁，平时月经规律，家里没有乳腺癌病史。',
    lastTime: new Date(Date.now() - 2 * 60 * 1000),
    status: 'chatting',
    unread: 2,
    phone: '138****5678',
    diagnosis: '乳腺结节（待确认）',
    visitCount: 3,
    lastVisit: '2024-11-15',
    allergyHistory: '无',
    messages: [
      { id: 'm1', from: 'patient', content: '医生您好，我最近发现左侧乳房有一个小肿块，大概黄豆大小，摸起来可以活动，不痛，想问一下需要担心吗？', timestamp: new Date(Date.now() - 10 * 60 * 1000) },
      { id: 'm2', from: 'doctor', content: '您好，张女士！感谢您的咨询。\n\n您描述的肿块特点（可活动、无痛）符合良性病变的表现，但还需要结合检查结果才能确定。\n\n请问您做过乳腺超声或钼靶检查吗？如有报告可以发给我看看。', timestamp: new Date(Date.now() - 8 * 60 * 1000) },
      { id: 'm3', from: 'patient', content: '之前没有做过，我应该做什么检查比较好？', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
      { id: 'm4', from: 'patient', content: '我今年42岁，平时月经规律，家里没有乳腺癌病史。', timestamp: new Date(Date.now() - 2 * 60 * 1000) },
    ],
  },
  {
    id: 'p2',
    name: '王女士',
    age: 35,
    gender: '女',
    chiefComplaint: '术后复查咨询',
    lastMsg: '李医生，我上周做完手术，伤口这里有点红…',
    lastTime: new Date(Date.now() - 15 * 60 * 1000),
    status: 'waiting',
    unread: 1,
    phone: '139****1234',
    diagnosis: '乳腺癌术后随访',
    visitCount: 12,
    lastVisit: '2024-12-01',
    allergyHistory: '青霉素过敏',
    messages: [
      { id: 'w1', from: 'patient', content: '李医生，我上周做完手术，伤口这里有点红，还有轻微渗液，是正常的吗？需要去医院处理吗？', timestamp: new Date(Date.now() - 15 * 60 * 1000) },
    ],
  },
  {
    id: 'p3',
    name: '刘女士',
    age: 58,
    gender: '女',
    chiefComplaint: '乳腺增生随访',
    lastMsg: '谢谢医生，我明白了',
    lastTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'done',
    unread: 0,
    phone: '137****9012',
    diagnosis: '乳腺增生（良性）',
    visitCount: 7,
    lastVisit: '2024-10-20',
    allergyHistory: '无',
    messages: [
      { id: 'l1', from: 'patient', content: '李医生，我的乳腺增生已经随访两年了，每次超声都说稳定，还需要继续随访吗？', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
      { id: 'l2', from: 'doctor', content: '刘女士您好！稳定的乳腺增生建议每年做一次超声检查即可，无需过于频繁。如果出现肿块增大、质地变硬、或皮肤改变等情况，需要及时就诊。', timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000) },
      { id: 'l3', from: 'patient', content: '谢谢医生，我明白了', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    ],
  },
];

const QUICK_TEMPLATES = [
  '您好，请描述一下症状',
  '建议尽快到院检查',
  '这属于正常现象，无需担心',
  '请发一下检查报告',
  '建议预约门诊进一步评估',
  '按时服药，定期复查',
];

const STATUS_CONFIG = {
  waiting: { label: '等待中', cls: 'waiting' },
  chatting: { label: '咨询中', cls: 'chatting' },
  done: { label: '已结束', cls: 'done' },
};

function formatTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return '刚刚';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}分钟前`;
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

/** SharedMessage → ChatMessage */
function sharedToChatMsg(sm: SharedMessage): ChatMessage {
  return { id: sm.id, from: sm.from, content: sm.content, timestamp: new Date(sm.timestamp) };
}

// ─── 打字动画 ─────────────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="dc-message patient-msg">
    <div className="dc-avatar as-patient">患</div>
    <div className="dc-msg-content">
      <div className="dc-typing">
        <div className="typing-dots">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
        <span className="typing-text">患者正在输入…</span>
      </div>
    </div>
  </div>
);

// ─── 主组件 ──────────────────────────────────────────────────────────────────
const DoctorConsultPage: React.FC = () => {
  // 模拟患者列表（含在线患者占位）
  const [mockPatients, setMockPatients] = useState<Patient[]>(MOCK_PATIENTS);
  // 在线患者的共享消息
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>(
    () => loadMessages().map(sharedToChatMsg)
  );
  // 在线患者是否有新消息（打字提示）
  const [patientTyping, setPatientTyping] = useState(false);
  const patientTypingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevLiveMsgCount = useRef(liveMessages.length);

  const [activeTab, setActiveTab] = useState<'all' | 'waiting' | 'chatting' | 'done'>('all');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(LIVE_PATIENT_ID);
  const [inputValue, setInputValue] = useState('');
  const [doctorStatus, setDoctorStatus] = useState<'online' | 'busy' | 'offline'>('online');
  const [noteText, setNoteText] = useState('');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 订阅共享 store — 患者端发消息时同步
  useEffect(() => {
    const unsub = subscribeMessages((sharedMsgs) => {
      const newMsgs = sharedMsgs.map(sharedToChatMsg);
      // 检测是否有新增患者消息（触发打字动画）
      const newPatientMsgs = newMsgs.filter(m => m.from === 'patient');
      const oldPatientCount = prevLiveMsgCount.current;
      if (newPatientMsgs.length > oldPatientCount) {
        setPatientTyping(true);
        if (patientTypingTimer.current) clearTimeout(patientTypingTimer.current);
        patientTypingTimer.current = setTimeout(() => setPatientTyping(false), 1200);
        // 若当前选中在线患者，清除未读
        if (selectedPatientId === LIVE_PATIENT_ID) {
          // 已在视图中，无需额外处理
        }
      }
      prevLiveMsgCount.current = newPatientMsgs.length;
      setLiveMessages(newMsgs);
    });
    return unsub;
  }, [selectedPatientId]);

  // 合并患者列表（在线患者置顶）
  const livePatient = makeLivePatient(liveMessages);
  const allPatients: Patient[] = [livePatient, ...mockPatients];

  const filteredPatients = allPatients.filter(p =>
    activeTab === 'all' ? true : p.status === activeTab
  );

  const selectedPatient =
    selectedPatientId === LIVE_PATIENT_ID
      ? livePatient
      : mockPatients.find(p => p.id === selectedPatientId) ?? null;

  // 当前显示的消息列表
  const currentMessages =
    selectedPatientId === LIVE_PATIENT_ID
      ? liveMessages
      : selectedPatient?.messages ?? [];

  // 滚动到底部（仅在新消息追加时触发，不在初次加载时滚动）
  const prevMsgCountRef = useRef(currentMessages.length);
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (currentMessages.length > prevMsgCountRef.current || patientTyping) {
      scrollToBottom();
    }
    prevMsgCountRef.current = currentMessages.length;
  }, [currentMessages.length, patientTyping, scrollToBottom]);

  // 选择患者
  const selectPatient = useCallback((id: string) => {
    setSelectedPatientId(id);
    setNoteText('');
    if (id !== LIVE_PATIENT_ID) {
      setMockPatients(prev => prev.map(p =>
        p.id === id ? { ...p, unread: 0, status: p.status === 'waiting' ? 'chatting' : p.status } : p
      ));
    }
  }, []);

  // 发送消息
  const sendMessage = useCallback(() => {
    const content = inputValue.trim();
    if (!content || !selectedPatient) return;

    if (selectedPatientId === LIVE_PATIENT_ID) {
      // 写入共享 store，患者端会实时收到
      appendMessage({ from: 'doctor', content, timestamp: Date.now() });
    } else {
      // 模拟患者：仅本地追加
      const newMsg: ChatMessage = { id: Date.now().toString(), from: 'doctor', content, timestamp: new Date() };
      setMockPatients(prev => prev.map(p =>
        p.id === selectedPatientId
          ? { ...p, messages: [...p.messages, newMsg], lastMsg: content, lastTime: new Date(), status: 'chatting' }
          : p
      ));
    }
    setInputValue('');
    inputRef.current?.focus();
  }, [inputValue, selectedPatient, selectedPatientId]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const endConsult = useCallback(() => {
    if (!selectedPatient) return;
    if (selectedPatientId === LIVE_PATIENT_ID) {
      clearMessages();
      toast.success('咨询已结束', { description: '在线对话已清空归档' });
    } else {
      setMockPatients(prev => prev.map(p =>
        p.id === selectedPatientId ? { ...p, status: 'done' } : p
      ));
      toast.success('咨询已结束', { description: `与 ${selectedPatient.name} 的对话已归档` });
    }
  }, [selectedPatient, selectedPatientId]);

  const saveNote = useCallback(() => {
    if (!noteText.trim()) return;
    toast.success('备注已保存');
  }, [noteText]);

  const statusLabel = { online: '接诊中', busy: '忙碌', offline: '离线' }[doctorStatus];
  const statusDotCls = { online: '', busy: 'busy', offline: 'offline' }[doctorStatus];

  const groupedMessages = currentMessages.reduce((acc, msg) => {
    const key = msg.timestamp.toLocaleDateString('zh-CN');
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {} as Record<string, ChatMessage[]>);

  const waitingCount = allPatients.filter(p => p.status === 'waiting').length;
  const chattingCount = allPatients.filter(p => p.status === 'chatting').length;
  const doneCount = allPatients.filter(p => p.status === 'done').length;

  return (
    <div className="doctor-page-bg" onClick={() => setShowStatusMenu(false)}>
      <div className="doctor-topbar">
        <div className="doctor-topbar-left">
          <div className="doctor-topbar-avatar">李</div>
          <div className="doctor-topbar-info">
            <div className="doctor-topbar-name">李医生 · 乳腺科主治医师</div>
            <div className="doctor-topbar-role">市中心医院 · 乳腺外科</div>
          </div>
        </div>
        <div className="doctor-topbar-right">
          <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button className="doctor-status-badge" onClick={() => setShowStatusMenu(v => !v)}>
              <span className={`doctor-status-dot ${statusDotCls}`} />
              {statusLabel}
              <ChevronDown size={14} />
            </button>
            {showStatusMenu && (
              <div style={{ position: 'absolute', top: '110%', right: 0, background: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '8px', zIndex: 100, minWidth: '130px' }}>
                {(['online', 'busy', 'offline'] as const).map(s => (
                  <button key={s} onClick={() => { setDoctorStatus(s); setShowStatusMenu(false); }}
                    style={{ width: '100%', padding: '9px 14px', border: 'none', background: doctorStatus === s ? 'rgba(32,178,170,0.1)' : 'transparent', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: doctorStatus === s ? '#20b2aa' : '#555', textAlign: 'left' }}>
                    {{ online: '接诊中', busy: '忙碌', offline: '离线' }[s]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="doctor-topbar-btn"><Bell size={16} /></button>
          <button className="doctor-topbar-btn"><Settings size={16} /></button>
          <button className="doctor-topbar-btn" onClick={() => toast.info('已退出医生端')}><LogOut size={16} /></button>
        </div>
      </div>

      <div className="doctor-page">
        <div className="doctor-container">
          <div className="doctor-layout">

            {/* ── 左栏：患者队列 ── */}
            <aside className="doctor-sidebar">
              <div className="doctor-card">
                <div className="doctor-stats-row">
                  <div className="doctor-stat-box">
                    <div className="doctor-stat-box-value">{waitingCount}</div>
                    <div className="doctor-stat-box-label">等待中</div>
                  </div>
                  <div className="doctor-stat-box">
                    <div className="doctor-stat-box-value" style={{ color: '#20b2aa' }}>{chattingCount}</div>
                    <div className="doctor-stat-box-label">咨询中</div>
                  </div>
                  <div className="doctor-stat-box">
                    <div className="doctor-stat-box-value" style={{ color: '#94a3b8' }}>{doneCount}</div>
                    <div className="doctor-stat-box-label">已结束</div>
                  </div>
                </div>
              </div>
              <div className="doctor-card">
                <div className="doctor-card-header">
                  <h3 className="doctor-card-title">
                    <span className="doctor-card-title-icon"><Users size={14} /></span>患者队列
                  </h3>
                </div>
                <div className="patient-queue-tabs">
                  {(['all','waiting','chatting','done'] as const).map(tab => (
                    <button key={tab} className={`patient-queue-tab ${activeTab===tab?'active':''}`} onClick={() => setActiveTab(tab)}>
                      {{ all:'全部', waiting:'等待', chatting:'咨询中', done:'完成' }[tab]}
                    </button>
                  ))}
                </div>
                <div className="patient-list">
                  {filteredPatients.map(p => (
                    <div key={p.id} className={`patient-item ${selectedPatientId===p.id?'active':''}`} onClick={() => selectPatient(p.id)}>
                      <div className="patient-item-avatar">
                        {p.isLive ? '网' : p.name[0]}
                        {p.unread > 0 && <span className="unread-dot">{p.unread}</span>}
                      </div>
                      <div className="patient-item-info">
                        <div className="patient-item-name">
                          {p.name}
                          {p.isLive && <span style={{ fontSize:'10px', background:'#dcfce7', color:'#16a34a', borderRadius:'6px', padding:'1px 6px', fontWeight:700, marginLeft:'4px' }}>实时</span>}
                        </div>
                        <div className="patient-item-last-msg">{p.lastMsg}</div>
                      </div>
                      <div className="patient-item-meta">
                        <span className="patient-item-time">{formatTime(p.lastTime)}</span>
                        <span className={`patient-status-tag ${STATUS_CONFIG[p.status].cls}`}>{STATUS_CONFIG[p.status].label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* ── 中栏：聊天 ── */}
            <main className="doctor-main">
              <div className="doctor-chat-card">
                <div className="doctor-chat-header">
                  <div className="doctor-chat-header-left">
                    <div className="patient-chat-avatar">{selectedPatient?.isLive ? '网' : (selectedPatient?.name[0] ?? '?')}</div>
                    <div className="doctor-chat-header-text">
                      <div className="patient-name">
                        {selectedPatient?.name ?? '未选择患者'}
                        {selectedPatient?.isLive && <span style={{ marginLeft:'8px', fontSize:'11px', background:'#dcfce7', color:'#16a34a', borderRadius:'6px', padding:'2px 8px', fontWeight:700 }}>实时在线</span>}
                      </div>
                      <div className="patient-meta">
                        {selectedPatient?.isLive ? '通过患者端在线咨询 · 消息实时同步' : `${selectedPatient?.age ?? ''}岁 · ${selectedPatient?.chiefComplaint ?? ''}`}
                      </div>
                    </div>
                  </div>
                  <div className="doctor-chat-header-actions">
                    <button className="doctor-chat-action-btn" onClick={() => toast.info('语音通话开发中')}><PhoneCall size={17}/></button>
                    <button className="doctor-chat-action-btn" onClick={() => toast.info('视频通话开发中')}><Video size={17}/></button>
                    <button className="doctor-chat-action-btn"><MoreHorizontal size={17}/></button>
                  </div>
                </div>

                {selectedPatient ? (
                  <>
                    <div className="doctor-chat-messages">
                      {Object.entries(groupedMessages).map(([date, msgs]) => (
                        <div key={date} style={{ display:'contents' }}>
                          <div className="doctor-date-divider"><span className="doctor-date-text">{date}</span></div>
                          {msgs.map(msg => (
                            <div key={msg.id} className={`dc-message ${msg.from==='doctor'?'doctor-msg':'patient-msg'}`}>
                              <div className={`dc-avatar ${msg.from==='doctor'?'as-doctor':'as-patient'}`}>{msg.from==='doctor'?'医':'患'}</div>
                              <div className="dc-msg-content">
                                <div className="dc-msg-bubble">{msg.content}</div>
                                <div className="dc-msg-time">{msg.timestamp.toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                      {patientTyping && selectedPatientId===LIVE_PATIENT_ID && <TypingIndicator />}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className="quick-reply-bar">
                      {QUICK_TEMPLATES.map((t,i) => (
                        <button key={i} className="quick-reply-chip" onClick={() => setInputValue(t)}>{t}</button>
                      ))}
                    </div>
                    <div className="doctor-chat-input-area">
                      <div className="doctor-chat-toolbar">
                        <button className="doctor-toolbar-btn" onClick={() => toast.info('文件上传开发中')}><Paperclip size={15}/></button>
                        <button className="doctor-toolbar-btn" onClick={() => toast.info('图片上传开发中')}><Image size={15}/></button>
                        <button className="doctor-toolbar-btn"><Smile size={15}/></button>
                        <button className="doctor-toolbar-btn"><ClipboardList size={15}/></button>
                        <button className="doctor-toolbar-btn"><FileText size={15}/></button>
                      </div>
                      <div className="doctor-input-row">
                        <textarea ref={inputRef} className="doctor-input-field"
                          placeholder={selectedPatient.isLive ? '回复患者（消息将实时发送到患者端）…' : '输入回复内容…'}
                          value={inputValue} onChange={e => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown} rows={2}
                        />
                        <button className="doctor-send-btn" onClick={sendMessage} disabled={!inputValue.trim()}><Send size={18}/></button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="doctor-empty-state">
                    <div className="doctor-empty-icon"><MessageSquare size={32}/></div>
                    <div className="doctor-empty-text">请选择一位患者开始咨询</div>
                  </div>
                )}
              </div>
            </main>

            {/* ── 右栏：患者信息 ── */}
            <aside className="doctor-info-panel">
              {selectedPatient ? (
                <>
                  <div className="patient-info-card">
                    <div className="patient-info-header">
                      <div className="patient-info-avatar">{selectedPatient.isLive ? '网' : selectedPatient.name[0]}</div>
                      <div className="patient-info-name">{selectedPatient.name}</div>
                      <div className="patient-info-sub">{selectedPatient.isLive ? '在线咨询患者' : `${selectedPatient.age}岁 · ${selectedPatient.gender}`}</div>
                    </div>
                    <div className="patient-info-body">
                      <div className="patient-info-row"><span className="patient-info-label">主诉</span><span className="patient-info-value">{selectedPatient.chiefComplaint}</span></div>
                      <div className="patient-info-row"><span className="patient-info-label">初步诊断</span><span className="patient-info-value highlight">{selectedPatient.diagnosis}</span></div>
                      <div className="patient-info-row"><span className="patient-info-label">就诊次数</span><span className="patient-info-value">{selectedPatient.visitCount}次</span></div>
                      <div className="patient-info-row"><span className="patient-info-label">上次就诊</span><span className="patient-info-value">{selectedPatient.lastVisit}</span></div>
                      <div className="patient-info-row"><span className="patient-info-label">过敏史</span><span className="patient-info-value">{selectedPatient.allergyHistory}</span></div>
                      <div className="patient-info-row"><span className="patient-info-label">联系电话</span><span className="patient-info-value">{selectedPatient.phone}</span></div>
                    </div>
                  </div>
                  <div className="note-card">
                    <div className="doctor-card-header">
                      <h3 className="doctor-card-title"><span className="doctor-card-title-icon"><ClipboardList size={14}/></span>诊断备注</h3>
                    </div>
                    <textarea className="note-textarea" placeholder="记录诊断思路、注意事项…" value={noteText} onChange={e => setNoteText(e.target.value)} rows={4}/>
                    <div className="note-footer"><button className="note-save-btn" onClick={saveNote}>保存备注</button></div>
                  </div>
                  <div className="doctor-action-btns">
                    <button className="doctor-action-btn-primary" onClick={() => toast.info('处方功能开发中')}><FileText size={16}/> 开具处方</button>
                    <button className="doctor-action-btn-secondary" onClick={() => toast.info('预约功能开发中')}><Stethoscope size={16}/> 安排复诊</button>
                    <button className="doctor-action-btn-secondary" onClick={endConsult} style={{ color:'#ef4444', borderColor:'#fca5a5' }}><CheckCircle size={16}/> 结束咨询</button>
                  </div>
                </>
              ) : (
                <div className="patient-info-card">
                  <div className="doctor-empty-state">
                    <div className="doctor-empty-icon"><AlertCircle size={28}/></div>
                    <div className="doctor-empty-text">未选择患者</div>
                  </div>
                </div>
              )}
            </aside>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorConsultPage;