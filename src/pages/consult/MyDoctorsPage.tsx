import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  MessageSquare, 
  Calendar, 
  Search,
  ChevronRight,
  Stethoscope,
  Heart,
  Scan,
  Phone,
  Award
} from 'lucide-react';
import Header from '@/components/header';
import AIAssistant from '@/components/AIAssistant/AIAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import './MyDoctorsPage.css';

// 医生数据 - 更真实的信息
const DOCTORS = [
  {
    id: 1,
    name: '李明华',
    title: '主任医师',
    hospital: '市中心医院',
    department: '乳腺外科',
    rating: 4.9,
    consultations: 3280,
    experience: '20年',
    specialty: '乳腺癌保乳手术、前哨淋巴结活检',
    goodAt: '早期乳腺癌诊断与治疗',
    avatar: '李',
    isOnline: true,
    bodyPart: 'left-breast',
    bodyPartName: '左乳',
    color: '#e07a8a', // 更柔和的玫瑰色
    phone: '13800138001',
  },
  {
    id: 2,
    name: '王雪梅',
    title: '副主任医师',
    hospital: '省人民医院',
    department: '乳腺肿瘤科',
    rating: 4.8,
    consultations: 2156,
    experience: '15年',
    specialty: '乳腺癌化疗、内分泌治疗',
    goodAt: '晚期乳腺癌综合治疗',
    avatar: '王',
    isOnline: false,
    bodyPart: 'right-breast',
    bodyPartName: '右乳',
    color: '#5a9aa8', // 更沉稳的青绿色
    phone: '13800138002',
  },
  {
    id: 3,
    name: '张晓燕',
    title: '主治医师',
    hospital: '市妇幼保健院',
    department: '乳腺科',
    rating: 4.7,
    consultations: 1890,
    experience: '12年',
    specialty: '乳腺增生、良性肿瘤诊治',
    goodAt: '乳腺良性病变管理',
    avatar: '张',
    isOnline: true,
    bodyPart: 'lymph',
    bodyPartName: '淋巴系统',
    color: '#8b7fb8', // 更柔和的紫色
    phone: '13800138003',
  },
];

// 身体部位 - 调整位置更精准
const BODY_PARTS = [
  { id: 'left-breast', name: '左乳', x: 38, y: 42, color: '#e07a8a' },
  { id: 'right-breast', name: '右乳', x: 62, y: 42, color: '#5a9aa8' },
  { id: 'lymph', name: '腋下淋巴', x: 50, y: 28, color: '#8b7fb8' },
];

export default function MyDoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<typeof DOCTORS[0] | null>(null);
  const [showDoctorDetail, setShowDoctorDetail] = useState(false);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // 过滤医生
  const filteredDoctors = DOCTORS.filter(doctor => {
    const query = searchQuery.toLowerCase();
    return doctor.name.includes(query) || 
      doctor.hospital.includes(query) ||
      doctor.specialty.includes(query);
  });

  // 处理在线咨询
  const handleConsult = (e: React.MouseEvent, doctor: typeof DOCTORS[0]) => {
    e.stopPropagation();
    if (!doctor.isOnline) {
      toast.info(`${doctor.name}医生当前不在线，您可以留言或预约咨询时间`);
      return;
    }
    toast.success(`正在连接${doctor.name}医生...`);
  };

  // 查看医生详情
  const viewDoctorDetail = (doctor: typeof DOCTORS[0]) => {
    setSelectedDoctor(doctor);
    setShowDoctorDetail(true);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fef7f0_0%,_#fff5f7_50%,_#f0f9ff_100%)]">
      <Header onSearch={() => {}} />
      
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* 页面标题 - 更简洁 */}

