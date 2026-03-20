import { useState } from 'react';
import { 
  Phone, 
  AlertCircle, 
  Ambulance, 
  MapPin, 
  Copy,
  Navigation,
  ChevronRight,
  Heart,
  Clock,
  Shield,
  Stethoscope
} from 'lucide-react';
import Header from '@/components/header';
import AIAssistant from '@/components/AIAssistant/AIAssistant';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import './EmergencyPage.css';

// 紧急联系电话
const EMERGENCY_CONTACTS = [
  {
    id: 1,
    name: '24小时急救热线',
    number: '400-123-4567',
    description: '全天候专业医疗咨询与急救指导',
    icon: Phone,
    color: '#ef4444',
    bgColor: '#fef2f2',
  },
  {
    id: 2,
    name: '乳腺癌专科热线',
    number: '400-888-9999',
    description: '乳腺专科医生在线解答',
    icon: Stethoscope,
    color: '#ff4d94',
    bgColor: '#fff5f7',
  },
  {
    id: 3,
    name: '全国急救电话',
    number: '120',
    description: '遇到紧急情况请立即拨打',
    icon: Ambulance,
    color: '#dc2626',
    bgColor: '#fef2f2',
  },
];

// 推荐医院
const HOSPITALS = [
  {
    id: 1,
    name: '市中心医院',
    address: '市中心区人民路100号',
    distance: '2.5km',
    phone: '010-12345678',
    is24Hour: true,
    level: '三甲',
  },
  {
    id: 2,
    name: '省人民医院',
    address: '市南区健康路88号',
    distance: '5.8km',
    phone: '010-87654321',
    is24Hour: true,
    level: '三甲',
  },
];

// 急救指南
const FIRST_AID_GUIDES = [
  {
    id: 1,
    title: '术后出血',
    icon: Shield,
    steps: ['保持冷静', '按压伤口', '抬高患肢', '立即就医'],
    color: '#f59e0b',
  },
  {
    id: 2,
    title: '高烧不退',
    icon: Clock,
    steps: ['测量体温', '物理降温', '多饮水', '及时就医'],
    color: '#3b82f6',
  },
  {
    id: 3,
    title: '伤口感染',
    icon: AlertCircle,
    steps: ['观察症状', '保持清洁', '不要挤压', '联系医生'],
    color: '#ef4444',
  },
];

