import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  Star, 
  ChevronLeft,
  ChevronRight,
  Search,
  Shield,
  Heart,
  Award,
  Phone,
  MessageSquare,
  CheckCircle,
  Building2,
  Filter,
  Calendar,
  UserCircle,
  CreditCard
} from 'lucide-react';
import Header from '@/components/header';
import AIAssistant from '@/components/AIAssistant/AIAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import './AppointmentPage.css';
import img1 from '@/components/td.png'
import img2 from '@/components/jc.jpg'
import img3 from '@/components/1v1.jpg'

// 轮播图数据 - 更真实的文案
const BANNER_SLIDES = [
  {
    id: 1,
    image: img1,
    title: '乳腺健康管理中心',
    subtitle: '三甲医院专家团队，专注乳腺疾病的预防与诊疗',
    cta: '预约挂号',
  },
  {
    id: 2,
    image: img2,
    title: '多学科联合门诊',
    subtitle: '外科、肿瘤科、影像科专家共同制定治疗方案',
    cta: '了解详情',
  },
  {
    id: 3,
    image: img3,
    title: '全程健康管理',
    subtitle: '从筛查到康复，提供连续性的医疗服务支持',
    cta: '咨询服务',
  },
];

// 医生数据 - 更详细真实
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
    specialty: '乳腺癌保乳手术、前哨淋巴结活检、乳腺微创旋切术',
    goodAt: '早期乳腺癌诊断',
    available: true,
    nextAvailable: '明天 09:00',
    price: '¥50',
    tags: ['教授', '博导'],
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
    specialty: '乳腺癌新辅助化疗、靶向治疗、内分泌治疗',
    goodAt: '晚期乳腺癌综合治疗',
    available: true,
    nextAvailable: '今天 14:00',
    price: '¥30',
    tags: ['副教授'],
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
    specialty: '乳腺增生症、乳腺良性肿瘤、哺乳期乳腺疾病的诊治',
    goodAt: '乳腺良性病变',
    available: false,
    nextAvailable: '后天 10:00',
    price: '¥20',
    tags: [],
  },
  {
    id: 4,
    name: '陈建国',
    title: '主任医师',
    hospital: '协和医院',
    department: '乳腺外科',
    rating: 4.9,
    consultations: 4520,
    experience: '25年',
    specialty: '乳腺癌改良根治术、乳房重建术、腔镜乳腺手术',
    goodAt: '乳腺肿瘤外科治疗',
    available: true,
    nextAvailable: '明天 14:00',
    price: '¥100',
    tags: ['教授', '享受国务院津贴'],
  },
  {
    id: 5,
    name: '刘芳',
    title: '副主任医师',
    hospital: '肿瘤医院',
    department: '乳腺肿瘤科',
    rating: 4.8,
    consultations: 2890,
    experience: '18年',
    specialty: '乳腺癌个体化化疗、HER2阳性乳腺癌靶向治疗',
    goodAt: '精准化疗方案制定',
    available: true,
    nextAvailable: '今天 16:00',
    price: '¥40',
    tags: ['副教授'],
  },
  {
    id: 6,
    name: '赵敏',
    title: '主治医师',
    hospital: '市第一人民医院',
    department: '乳腺外科',
    rating: 4.6,
    consultations: 1560,
    experience: '10年',
    specialty: '乳腺超声诊断、超声引导下穿刺活检、微创治疗',
    goodAt: '影像引导介入',
    available: true,
    nextAvailable: '明天 10:00',
    price: '¥25',
    tags: [],
  },
];