<div className="mb-5">
  <div className="relative max-w-md">
    <span
      className="
        absolute left-3 top-1/2 -translate-y-1/2
        text-[12px] font-medium
        text-gray-600 bg-gray-50
        border border-gray-200
        rounded-md px-2 py-0.5
        hidden sm:inline-flex
      "
    >
      搜索
    </span>
    <Search
      size={18}
      className="absolute left-3 sm:left-[64px] top-1/2 -translate-y-1/2 text-gray-400"
    />
    <Input
      placeholder="搜索医生姓名、医院或专长…"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="
        pl-10 sm:pl-[92px] pr-3 py-2.5
        rounded-lg
        text-[14px]
        bg-white
        border border-gray-200
        shadow-sm
        placeholder:text-gray-400
        focus:border-[#cfd9ee]
        focus:ring-4 focus:ring-[#eaf0fb]
        transition
      "
    />
  </div>
</div>


        {/* 主体内容 - 左右布局 */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* 左侧医生列表 - 占7列 */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Stethoscope size={18} className="text-rose-500" />
                我的医生
              </h2>
              <span className="text-sm text-gray-500">{filteredDoctors.length} 位医生</span>
            </div>
            
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <div 
                  key={doctor.id} 
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => viewDoctorDetail(doctor)}
                  onMouseEnter={() => setHoveredPart(doctor.bodyPart)}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  <div className="flex items-start gap-4">
                    {/* 头像 */}
                    <div className="relative shrink-0">
                      <div 
                        className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white"
                        style={{ background: doctor.color }}
                      >
                        {doctor.avatar}
                      </div>
                      {doctor.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    
                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg text-[21px]">{doctor.name}</h3>
                        <span className="text-sm text-gray-500 text-[14px]">{doctor.title}</span>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: `${doctor.color}20`, color: doctor.color }}
                        >
                          {doctor.bodyPartName}
                        </span>
                      </div>
                      
                      <p className="text-[16px] text-gray-600 mb-2">{doctor.hospital} · {doctor.department}</p>
                      
                      <p className="text-[16px] text-gray-500 line-clamp-1 mb-3">
                        擅长：{doctor.specialty}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1 text-[16px] ">
                          <Star size={16} className="fill-amber-400 text-amber-400" />
                          {doctor.rating}分
                        </span>
                        <span className='text-[16px] '>{doctor.consultations}次咨询</span>
                        <span className='text-[16px] '>{doctor.experience}临床经验</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
                    <Button 
                      size="sm"
                      className="flex-1 bg-pink-400 hover:bg-pink-600 text-white"
                      onClick={(e) => handleConsult(e, doctor)}
                    >
                      <MessageSquare size={16} className="mr-1.5 text-[16px] " />
                      {doctor.isOnline ? '立即咨询' : '留言咨询'}
                    </Button>
                    <Link to="/appointment" className="flex-1" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="outline" className="w-full border-gray-200 text-gray-600 hover:bg-gray-50">
                        <Calendar size={14} className="mr-1.5" />
                        预约挂号
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* 添加更多医生 */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
              <span className="text-sm text-gray-600">需要寻找更多专业医生？</span>
              <Link to="/appointment">
                <Button variant="link" className="text-rose-600 hover:text-rose-700 p-0 h-auto font-medium">
                  浏览全部医生
                  <ChevronRight size={16} />
                </Button>
              </Link>
            </div>
          </div>

          {/* 右侧人体透视图 - 占5列 */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Scan size={18} className="text-rose-500" />
                健康监测视图
              </h3>
              
              {/* 人体透视图SVG - 保持但优化样式 */}
              <div className="relative w-full aspect-[3/4] max-w-sm mx-auto">
                <svg viewBox="0 0 300 400" className="w-full h-full">
                  <defs>
                    {/* 柔和渐变 */}
                    <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fdf2f4" />
                      <stop offset="50%" stopColor="#fff5f7" />
                      <stop offset="100%" stopColor="#fdf2f4" />
                    </linearGradient>
                    
                    <linearGradient id="boneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f1f5f9" />
                      <stop offset="100%" stopColor="#e2e8f0" />
                    </linearGradient>
                    
                    {/* 柔和发光 */}
                    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur"/>
                      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                  </defs>
                  
                  {/* 身体轮廓 - 更柔和 */}
                  <ellipse cx="150" cy="55" rx="42" ry="48" fill="url(#skinGradient)" stroke="#e2e8f0" strokeWidth="1.5"/>
                  
                  {/* 颈部 */}
                  <path d="M132 95 L132 112 L168 112 L168 95" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5"/>
                  
                  {/* 胸腔 */}
                  <path d="M80 112 Q150 105 220 112 L228 195 Q150 205 72 195 Z" fill="url(#skinGradient)" stroke="#e2e8f0" strokeWidth="1.5"/>
                  
                  {/* 肋骨 - 更淡 */}
                  <ellipse cx="150" cy="140" rx="65" ry="32" fill="none" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.5"/>
                  <ellipse cx="150" cy="160" rx="60" ry="28" fill="none" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.4"/>
                  <ellipse cx="150" cy="175" rx="52" ry="22" fill="none" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.3"/>
                  
                  {/* 脊柱 */}
                  <line x1="150" y1="112" x2="150" y2="195" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                  
                  {/* 锁骨 */}
                  <path d="M88 122 Q150 115 212 122" fill="none" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
                  
                  {/* 左乳 - 更柔和的颜色 */}
                  <ellipse 
                    cx="118" cy="152" rx="30" ry="26" 
                    fill={hoveredPart === 'left-breast' ? '#e07a8a' : '#fce7eb'}
                    stroke={hoveredPart === 'left-breast' ? '#d45d6e' : '#f5c6cb'}
                    strokeWidth={hoveredPart === 'left-breast' ? '2.5' : '1.5'}
                    opacity={hoveredPart === 'left-breast' ? '0.9' : '0.7'}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  {/* 左乳内部结构 */}
                  <ellipse cx="118" cy="152" rx="18" ry="14" fill="none" stroke={hoveredPart === 'left-breast' ? '#fff' : '#f5c6cb'} strokeWidth="1" opacity="0.4"/>
                  
                  {/* 右乳 */}
                  <ellipse 
                    cx="182" cy="152" rx="30" ry="26" 
                    fill={hoveredPart === 'right-breast' ? '#5a9aa8' : '#e0f2f5'}
                    stroke={hoveredPart === 'right-breast' ? '#4a8591' : '#b8e0e6'}
                    strokeWidth={hoveredPart === 'right-breast' ? '2.5' : '1.5'}
                    opacity={hoveredPart === 'right-breast' ? '0.9' : '0.7'}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  {/* 右乳内部结构 */}
                  <ellipse cx="182" cy="152" rx="18" ry="14" fill="none" stroke={hoveredPart === 'right-breast' ? '#fff' : '#b8e0e6'} strokeWidth="1" opacity="0.4"/>
                  
                  {/* 腋下淋巴 - 左侧 */}
                  <circle 
                    cx="75" cy="128" r="12" 
                    fill={hoveredPart === 'lymph' ? '#8b7fb8' : '#f3f0f9'}
                    stroke={hoveredPart === 'lymph' ? '#7a6ea6' : '#d9d4e8'}
                    strokeWidth={hoveredPart === 'lymph' ? '2.5' : '1.5'}
                    opacity={hoveredPart === 'lymph' ? '0.9' : '0.6'}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  
                  {/* 腋下淋巴 - 右侧 */}
                  <circle 
                    cx="225" cy="128" r="12" 
                    fill={hoveredPart === 'lymph' ? '#8b7fb8' : '#f3f0f9'}
                    stroke={hoveredPart === 'lymph' ? '#7a6ea6' : '#d9d4e8'}
                    strokeWidth={hoveredPart === 'lymph' ? '2.5' : '1.5'}
                    opacity={hoveredPart === 'lymph' ? '0.9' : '0.6'}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  
                  {/* 颈部淋巴 */}
                  <circle 
                    cx="150" cy="92" r="10" 
                    fill={hoveredPart === 'lymph' ? '#8b7fb8' : '#f3f0f9'}
                    stroke={hoveredPart === 'lymph' ? '#7a6ea6' : '#d9d4e8'}
                    strokeWidth={hoveredPart === 'lymph' ? '2.5' : '1.5'}
                    opacity={hoveredPart === 'lymph' ? '0.85' : '0.5'}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  
                  {/* 标注线 - 更细更淡 */}
                  <line x1="88" y1="152" x2="55" y2="152" stroke="#e07a8a" strokeWidth="1" strokeDasharray="3,3" opacity={hoveredPart === 'left-breast' ? '0.8' : '0.3'}/>
                  <circle cx="55" cy="152" r="3" fill="#e07a8a" opacity={hoveredPart === 'left-breast' ? '0.8' : '0.3'}/>
                  
                  <line x1="212" y1="152" x2="245" y2="152" stroke="#5a9aa8" strokeWidth="1" strokeDasharray="3,3" opacity={hoveredPart === 'right-breast' ? '0.8' : '0.3'}/>
                  <circle cx="245" cy="152" r="3" fill="#5a9aa8" opacity={hoveredPart === 'right-breast' ? '0.8' : '0.3'}/>
                  
                  <line x1="150" y1="80" x2="150" y2="55" stroke="#8b7fb8" strokeWidth="1" strokeDasharray="3,3" opacity={hoveredPart === 'lymph' ? '0.8' : '0.3'}/>
                  <circle cx="150" cy="55" r="3" fill="#8b7fb8" opacity={hoveredPart === 'lymph' ? '0.8' : '0.3'}/>
                </svg>
                
                {/* 部位标签 - 更简洁 */}
                {BODY_PARTS.map((part) => (
                  <div 
                    key={part.id}
                    className={`absolute px-2 py-1 rounded text-xs font-medium text-white transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${hoveredPart === part.id ? 'opacity-100' : 'opacity-0'}`}
                    style={{ 
                      left: `${part.x}%`, 
                      top: `${part.y}%`,
                      background: part.color,
                    }}
                  >
                    {part.name}
                  </div>
                ))}
              </div>
              
              {/* 图例 - 更紧凑 */}
              <div className="mt-4 space-y-2">
                {DOCTORS.map((doctor) => (
                  <div 
                    key={doctor.id} 
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${hoveredPart === doctor.bodyPart ? 'bg-gray-50' : ''}`}
                    onMouseEnter={() => setHoveredPart(doctor.bodyPart)}
                    onMouseLeave={() => setHoveredPart(null)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: doctor.color }}></span>
                      <span className="text-sm text-gray-600">{doctor.bodyPartName}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{doctor.name}</span>
                  </div>
                ))}
              </div>
              
              {/* 健康提示 - 更专业 */}
              <div className="mt-4 p-3 bg-rose-50 rounded-lg border border-rose-100">
                <div className="flex items-center gap-2 text-rose-700 text-sm font-medium mb-1">
                  <Heart size={14} />
                  <span>健康提醒</span>
                </div>
                <p className="text-xs text-rose-600 leading-relaxed">
                  建议每月月经结束后7-10天进行乳腺自检，40岁以上女性每年进行一次乳腺超声或钼靶检查。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI助手 */}
      <AIAssistant />

      {/* 医生详情弹窗 - 更宽更实用 */}
      <Dialog open={showDoctorDetail} onOpenChange={setShowDoctorDetail}>
        <DialogContent className="sm:max-w-lg">
          {selectedDoctor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">医生详情</DialogTitle>
              </DialogHeader>
              
              <div className="mt-4">
                {/* 头部信息 */}
                <div className="flex items-start gap-4 mb-6">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0"
                    style={{ background: selectedDoctor.color }}
                  >
                    {selectedDoctor.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-900">{selectedDoctor.name}</h3>
                      <span className="text-sm text-gray-500">{selectedDoctor.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{selectedDoctor.hospital}</p>
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ background: `${selectedDoctor.color}20`, color: selectedDoctor.color }}
                      >
                        负责{selectedDoctor.bodyPartName}
                      </span>
                      {selectedDoctor.isOnline ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                          在线
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                          离线
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 详细信息 */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Award size={14} className="text-rose-500" />
                      专业擅长
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                      {selectedDoctor.specialty}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{selectedDoctor.rating}</div>
                      <div className="text-xs text-gray-500">患者评分</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{selectedDoctor.consultations}</div>
                      <div className="text-xs text-gray-500">咨询次数</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{selectedDoctor.experience}</div>
                      <div className="text-xs text-gray-500">临床经验</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Phone size={14} className="text-rose-500" />
                      联系方式
                    </h4>
                    <p className="text-sm text-gray-600">{selectedDoctor.phone}</p>
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                    onClick={(e) => handleConsult(e, selectedDoctor)}
                  >
                    <MessageSquare size={16} className="mr-2" />
                    {selectedDoctor.isOnline ? '立即咨询' : '留言咨询'}
                  </Button>
                  <Link to="/appointment" className="flex-1">
                    <Button variant="outline" className="w-full border-gray-200 text-gray-600 hover:bg-gray-50">
                      <Calendar size={16} className="mr-2" />
                      预约挂号
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
