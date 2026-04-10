import { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/header';
import { Star, MapPin, Check, Flame, Calendar, User, Clock, X, ChevronRight, MessageCircle, Award, Shield, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const allTags = ['全部', '经验丰富', '耐心细致', '专业认证', '好评如潮', '资深专家'];

const teamMembers = [
  { name: '陈医生', city: '北京', rating: 5.0, services: '680+', image: '/doctor-new-1.jpg', tags: ['经验丰富', '资深专家', '好评如潮'], description: '从事陪诊行业15年，拥有丰富的医疗行业经验和深厚的人文关怀精神' },
  { name: '刘医生', city: '上海', rating: 4.9, services: '520+', image: '/doctor-new-2.jpg', tags: ['耐心细致', '专业认证', '好评如潮'], description: '用真诚和耐心服务好每一位客户，帮助客户缓解精神压力' },
  { name: '赵医生', city: '广州', rating: 5.0, services: '480+', image: '/doctor-new-3.jpg', tags: ['经验丰富', '专业认证'], description: '工作细致周到，有陪诊师证书和心理咨询师证书' },
  { name: '孙医生', city: '深圳', rating: 4.9, services: '420+', image: '/doctor-new-4.jpg', tags: ['耐心细致', '资深专家'], description: '医院工作五年，熟悉各项医保报销、交费流程，期待与您的合作' },
];

const processSteps = [
  { number: '1', title: '在线预约', description: '通过官网或APP选择服务类型、时间、医院及陪诊师，提交预约申请', image: '/process-bg-1.jpg' },
  { number: '2', title: '需求确认', description: '客服人员与您联系，确认就诊信息、特殊需求及注意事项，匹配合适的陪诊师', image: '/process-bg-2.jpg' },
  { number: '3', title: '陪诊服务', description: '陪诊师提前到达约定地点，全程陪同就医，协助完成各项检查，记录医嘱', image: '/process-bg-3.jpg' },
  { number: '4', title: '服务反馈', description: '服务结束后，陪诊师上传就诊总结，您可对服务进行评价，提出建议', image: '/process-bg-4.jpg' },
];

const services = [
  { name: '送/取/买/跑腿等服务', price: '98', unit: '/次起', features: ['1小时服务', '协助挂号、取号、候诊', '检查引导与结果领取', '医嘱记录与用药指导'], popular: false },
  { name: '2小时陪诊', price: '158', unit: '/次起', features: ['2小时陪诊服务', '诊前沟通、排队取号', '候诊检查、排队缴费', '陪同检查、办理手续、窗口取药等'], popular: true },
  { name: '护工', price: '330', unit: '/天起', features: ['生活照护', '身体照护', '专业照护', '心理照护'], popular: false },
  { name: '全天陪诊', price: '318', unit: '/次起', features: ['8小时陪诊服务', '诊前沟通、排队取号', '候诊检查、排队缴费', '陪同检查、办理手续、窗口取药等'], popular: false },
  { name: '代问诊', price: '198', unit: '/次起', features: ['问诊内容由患者提供', '问诊专员携带资料找医生问诊', '全程记录医嘱', '省去患者来回奔波'], popular: false },
  { name: '检查预约', price: '158', unit: '/次起', features: ['核磁共振预约', 'CT预约', 'X光预约', '其他检查预约'], popular: false },
];

const faqs = [
  { question: '陪诊师都具备哪些资质？', answer: '我们的陪诊师均经过严格实名认证和专业培训，持证上岗。' },
  { question: '如何预约陪诊服务？', answer: '可在线提交预约申请，或联系平台客服进行电话预约。' },
  { question: '陪诊服务收费标准是什么？', answer: '价格透明公开，按服务类型和时长计费，无隐藏费用。' },
  { question: '如何保障患者隐私安全？', answer: '平台和陪诊师签署保密协议，并使用加密手段保护数据安全。' },
  { question: '对服务不满意可以退款吗？', answer: '支持售后反馈与处理，确属服务问题将按规则退款。' },
];

const advantages = [
  { icon: Award, title: '专业认证', description: '所有陪诊师均经过实名认证及专业培训' },
  { icon: MapPin, title: '全国覆盖', description: '服务网络遍布全国主要城市' },
  { icon: Shield, title: '隐私保护', description: '严格保护患者隐私信息安全无忧' },
  { icon: FileCheck, title: '保险承保', description: '平台所有订单由保险承保' },
];

const stats = [
  { value: '95%+', label: '城市覆盖率' },
  { value: '6万+', label: '专业陪诊师' },
  { value: '100万+', label: '服务人次' },
  { value: '99.99%', label: '用户满意度' },
];

const BookingPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [selectedTag, setSelectedTag] = useState('全部');
  const [activeProcess, setActiveProcess] = useState(0);
  const [activeFaq, setActiveFaq] = useState(0);

  const filteredMembers = selectedTag === '全部'
    ? teamMembers
    : teamMembers.filter(member => member.tags.includes(selectedTag));

  const handleBooking = (serviceName: string) => {
    setSelectedService(serviceName);
    setDialogOpen(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveProcess((prev) => (prev + 1) % processSteps.length);
      setActiveFaq((prev) => (prev + 1) % faqs.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page-bg">
      <Header onSearch={() => {}} hideSearch />

      <section className="relative w-full min-h-[600px] lg:min-h-[700px] overflow-hidden -mt-px">
        <div className="absolute inset-0">
          <img src="/hero-bg.png" alt="专业陪诊服务" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-50/95 via-pink-50/70 to-transparent" />
        </div>

        <div className="relative z-10 w-full h-full min-h-[600px] lg:min-h-[700px] px-4 sm:px-6 lg:px-12 xl:px-20 py-20 lg:py-24 flex items-center">
          <div className="flex-1 space-y-6 max-w-xl">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-pink-600">专业陪诊服务</h1>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-pink-700">安心就医有我在</h1>
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-pink-600">让每次就医都有人陪伴</div>
            <Button size="lg" onClick={() => setDialogOpen(true)} className="bg-pink-500 hover:bg-pink-600 text-white px-12 py-7 text-lg rounded-full shadow-xl shadow-pink-400/40">
              立即预约
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 w-full" style={{ background: 'linear-gradient(180deg, #fdf2f7 0%, #fce8f0 100%)' }}>
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">专业陪诊师团队</h2>
            <p className="text-gray-600">独创客户自主选择陪诊师模式，所有陪诊师资质、口碑评分全透明</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 lg:gap-3 mb-8">
            {allTags.map((tag) => (
              <button key={tag} onClick={() => setSelectedTag(tag)} className={`px-4 py-2 rounded-full text-sm font-medium ${selectedTag === tag ? 'bg-pink-300 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                {tag}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-56 lg:h-64 overflow-hidden bg-gray-100">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-2"><MapPin className="w-4 h-4" />{member.city}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                    <span className="text-sm font-medium text-gray-700">{member.rating} ({member.services}次)</span>
                  </div>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 space-y-4">
            {processSteps.map((step, index) => (
              <button key={step.number} onMouseEnter={() => setActiveProcess(index)} className={`w-full text-left p-4 rounded-xl ${activeProcess === index ? 'bg-pink-50' : 'bg-white border border-gray-100'}`}>
                <div className="font-bold text-pink-500">{step.number}. {step.title}</div>
                <div className="text-sm text-gray-600 mt-1">{step.description}</div>
              </button>
            ))}
          </div>
          <div className="lg:w-2/3 h-[380px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg relative">
            <img src={processSteps[activeProcess].image} alt={processSteps[activeProcess].title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 text-white">
              <div>
                <h4 className="text-2xl font-bold">{processSteps[activeProcess].title}</h4>
                <p className="text-white/90 mt-2">{processSteps[activeProcess].description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-10 text-center">我们的服务项目</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service) => (
              <div key={service.name} className="bg-white rounded-2xl overflow-hidden border border-gray-100 h-full flex flex-col">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                  {service.popular && <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-pink-300 text-white text-xs"><Flame className="w-3 h-3 mr-1" />热门</span>}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-5"><span className="text-3xl font-bold text-pink-400">¥{service.price}</span><span className="text-gray-500 text-sm ml-1">{service.unit}</span></div>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {service.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-pink-400 mt-0.5" />{feature}</li>)}
                  </ul>
                  <Button onClick={() => handleBooking(service.name)} className={service.popular ? 'bg-pink-300 hover:bg-pink-400 text-white' : 'bg-gray-100 hover:bg-pink-50 text-gray-700'}>立即预约</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gray-50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 space-y-3">
            {faqs.map((faq, idx) => (
              <button key={faq.question} onMouseEnter={() => setActiveFaq(idx)} className={`w-full text-left p-4 rounded-xl ${activeFaq === idx ? 'bg-pink-50 border-l-4 border-pink-300' : 'bg-white'}`}>
                <div className="flex items-center justify-between"><span>{faq.question}</span><ChevronRight className="w-4 h-4" /></div>
              </button>
            ))}
            <Link to="/consult" className="block p-4 rounded-xl bg-gradient-to-r from-pink-300 to-pink-400 text-white">其他问题？点击咨询在线客服</Link>
          </div>
          <div className="lg:w-2/3 bg-white rounded-2xl shadow-lg p-8 min-h-[320px]">
            <div className="flex items-center gap-3 mb-4"><MessageCircle className="w-5 h-5 text-pink-500" /><h3 className="text-xl font-bold">{faqs[activeFaq].question}</h3></div>
            <p className="text-gray-600 leading-relaxed">{faqs[activeFaq].answer}</p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((item) => (
            <div key={item.title} className="text-center p-4">
              <div className="w-14 h-14 rounded-xl bg-pink-50 mx-auto mb-4 flex items-center justify-center"><item.icon className="w-7 h-7 text-pink-400" /></div>
              <h3 className="font-bold text-gray-900">{item.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 lg:py-20 w-full" style={{ background: 'linear-gradient(180deg, #fdf2f7 0%, #fce8f0 100%)' }}>
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="text-center mb-10"><h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">平台数据</h2><p className="text-gray-600">用数据说话，让服务更值得信赖</p></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-pink-100">
                <div className="text-2xl lg:text-3xl font-bold text-pink-400 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {dialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDialogOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 lg:p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">预约陪诊服务</h3>
              <button onClick={() => setDialogOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="space-y-5">
              <div>
                <Label className="text-sm font-medium text-gray-700">选择服务</Label>
                <Input value={selectedService} readOnly className="mt-1.5 bg-gray-50" />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">预约时间</Label>
                <div className="flex gap-2 mt-1.5">
                  <Select><SelectTrigger className="flex-1"><Calendar className="w-4 h-4 mr-2 text-gray-400" /><SelectValue placeholder="选择日期" /></SelectTrigger><SelectContent><SelectItem value="today">今天</SelectItem><SelectItem value="tomorrow">明天</SelectItem><SelectItem value="day3">后天</SelectItem></SelectContent></Select>
                  <Select><SelectTrigger className="flex-1"><Clock className="w-4 h-4 mr-2 text-gray-400" /><SelectValue placeholder="选择时间" /></SelectTrigger><SelectContent><SelectItem value="8:00">8:00</SelectItem><SelectItem value="9:00">9:00</SelectItem><SelectItem value="10:00">10:00</SelectItem></SelectContent></Select>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">就诊地点</Label>
                <Input placeholder="请输入医院" className="mt-1.5" />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">选择陪诊师</Label>
                <div className="relative mt-1.5"><User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" /><Input placeholder="可选" className="pl-9" /></div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">联系电话</Label>
                <Input type="tel" placeholder="请输入您的联系电话" className="mt-1.5" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>取消</Button>
                <Button className="flex-1 bg-pink-400 hover:bg-pink-500 text-white" onClick={() => setDialogOpen(false)}>确认预约</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