// 服务特色 - 更务实的描述
const SERVICES = [
  { 
    icon: Shield, 
    title: '规范诊疗', 
    desc: '遵循NCCN指南',
    dialogTitle: '规范化诊疗流程',
    dialogContent: [
      '严格遵循国际NCCN乳腺癌诊疗指南',
      '多学科团队（MDT）会诊制度',
      '个体化治疗方案制定',
      '术前术后全程管理',
      '5年生存率随访数据追踪'
    ]
  },
  { 
    icon: Heart, 
    title: '人文关怀', 
    desc: '保护患者隐私',
    dialogTitle: '患者关怀体系',
    dialogContent: [
      '独立诊室，一对一私密咨询',
      '女性医护团队可选',
      '心理咨询与情绪支持服务',
      '病友互助小组活动',
      '康复期生活方式指导'
    ]
  },
  { 
    icon: Award, 
    title: '权威认证', 
    desc: '三甲医疗质量',
    dialogTitle: '医疗质量保障',
    dialogContent: [
      '合作医院均为三级甲等医院',
      '医生执业资质严格审核',
      '诊疗过程全程可追溯',
      '医疗事故保险覆盖',
      '患者满意度定期回访'
    ]
  },
  { 
    icon: Phone, 
    title: '便捷服务', 
    desc: '7×24小时响应',
    dialogTitle: '便民服务体系',
    dialogContent: [
      '7×24小时预约热线：400-123-4567',
      '检查报告在线查询',
      '药品配送到家服务',
      '复诊提醒与随访管理',
      '医保实时结算支持'
    ]
  },
];

// 医院列表 - 精简到8家更真实
const HOSPITALS = [
  { name: '市中心医院', level: '三甲', address: '市中心区健康路1号', distance: '1.2km', area: '市中心' },
  { name: '省人民医院', level: '三甲', address: '省城区人民大道88号', distance: '3.5km', area: '省城区' },
  { name: '协和医院', level: '三甲', address: '市东区协和路168号', distance: '5.8km', area: '市东区' },
  { name: '肿瘤医院', level: '三甲', address: '市南区抗癌路66号', distance: '4.2km', area: '市南区' },
  { name: '市妇幼保健院', level: '三甲', address: '市西区妇幼路33号', distance: '2.1km', area: '市西区' },
  { name: '市第一人民医院', level: '三甲', address: '市北区医院路99号', distance: '6.5km', area: '市北区' },
  { name: '中医药大学附属医院', level: '三甲', address: '市东区中医路77号', distance: '7.2km', area: '市东区' },
  { name: '国际医疗中心', level: '国际部', address: '市CBD国际路100号', distance: '4.5km', area: 'CBD' },
];

// 时间段数据
const TIME_SLOTS = [
  { time: '08:00', available: true },
  { time: '08:30', available: true },
  { time: '09:00', available: false },
  { time: '09:30', available: true },
  { time: '10:00', available: true },
  { time: '10:30', available: false },
  { time: '14:00', available: true },
  { time: '14:30', available: true },
  { time: '15:00', available: true },
  { time: '15:30', available: false },
  { time: '16:00', available: true },
];