export default function EmergencyPage() {
  const [selectedGuide, setSelectedGuide] = useState<typeof FIRST_AID_GUIDES[0] | null>(null);
  const [showGuideDialog, setShowGuideDialog] = useState(false);

  const copyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    toast.success('电话号码已复制');
  };

  const callNumber = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const viewGuide = (guide: typeof FIRST_AID_GUIDES[0]) => {
    setSelectedGuide(guide);
    setShowGuideDialog(true);
  };

  return (
    <div className="page-bg">
      <Header onSearch={() => {}} />
      
      <div className="emergency-page">
        {/* 主热线区 */}
        <div className="emergency-hero">
          <div className="hero-content">
            <div className="hero-icon-wrapper">
              <Phone size={40} />
            </div>
            <div className="hero-text">
              <span className="hero-label">24小时急救热线</span>
              <h1 className="hero-number">400-123-4567</h1>
              <p className="hero-desc">全天候专业医疗咨询与急救指导</p>
            </div>
          </div>
          <div className="hero-actions">
            <Button className="hero-call-btn" onClick={() => callNumber('400-123-4567')}>
              <Phone size={18} />
              立即拨打
            </Button>
            <Button variant="outline" className="hero-copy-btn" onClick={() => copyNumber('400-123-4567')}>
              <Copy size={18} />
              复制号码
            </Button>
          </div>
        </div>

        <div className="emergency-container">
          {/* 其他联系方式 */}
          <div className="contacts-section">
            <h2 className="section-title">其他联系方式</h2>
            <div className="contacts-grid">
              {EMERGENCY_CONTACTS.slice(1).map((contact) => (
                <div key={contact.id} className="contact-card" style={{ background: contact.bgColor }}>
                  <div className="contact-icon" style={{ color: contact.color }}>
                    <contact.icon size={28} />
                  </div>
                  <div className="contact-info">
                    <div className="contact-name">{contact.name}</div>
                    <div className="contact-number" style={{ color: contact.color }}>{contact.number}</div>
                    <div className="contact-desc">{contact.description}</div>
                  </div>
                  <div className="contact-actions">
                    <button 
                      className="action-btn call" 
                      onClick={() => callNumber(contact.number)}
                      style={{ background: contact.color }}
                    >
                      <Phone size={18} />
                    </button>
                    <button className="action-btn copy" onClick={() => copyNumber(contact.number)}>
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 附近医院 */}
          <div className="hospitals-section">
            <h2 className="section-title">附近医院</h2>
            <div className="hospitals-grid">
              {HOSPITALS.map((hospital) => (
                <div key={hospital.id} className="hospital-card">
                  <div className="hospital-header">
                    <div className="hospital-icon">
                      <MapPin size={24} />
                    </div>
                    <div className="hospital-info">
                      <div className="hospital-name-row">
                        <span className="hospital-name">{hospital.name}</span>
                        <span className="hospital-level">{hospital.level}</span>
                      </div>
                      <div className="hospital-address">{hospital.address}</div>
                    </div>
                  </div>
                  <div className="hospital-footer">
                    <div className="hospital-meta">
                      <span className="distance">{hospital.distance}</span>
                      {hospital.is24Hour && <span className="tag">24小时</span>}
                    </div>
                    <div className="hospital-actions">
                      <button onClick={() => callNumber(hospital.phone)}>
                        <Phone size={16} />
                      </button>
                      <button onClick={() => toast.info('导航功能开发中')}>
                        <Navigation size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 急救指南 */}
          <div className="guides-section">
            <h2 className="section-title">急救指南</h2>
            <div className="guides-grid">
              {FIRST_AID_GUIDES.map((guide) => (
                <div 
                  key={guide.id} 
                  className="guide-card"
                  onClick={() => viewGuide(guide)}
                  style={{ borderColor: `${guide.color}30` }}
                >
                  <div className="guide-icon" style={{ background: `${guide.color}15`, color: guide.color }}>
                    <guide.icon size={24} />
                  </div>
                  <div className="guide-title">{guide.title}</div>
                  <ChevronRight size={18} className="guide-arrow" style={{ color: guide.color }} />
                </div>
              ))}
            </div>
          </div>

          {/* 底部提示 */}
          <div className="emergency-footer">
            <div className="footer-icon">
              <Heart size={24} />
            </div>
            <div className="footer-text">
              <strong>温馨提示</strong>
              <p>本平台提供的咨询服务不能替代紧急医疗救治，遇到危及生命的紧急情况请立即拨打120</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI助手浮动按钮 */}
      <AIAssistant />

      {/* 急救指南弹窗 */}
      <Dialog open={showGuideDialog} onOpenChange={setShowGuideDialog}>
        <DialogContent className="sm:max-w-sm">
          {selectedGuide && (
            <>
              <DialogHeader>
                <DialogTitle style={{ color: selectedGuide.color }}>
                  <selectedGuide.icon size={20} style={{ marginRight: 8 }} />
                  {selectedGuide.title}处理指南
                </DialogTitle>
              </DialogHeader>
              <div className="guide-steps">
                {selectedGuide.steps.map((step, idx) => (
                  <div key={idx} className="step-item">
                    <span className="step-num" style={{ background: selectedGuide.color }}>{idx + 1}</span>
                    <span className="step-text">{step}</span>
                  </div>
                ))}
              </div>
              <div className="guide-notice">
                <AlertCircle size={16} />
                <span>以上仅为临时处理，请尽快就医</span>
              </div>
              <Button 
                className="guide-call-btn" 
                onClick={() => callNumber('400-123-4567')}
                style={{ background: selectedGuide.color }}
              >
                <Phone size={16} />
                拨打热线
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
