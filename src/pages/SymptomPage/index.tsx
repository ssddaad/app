// SymptomPage - 症状识别主页面
import { useEffect, useState } from 'react';
import { 
  BookOpen, 
  ArrowLeft, 
  AlertTriangle,
  CheckCircle2,
  Activity,
  Hand,
  Stethoscope,
  Calendar,
  Info,
  Heart,
  Search,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import SelfCheckPage from './SelfCheckPage';
import UrgentSignsPage from './UrgentSignsPage';
import { motion } from 'framer-motion';

const earlySymptoms = [
  { 
    name: '乳房肿块',
    desc: '无痛性、质地硬、边界不清的肿块，多为单发，活动度差',
    urgent: false,
    detail: '乳腺癌最常见的早期症状，通常在乳房外上象限出现。肿块质地较硬，表面不光滑，与周围组织分界不清，活动度差。大多数乳腺癌肿块无痛，这也是容易被忽视的原因。',
    image: 'https://ts1.tc.mm.bing.net/th/id/R-C.3414295fdeb04738ec88b8195f22013b?rik=uFIYDe5EwmW7Ow&riu=http%3a%2f%2fn.sinaimg.cn%2fsinacn22%2f38%2fw1024h614%2f20180810%2f5e23-hhnunsr0790516.jpg&ehk=knnwnusnjqFoiD3xXK29zZnbm9h0VeCFOQ6eRIicxmA%3d&risl=&pid=ImgRaw&r=0'
  },
  { 
    name: '乳头溢液',
    desc: '非哺乳期出现血性或浆液性溢液，尤其是单侧单孔',
    urgent: true,
    detail: '非哺乳期出现乳头溢液，特别是血性、浆液血性或水样溢液，需要高度警惕，应及时就医检查。单侧单孔的溢液尤其需要重视。',
    image: 'https://images.91160.com/doc/2024/02/1708311388542.jpg'
  },
  { 
    name: '皮肤改变',
    desc: '皮肤凹陷、橘皮样改变或红肿，呈「酒窝征」或「橘皮征」',
    urgent: true,
    detail: '肿瘤侵犯Cooper韧带导致皮肤凹陷形成「酒窝征」；淋巴回流受阻导致皮肤增厚形成「橘皮征」。这些改变提示肿瘤可能已侵犯皮肤或淋巴系统。',
    image: 'https://ts4.tc.mm.bing.net/th/id/OIP-C.cPbpMsf0687QYMeISQgkNwHaDl?cb=defcachec2&rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  { 
    name: '乳头改变',
    desc: '乳头内陷、偏斜或糜烂，乳头皮肤瘙痒、脱屑',
    urgent: true,
    detail: '肿瘤侵犯乳头下方组织可导致乳头内陷或偏斜；Paget病可表现为乳头乳晕区皮肤糜烂、脱屑。这些改变通常提示肿瘤位于乳头附近。',
    image: 'https://picd.zhimg.com/50/v2-c09c94c2a36d9bdbf5d83705aeefe459_720w.jpg?source=1940ef5c'
  },
  { 
    name: '腋窝肿块',
    desc: '腋窝淋巴结肿大，质地硬，活动度差',
    urgent: false,
    detail: '乳腺癌细胞可通过淋巴管转移至腋窝淋巴结，导致腋窝淋巴结肿大，是乳腺癌转移的重要途径。腋窝肿块可能是乳腺癌的首发症状。',
    image: 'https://ts1.tc.mm.bing.net/th/id/R-C.8e884cfca10cb16b584b544a43d1d8d0?rik=9Kic7ZrnR2VhsA&riu=http%3a%2f%2fpic10.babytreeimg.com%2f2017%2f0914%2fFpt9-jHU2drBNQE7iY7jA0jvjTV2_mb.jpg&ehk=A2YWNijtsgnJ3qVwPWwg4D5n573SQZA6Q%2fYexcnUxWo%3d&risl=&pid=ImgRaw&r=0'
  },
  { 
    name: '乳房疼痛',
    desc: '乳房持续性疼痛，不随月经周期变化',
    urgent: false,
    detail: '虽然大多数乳腺癌不痛，但部分患者可出现乳房隐痛、刺痛或牵拉感，且疼痛不随月经周期变化。与周期性乳房胀痛不同，需要引起重视。',
    image: 'https://file.youlai.cn/cnkfile1/M02/16/FC/8DBD6A772BB8570CE5F5663EC26816FC.jpg'
  },
];
const statisticsData = [
  { value: '90%', label: '早期发现治愈率', icon: Heart },
  { value: '40岁', label: '建议开始筛查年龄', icon: Calendar },
  { value: '每月', label: '建议自检频率', icon: CheckCircle2 },
  { value: '8种', label: '需要警惕的症状', icon: AlertTriangle },
];

const selfCheckSteps = [
  { 
    step: 1, 
    title: '看（视诊）', 
    shortDesc: '观察乳房外观',
    desc: '面对镜子，双手叉腰，观察乳房外形、皮肤、乳头是否有异常',
    detail: '观察双侧乳房是否对称，皮肤有无凹陷、红肿，乳头有无内陷、偏斜或糜烂。注意乳房轮廓和皮肤纹理的变化。',
    tips: ['在光线充足的地方进行', '观察乳房轮廓是否对称', '注意皮肤颜色变化', '观察乳头方向是否正常'],
    icon: Search
  },
  { 
    step: 2, 
    title: '触（触诊）', 
    shortDesc: '触摸检查肿块',
    desc: '平躺，用手指指腹顺时针触摸乳房各象限，检查有无肿块',
    detail: '用食指、中指、无名指的指腹平放在乳房上，以画圈的方式从外向内触摸，检查有无肿块。注意肿块的质地、大小和活动度。',
    tips: ['使用指腹而非指尖触摸', '按顺时针方向系统触摸', '包括腋下区域', '触摸力度适中'],
    icon: Hand
  },
  { 
    step: 3, 
    title: '挤（挤压）', 
    shortDesc: '检查乳头溢液',
    desc: '轻轻挤压乳头，观察有无异常分泌物',
    detail: '用拇指和食指轻轻挤压乳头，观察有无血性、浆液性或其他异常分泌物。注意分泌物的颜色、性状和出现的部位。',
    tips: ['动作要轻柔', '观察分泌物颜色和性状', '注意是否单侧单孔', '不要过度挤压'],
    icon: Activity
  },
  { 
    step: 4, 
    title: '查（检查腋窝）', 
    shortDesc: '检查淋巴结',
    desc: '检查腋窝是否有肿大淋巴结',
    detail: '用手指触摸腋窝，检查有无肿大淋巴结，注意淋巴结的大小、质地、活动度。同时检查锁骨上下区域。',
    tips: ['包括锁骨上下区域', '注意淋巴结质地', '发现异常及时就医', '两侧对比检查'],
    icon: Stethoscope
  },
];

const urgentSigns = [
  { sign: '发现乳房无痛性肿块', level: '高危', desc: '质地硬、边界不清、活动度差的肿块' },
  { sign: '乳头出现血性溢液', level: '高危', desc: '非哺乳期单侧单孔血性或浆液性溢液' },
  { sign: '乳房皮肤出现橘皮样改变', level: '高危', desc: '皮肤增厚、毛孔明显，呈橘皮样外观' },
  { sign: '乳头突然内陷或偏斜', level: '高危', desc: '乳头方向改变或向内凹陷' },
  { sign: '腋窝淋巴结肿大', level: '中危', desc: '腋窝触及肿大、质硬的淋巴结' },
  { sign: '乳房持续性疼痛不缓解', level: '中危', desc: '疼痛持续超过2周，不随月经周期变化' },
  { sign: '乳头乳晕区皮肤糜烂脱屑', level: '高危', desc: '皮肤长期不愈的糜烂、结痂或脱屑' },
  { sign: '乳房外形明显改变', level: '中危', desc: '双侧乳房明显不对称或局部隆起' },
];


// 导航栏组件
function NavBar() {
  const location = useLocation();
  const isActive = (path: string) => {
    if (path === '/symptom' && location.pathname === '/symptom') return true;
    if (path !== '/symptom' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="w-full mb-8 bg-white p-1 rounded-xl shadow-sm">
      <div className="flex flex-wrap">
        <Link to="/symptom" className="flex-1 md:flex-none">
          <div className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            isActive('/symptom') && !isActive('/symptom/self-check') && !isActive('/symptom/urgent')
              ? 'bg-[#4A9B8E] text-white' 
              : 'text-[#666] hover:bg-gray-100'
          }`}>
            <Activity className="w-4 h-4 mr-2" />
            早期症状
          </div>
        </Link>
        <Link to="/symptom/self-check" className="flex-1 md:flex-none">
          <div className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            isActive('/symptom/self-check') 
              ? 'bg-[#4A9B8E] text-white' 
              : 'text-[#666] hover:bg-gray-100'
          }`}>
            <Hand className="w-4 h-4 mr-2" />
            自检方法
          </div>
        </Link>
        <Link to="/symptom/urgent" className="flex-1 md:flex-none">
          <div className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            isActive('/symptom/urgent') 
              ? 'bg-gradient-symptom text-white' 
              : 'text-[#666] hover:bg-gray-100'
          }`}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            就医时机
          </div>
        </Link>
      </div>
    </div>
  );
}

// 早期症状页面
function SymptomsPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const index = parseInt(e.target.getAttribute('data-index') || '0', 10);
            setVisibleSections((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-index]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const isVisible = (i: number) => visibleSections.includes(i);

  return (
    <div className="w-full px-4 md:px-12 lg:px-20 xl:px-24 py-10">
      {/* 欢迎横幅 */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="relative rounded-3xl p-8 mb-10 text-white overflow-hidden h-48 md:h-30"
>
  {/* 背景图层 */}
  <img
    src="https://ystcdn.venuertc.com/venue/AI/22fa75cc-b3e7-4293-b728-8620a47c1584.jpg"
    alt="医疗检查"
    className="absolute inset-0 w-full h-full object-cover z-0"
  />

  {/* 渐变遮罩层（提升文字对比度） */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#4A9B8E]/90 via-[#3CB371]/70 to-[#2E8B57]/60 z-0" />

  {/* 装饰圆形（可保留/可去掉） */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 z-0" />
  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 z-0" />

  {/* 正文内容 */}
  <div className="relative z-10">
    <div className="flex items-center gap-3 mb-4">
      <Sparkles className="w-6 h-6" />
      <span className="text-white/90 font-medium">早发现 早治疗</span>
    </div>
    <h2 className="text-3xl md:text-4xl font-bold mb-4">识别早期症状，守护乳腺健康</h2>
    <p className="text-white/90 text-lg">
      了解乳腺癌的早期症状，掌握正确的自检方法，是预防和早期发现乳腺癌的关键，早期发现的乳腺癌，治愈率可达90%以上。
    </p>
  </div>
</motion.div>


      {/* 统计数据 */}
      <div 
          data-index={0}
          className={`transition-all duration-700 ${isVisible(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <Card className="mb-10 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-4xl text-[#333]">
                <Info className="w-5 h-5 text-[#40E0D0] " />
                乳腺癌识别
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#666] leading-relaxed mb-6 text-[17px]">
                乳腺癌是发生在乳腺腺上皮组织的恶性肿瘤。女性乳腺是由皮肤、纤维组织、乳腺腺体和脂肪组成的，
                乳腺癌中99%发生在女性，男性仅占1%。 
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statisticsData.map((stat, idx) => (
                  <div key={idx} className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                    <div className="text-2xl md:text-3xl font-bold text-gradient-pink">{stat.value}</div>
                    <div className="text-sm font-medium text-[#333] mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>


      {/* 导航栏 */}
      <NavBar />

      {/* 早期症状 */}
      {/* 早期症状 */}
<div data-index={1} className={`transition-all duration-700 ${isVisible(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
  <div className="mb-8">
    <h2 className="text-3xl font-semibold text-slate-900 flex items-center gap-2.5">
      <Activity className="w-8 h-8 text-rose-600" strokeWidth={2} />
      早期预警信号
    </h2>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
    {earlySymptoms.map((symptom, idx) => (
      <div
        key={idx}
        className={`bg-white rounded-lg border ${symptom.urgent ? 'border-rose-200' : 'border-slate-200'} shadow-sm overflow-hidden hover:border-slate-300 transition-all duration-200`}
      >
        <div className="h-32 overflow-hidden bg-slate-100">
          <img 
            src={symptom.image} 
            alt={symptom.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold text-slate-900 text-[22px]">{symptom.name}</h3>
            {symptom.urgent && (
              <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs rounded font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                需警惕
              </span>
            )}
          </div>
          <p className="text-[17px] text-slate-600 mb-1">{symptom.desc}</p>
          <p className="text-sm text-slate-400">{symptom.detail}</p>
        </div>
      </div>
    ))}
  </div>

  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
    <div className="flex gap-3">
      <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <p className="text-[18px] text-amber-900">
          <span className="font-semibold">重要提示：</span>
          出现以上症状不一定就是乳腺癌，很多良性乳腺疾病也会有类似表现。但发现任何异常都应及时就医，由医生进行专业判断。
        </p>
      </div>
    </div>
  </div>
</div>

{/* 空行分隔 */}
<div className="h-10" />

{/* 自检方法摘要 */}
<div data-index={2} className={`transition-all duration-700 ${isVisible(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
  <div className="mb-8">
    <h2 className="text-3xl font-semibold text-slate-900 flex items-center gap-2.5">
      <Hand className="w-9 h-9 text-teal-600" strokeWidth={2} />
      乳房自检四步法
    </h2>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    {selfCheckSteps.slice(0, 2).map((step, idx) => {
      const Icon = step.icon;
      return (
        <div
          key={idx}
          className="bg-white rounded-lg border border-slate-200 p-5 hover:border-teal-300 transition-all duration-200"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-teal-500 flex items-center justify-center text-white shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-teal-600">{step.step}</span>
                <h3 className="font-semibold text-slate-900 text-[20px]">{step.title}</h3>
              </div>
              <p className="text-slate-600 mb-1 text-[17px]">{step.desc}</p>
              <p className="text-sm text-slate-400">{step.detail}</p>
            </div>
          </div>
        </div>
      );
    })}
  </div>

  <div className="text-center">
    <Link to="/symptom/self-check">
      <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-[16px] font-medium rounded-lg hover:bg-teal-700 transition-colors">
        查看完整自检指南
      </button>
    </Link>
  </div>
</div>

{/* 空行分隔 */}
<div className="h-10" />

{/* 就医时机摘要 */}
<div data-index={3} className={`transition-all duration-700 ${isVisible(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
  <div className="mb-8">
    <h2 className="text-3xl font-semibold text-slate-900 flex items-center gap-2.5">
      <AlertTriangle className="w-9 h-9 text-rose-600" strokeWidth={2} />
      何时需要立即就医？
    </h2>
  </div>
  
  <div className="space-y-3 mb-6">
    {urgentSigns.slice(0, 4).map((item, idx) => (
      <div
        key={idx}
        className={`flex items-start gap-3 p-4 rounded-lg border ${
          item.level === '高危' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'
        }`}
      >
        <AlertTriangle className={`w-7 h-7 shrink-0 mt-0.5 ${item.level === '高危' ? 'text-rose-600' : 'text-amber-600'}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-slate-900 text-[18px]">{item.sign}</span>
            <span className={`px-1.5 py-0.5 text-xs rounded font-medium ${
              item.level === '高危' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
            }`}>
              {item.level}
            </span>
          </div>
          <p className="text-sm text-slate-600">{item.desc}</p>
        </div>
      </div>
    ))}
  </div>

  <div className="text-center">
    <Link to="/symptom/urgent">
      <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white text-[16px] font-medium rounded-lg hover:bg-rose-700 transition-colors">
        查看就医时机详情
      </button>
    </Link>
  </div>
</div>

<div className="mt-12 pt-8 border-t border-slate-200">
<h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">继续了解</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* 快速导航 */}
    
    <Link to="/symptom/self-check" className="group">
      <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-3 hover:border-teal-300 hover:shadow-sm transition-all duration-200 h-full">
        <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center shrink-0">
          <Hand className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <h4 className="font-medium text-slate-900 text-sm truncate">完整自检指南</h4>
          <p className="text-xs text-slate-500 truncate">学习详细的乳房自检方法</p>
        </div>
      </div>
    </Link>

    <Link to="/symptom/urgent" className="group">
      <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-3 hover:border-rose-300 hover:shadow-sm transition-all duration-200 h-full">
        <div className="w-9 h-9 rounded-lg bg-rose-500 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <h4 className="font-medium text-slate-900 text-sm truncate">就医时机详情</h4>
          <p className="text-xs text-slate-500 truncate">了解需要立即就医的情况</p>
        </div>
      </div>
    </Link>

    {/* 继续了解 */}
    <Link to="/prevention" className="group">
      <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-3 hover:border-emerald-300 hover:shadow-sm transition-all duration-200 h-full">
        <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <h4 className="font-medium text-slate-900 text-sm truncate">防治指南</h4>
          <p className="text-xs text-slate-500 truncate">学习预防和治疗方法</p>
        </div>
      </div>
    </Link>

    <Link to="/prevention/screening" className="group">
      <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-3 hover:border-blue-300 hover:shadow-sm transition-all duration-200 h-full">
        <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <h4 className="font-medium text-slate-900 text-sm truncate">筛查指南</h4>
          <p className="text-xs text-slate-500 truncate">了解各年龄段筛查建议</p>
        </div>
      </div>
    </Link>
  </div>
</div>

    </div>
  );
}

export default function SymptomPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="bg-[#4A9B8E] text-white">
        <div className="w-full px-4 md:px-12 lg:px-20 xl:px-24 py-8">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <BookOpen className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold">乳腺癌症状识别</h1>
            </div>
          </div>
        </div>
      </div>

      <Routes>
        <Route index element={<SymptomsPage />} />
        <Route path="self-check" element={<SelfCheckPage />} />
        <Route path="urgent" element={<UrgentSignsPage />} />
      </Routes>
    </div>
  );
}