export default function AppointmentPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<typeof DOCTORS[0] | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingStep, setBookingStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    phone: '',
    idCard: '',
    symptoms: '',
  });
  const [activeServiceDialog, setActiveServiceDialog] = useState<number | null>(null);

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // 过滤医生
  const filteredDoctors = DOCTORS.filter(doctor => {
    const query = searchQuery.toLowerCase();
    return doctor.name.includes(query) || 
      doctor.hospital.includes(query) ||
      doctor.specialty.includes(query) ||
      doctor.goodAt.includes(query);
  });

  // 生成日期选项
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        display: i === 0 ? '今天' : i === 1 ? '明天' : `${date.getMonth() + 1}月${date.getDate()}日`,
        weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()],
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
    }
    return dates;
  };

  const dates = generateDates();

  // 处理预约
  const handleBook = () => {
    if (bookingStep === 1) {
      if (!selectedDate || !selectedTime) {
        toast.error('请选择预约日期和时间');
        return;
      }
      setBookingStep(2);
    } else {
      if (!patientInfo.name || !patientInfo.phone) {
        toast.error('请填写就诊人姓名和手机号码');
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(patientInfo.phone)) {
        toast.error('请输入正确的手机号码');
        return;
      }
      toast.success('预约提交成功', {
        description: `${selectedDoctor?.name}医生 ${selectedDate} ${selectedTime}，请按时就诊`,
      });
      setShowBookingDialog(false);
      setBookingStep(1);
      setSelectedDate('');
      setSelectedTime('');
      setPatientInfo({ name: '', phone: '', idCard: '', symptoms: '' });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fef7f0_0%,_#fff5f7_50%,_#f0f9ff_100%)]">
      <Header onSearch={() => {}} />
      
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* 轮播图区域 - 更自然的样式 */}
        <section className="mt-6 mb-8">
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-sm">
            {BANNER_SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">
                    {slide.title}
                  </h2>
                  <p className="text-lg text-white/90 mb-6 leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <Link to="/consult">
                    <Button className="w-fit bg-white text-gray-900 hover:bg-gray-100 font-medium px-6">
                      {slide.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            
            {/* 轮播控制 */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
            
            {/* 轮播指示器 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {BANNER_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-6' : 'bg-white/40 w-1.5 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 服务特色 - 更克制的样式 */}
        <section className="mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SERVICES.map((service, index) => (
              <button
                key={index}
                onClick={() => setActiveServiceDialog(index)}
                className="bg-white rounded-xl p-5 border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <service.icon size={20} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-[21px]">{service.title}</h3>
                <p className="text-sm text-gray-500">{service.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* 搜索栏 */}
        <section className="mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="搜索医生姓名、擅长疾病或医院..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 border-gray-200 focus:border-rose-300 focus:ring-rose-100"
                />
              </div>
              <Button variant="outline" className="gap-2 border-gray-200 text-gray-600 hover:bg-gray-50">
                <Filter size={18} />
                筛选条件
              </Button>
            </div>
          </div>
        </section>

        {/* 医生列表 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">推荐专家</h2>
            </div>
            <Link to="/doctors" className="text-sm text-rose-600 hover:text-rose-700 font-medium">
              查看全部
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* 医生头部信息 */}
                <div className="p-5 border-b border-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-100 to-pink-50 flex items-center justify-center text-lg font-bold text-rose-700 shrink-0">
                      {doctor.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg text-[21px]">{doctor.name}</h3>
                        <span className={`text-sm px-2 py-0.5 rounded-full ${
                          doctor.available 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {doctor.available ? '可预约' : '约满'}
                        </span>
                      </div>
                      <p className="text-[15px] text-gray-600 mb-1">{doctor.title} · {doctor.department}</p>
                      <p className="text-[15px] text-gray-500 flex items-center gap-1">
                        <Building2 size={14} />
                        {doctor.hospital}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 医生详细信息 */}
                <div className="p-5 space-y-4">
                  {/* 评分与经验 */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-gray-900 text-[16px]">{doctor.rating}</span>
                      <span className="text-gray-400 text-[16px]">({doctor.consultations}次咨询)</span>
                    </div>
                    <div className="text-gray-500 text-[16px]">{doctor.experience}临床经验</div>
                  </div>

                  {/* 擅长领域 */}
                  <div>
                    <p className="text-[16px] text-gray-400 mb-1.5 ">擅长</p>
                    <p className="text-[16px] text-gray-700 leading-relaxed line-clamp-2">
                      {doctor.specialty}
                    </p>
                  </div>

                  {/* 标签 */}
                  {doctor.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {doctor.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs rounded-md border border-rose-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 下次可约与价格 */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      <Clock size={14} className="inline mr-1" />
                      {doctor.nextAvailable}
                    </div>
                    <div className="text-lg font-bold text-rose-600">{doctor.price}</div>
                  </div>
                </div>

                {/* 预约按钮 */}
                <div className="px-5 pb-5">
                  <Button
                    className={`w-full ${
                      doctor.available
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!doctor.available}
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setShowBookingDialog(true);
                    }}
                  >
                    {doctor.available ? '立即预约' : '暂时约满'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 合作医院 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">合作医疗机构</h2>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOSPITALS.map((hospital, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{hospital.name}</h4>
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                    {hospital.level}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3 flex items-start gap-1.5">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                  {hospital.address}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{hospital.area}</span>
                  <span className="text-rose-600 font-medium">{hospital.distance}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* AI助手 */}
      <AIAssistant />

      {/* 预约弹窗 - 加宽版本 */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto z-[1100]">
          <DialogHeader className="border-b border-gray-100 pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900">
              {bookingStep === 1 ? '选择就诊时间' : '填写就诊信息'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDoctor && (
            <div className="flex items-center gap-4 py-4 bg-gray-50 rounded-lg px-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center font-bold text-rose-700 text-lg">
                {selectedDoctor.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-gray-900">{selectedDoctor.name} <span className="text-sm font-normal text-gray-500">{selectedDoctor.title}</span></div>
                <div className="text-sm text-gray-600">{selectedDoctor.hospital} · {selectedDoctor.department}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm text-gray-500">挂号费</div>
                <div className="text-lg font-bold text-rose-600">{selectedDoctor.price}</div>
              </div>
            </div>
          )}

          {bookingStep === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-rose-600" />
                  选择日期
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {dates.map((date) => (
                    <button
                      key={date.date}
                      onClick={() => setSelectedDate(date.date)}
                      className={`p-3 rounded-lg text-center transition-all border ${
                        selectedDate === date.date
                          ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                          : date.isWeekend
                          ? 'bg-orange-50 border-orange-100 text-gray-700 hover:border-rose-300'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300'
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">{date.display}</div>
                      <div className={`text-xs ${selectedDate === date.date ? 'text-rose-100' : 'text-gray-400'}`}>
                        {date.weekday}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock size={16} className="text-rose-600" />
                    选择时间段
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {TIME_SLOTS.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`py-3 px-2 rounded-lg text-sm font-medium transition-all border relative ${
                          selectedTime === slot.time
                            ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                            : slot.available
                            ? 'bg-white border-gray-200 text-gray-700 hover:border-rose-400 hover:text-rose-600'
                            : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                        {!slot.available && (
                          <span className="absolute -top-1 -right-1 bg-gray-200 text-gray-500 text-[10px] px-1.5 rounded">
                            满
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDate && selectedTime && (
                <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle className="text-rose-600 shrink-0" size={20} />
                  <div className="text-sm text-gray-700">
                    已选择：<span className="font-semibold text-gray-900">{selectedDate}</span> <span className="font-semibold text-gray-900">{selectedTime}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    就诊人姓名 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="请输入真实姓名"
                      value={patientInfo.name}
                      onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                      className="pl-10 border-gray-200 focus:border-rose-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    手机号码 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="请输入11位手机号"
                      value={patientInfo.phone}
                      onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                      className="pl-10 border-gray-200 focus:border-rose-300"
                      maxLength={11}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  身份证号（选填）
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="用于医保结算，选填"
                    value={patientInfo.idCard}
                    onChange={(e) => setPatientInfo({ ...patientInfo, idCard: e.target.value })}
                    className="pl-10 border-gray-200 focus:border-rose-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  病情描述（选填）
                </label>
                <textarea
                  placeholder="请简要描述您的症状、既往病史或咨询目的，便于医生提前了解"
                  value={patientInfo.symptoms}
                  onChange={(e) => setPatientInfo({ ...patientInfo, symptoms: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-rose-300 focus:ring-2 focus:ring-rose-100 text-sm resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">已输入 {patientInfo.symptoms.length} 字</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">就诊时间</span>
                  <span className="font-medium text-gray-900">{selectedDate} {selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">就诊医生</span>
                  <span className="font-medium text-gray-900">{selectedDoctor?.name}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600">挂号费用</span>
                  <span className="font-bold text-rose-600 text-lg">{selectedDoctor?.price}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                <Shield className="shrink-0 mt-0.5 text-blue-500" size={14} />
                <p>您的个人信息将严格保密，仅用于本次就诊预约。预约成功后如需取消，请提前2小时告知。</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
            {bookingStep === 2 && (
              <Button
                variant="outline"
                onClick={() => setBookingStep(1)}
                className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                返回修改
              </Button>
            )}
            <Button
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white h-11"
              onClick={handleBook}
            >
              {bookingStep === 1 ? '下一步，填写信息' : '确认预约'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 服务特色弹窗 */}
      <Dialog open={activeServiceDialog !== null} onOpenChange={() => setActiveServiceDialog(null)}>
      <DialogContent className="sm:max-w-md z-[1100]">
          {activeServiceDialog !== null && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-lg font-bold text-gray-900">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                    {(() => {
                      const IconComponent = SERVICES[activeServiceDialog].icon;
                      return <IconComponent size={20} />;
                    })()}
                  </div>
                  {SERVICES[activeServiceDialog].dialogTitle}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <ul className="space-y-3">
                  {SERVICES[activeServiceDialog].dialogContent.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link to="/consult" onClick={() => setActiveServiceDialog(null)}>
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white">
                    <MessageSquare size={16} className="mr-2" />
                    咨询详情
                  </Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
