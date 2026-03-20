import { useEffect, useState, useRef } from 'react';
import {
  Shield,
  ArrowLeft,
  CheckCircle2,
  Activity,
  Calendar,
  Heart,
  Apple,
  Dumbbell,
  Moon,
  Sparkles,
  TrendingUp,
  Users,
  Stethoscope,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useSearchParams } from 'react-router-dom';
import ScreeningPage from './ScreeningPage';
import { motion } from 'framer-motion';
import TreatmentPage from './TreatmentPage';

// ==================== 数据定义 ====================

const lifestyleTips = [
  {
    category: '健康饮食',
    icon: Apple,
    color: 'from-green-400 to-green-500',
    tips: ['每天摄入5份以上蔬菜水果', '选择全谷物食品替代精制碳水', '限制红肉和加工肉类摄入', '减少高糖高脂食物', '适量摄入大豆制品'],
    detail: '均衡的饮食结构有助于维持健康体重，降低乳腺癌风险。研究表明，地中海饮食模式与较低的乳腺癌发病率相关。'
  },
  {
    category: '规律运动',
    icon: Dumbbell,
    color: 'from-blue-400 to-blue-500',
    tips: ['每周至少150分钟中等强度运动', '结合有氧运动和力量训练', '避免长时间久坐', '选择喜欢的运动方式', '循序渐进，持之以恒'],
    detail: '规律运动可以帮助控制体重、调节激素水平、增强免疫力。即使是每天30分钟的快走也能带来显著的健康益处。'
  },
  {
    category: '健康体重',
    icon: TrendingUp,
    color: 'from-orange-400 to-orange-500',
    tips: ['保持BMI在18.5-24之间', '控制腰围在80cm以下', '避免体重剧烈波动', '定期监测体重变化', '更年期后更需注意'],
    detail: '超重和肥胖是乳腺癌的重要风险因素，尤其是绝经后女性。脂肪组织会产生雌激素，增加激素依赖性乳腺癌的风险。'
  },
  {
    category: '良好睡眠',
    icon: Moon,
    color: 'from-indigo-400 to-indigo-500',
    tips: ['每晚保证7-8小时睡眠', '保持规律的作息时间', '创造良好的睡眠环境', '睡前避免使用电子设备', '避免睡前饮酒和咖啡因'],
    detail: '充足的睡眠对维持正常激素水平和免疫功能至关重要。长期睡眠不足可能增加多种癌症的风险。'
  }
];

const preventionStats = [
  { value: '30%', label: '通过健康生活方式可降低的风险', icon: TrendingUp },
  { value: '150分钟', label: '每周建议运动时间', icon: Dumbbell },
  { value: '5份', label: '每日建议蔬果摄入量', icon: Apple },
  { value: '7-8小时', label: '每日建议睡眠时间', icon: Moon },
];

const riskFactors = [
  { factor: '年龄增长', level: '不可控', desc: '40岁以上风险逐渐增加', type: 'negative' },
  { factor: '家族病史', level: '不可控', desc: '一级亲属患病风险增加2-3倍', type: 'negative' },
  { factor: '基因突变', level: '不可控', desc: 'BRCA1/2基因携带者风险显著增加', type: 'negative' },
  { factor: '初潮过早', level: '不可控', desc: '12岁前初潮风险略增', type: 'negative' },
  { factor: '晚育或未育', level: '不可控', desc: '35岁后首次生育风险略增', type: 'negative' },
  { factor: '肥胖', level: '可控', desc: '绝经后肥胖显著增加风险', type: 'positive' },
  { factor: '缺乏运动', level: '可控', desc: '久坐生活方式增加风险', type: 'positive' },
  { factor: '饮酒', level: '可控', desc: '即使少量饮酒也增加风险', type: 'positive' },
  { factor: '激素治疗', level: '可控', desc: '长期使用激素替代疗法', type: 'positive' },
  { factor: '不健康饮食', level: '可控', desc: '高脂高糖饮食增加风险', type: 'positive' },
];


const checklistItems = [
  { id: 1, text: '每日摄入5份以上蔬菜水果', category: '饮食' },
  { id: 2, text: '进行30分钟以上运动', category: '运动' },
  { id: 3, text: '保持正常作息时间', category: '睡眠' },
  { id: 4, text: '进行乳房自检（月经后7-10天）', category: '自检' },
  { id: 5, text: '限制酒精摄入', category: '饮食' },
  { id: 6, text: '保持心情愉悦，减少压力', category: '心理' },
  { id: 7, text: '记录体重变化', category: '体重' },
  { id: 8, text: '避免长时间久坐', category: '运动' }
];

// ==================== 自定义 Hook：动画可见性 ====================

function useAnimateOnMount() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // 使用 requestAnimationFrame 确保在渲染完成后触发
    const timer = requestAnimationFrame(() => {
      setIsVisible(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);
  
  return isVisible;
}


function ChecklistContent() {
  const [checked, setChecked] = useState<number[]>([]);
  const isVisible = useAnimateOnMount();

  useEffect(() => {
    // 从 localStorage 读取已保存的进度
    const saved = localStorage.getItem('prevention-checklist');
    if (saved) {
      setChecked(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('prevention-checklist', JSON.stringify(checked));
  }, [checked]);

  const progress = Math.round((checked.length / checklistItems.length) * 100);

  const toggleCheck = (id: number) => {
    setChecked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-pink-800 mb-3 flex items-center gap-2 text-[21px]">
          <ClipboardList className="w-6 h-6" />
          每日健康打卡
        </h3>
        <p className="text-[16px] text-pink-700 leading-relaxed">
          养成健康习惯需要坚持。每天完成以下清单，积少成多，为乳腺健康打下坚实基础。
        </p>
      </div>

      <div className="bg-white p-6 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[16px] font-medium text-[#666]">今日完成度</span>
          <span className="text-lg font-bold text-[#228B22]">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-[#228B22] to-[#3CB371] h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checklistItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleCheck(item.id)}
            className={`cursor-pointer  p-4 border-2 transition-all ${
              checked.includes(item.id) 
                ? 'bg-green-50 border-green-400 shadow-md' 
                : 'bg-white border-gray-200 hover:border-pink-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                checked.includes(item.id) ? 'bg-green-500 border-green-500' : 'border-gray-300'
              }`}>
                {checked.includes(item.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${checked.includes(item.id) ? 'text-green-800 line-through' : 'text-[#333]'}`}>
                  {item.text}
                </p>
                <span className="text-xs text-[#999] bg-gray-100 px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {progress === 100 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-6 text-white text-center"
        >
          <Sparkles className="w-12 h-12 mx-auto mb-3" />
          <h4 className="text-xl font-bold mb-2">恭喜完成今日所有健康目标！</h4>
          <p className="text-white/90">坚持就是胜利，您正在为自己的健康投资。</p>
        </motion.div>
      )}
    </motion.div>
  );
}

// ==================== 动画包装组件 ====================

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // 只触发一次
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ==================== 主页面 ====================

export default function PreventionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'lifestyle';
  const [mounted, setMounted] = useState(false);

  // 确保组件已挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!mounted) {
    return null; // 防止 hydration 不匹配
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* 头部区域 */}
      <div className="bg-[#008080] text-white">
        <div className="w-full px-4 md:px-12 lg:px-20 xl:px-24 py-8">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Shield className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">乳腺癌防治指南</h1>
              <p className="text-white/80 mt-1">科学预防，规范治疗，守护健康</p>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="w-full px-4 md:px-12 lg:px-20 xl:px-24 py-10">
        {/* 欢迎横幅 - 仅在 lifestyle tab 显示 */}
        {currentTab === 'lifestyle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#008080] rounded-3xl p-8 mb-10 text-white relative overflow-hidden"
          >
            <img
              src="https://pica.zhimg.com/v2-01c6d632819e5350a0c06ef9cd2f2e30_1440w.jpg"
              alt="医疗检查"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#008080]/90 via-[#008080]/60 to-[#008080]/70" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6" />
                <span className="text-white/90 font-medium">预防胜于治疗</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">守护乳腺健康，从日常做起</h2>
              <p className="text-white/90 text-lg">
                通过健康的生活方式、定期筛查和及时治疗，我们可以有效降低乳腺癌的风险，
                提高治愈率。每一个小改变，都是对健康的投资。
              </p>
            </div>
          </motion.div>
        )}

        {/* 统计数据 - 仅在 lifestyle tab 显示 */}
        {currentTab === 'lifestyle' && (
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {preventionStats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-2 text-center">
                        <Icon className="w-8 h-8 text-[#3CB371] mx-auto mb-3" />
                        <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm text-[#666]">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        )}

        {/* Tabs 控制区域 */}
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full justify-start mb-8 bg-white p-2 rounded-xl shadow-sm flex-wrap gap-2">
            {[
              { value: 'lifestyle', label: '生活方式', icon: Heart },
              { value: 'risk', label: '风险因素', icon: Activity },
              { value: 'checklist', label: '健康自检', icon: ClipboardList },
              { value: 'screening', label: '筛查建议', icon: Calendar },
              { value: 'treatment', label: '治疗概览', icon: Stethoscope },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger 
                key={value}
                value={value} 
                className="flex-1 md:flex-none py-3 px-6 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#228B22] data-[state=active]:to-[#3CB371] data-[state=active]:text-white"
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* 生活方式 */}
          <TabsContent value="lifestyle" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
  <AnimatedSection>
    {/* 杂志风头部 */}
    <div className="mb-10 text-center max-w-2xl mx-auto">
      <span className="inline-block px-3 py-1 bg-[#228B22]/10 text-[#228B22] text-xs font-medium tracking-wider uppercase rounded-full mb-4">
        Prevention Guide
      </span>
      <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
        健康生活方式指南
      </h2>
      <p className="text-gray-500 leading-relaxed">
        每天的小选择，累积成抵御疾病的大力量。无需完美，只需开始。
      </p>
    </div>

    {/* 卡片网格 - 杂志排版感 */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {lifestyleTips.map((tip, idx) => {
        const Icon = tip.icon;
        // 为每个卡片分配不同的柔和色调
        const bgTones = [
          'bg-orange-50 border-orange-100',
          'bg-blue-50 border-blue-100', 
          'bg-emerald-50 border-emerald-100',
          'bg-rose-50 border-rose-100'
        ];
        const iconBgTones = [
          'bg-orange-500',
          'bg-blue-500',
          'bg-emerald-500', 
          'bg-rose-500'
        ];
        const tone = bgTones[idx % bgTones.length];
        const iconBg = iconBgTones[idx % iconBgTones.length];
        
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={`${tone} border hover:shadow-md transition-shadow duration-300 h-full`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center shadow-sm shrink-0`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 text-[21px]">
                      {tip.category}
                    </h3>
                    <p className="text-[16px] text-gray-600 mb-4 leading-relaxed">
                      {tip.detail}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tip.tips.map((t, i) => (
                        <span 
                          key={i} 
                          className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/60 border border-black/5 text-xs text-gray-700 text-[16px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>

    {/* 引用区块 - 人文感 */}
    <blockquote className="relative py-8 px-6 mb-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      <p className="text-center text-gray-600 italic text-lg leading-relaxed max-w-3xl mx-auto">
        "研究表明，坚持健康生活方式可降低 30-40% 的乳腺癌风险。重要的不是做到完美，而是比昨天更好一点。"
      </p>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    </blockquote>


    {/* 底部行动引导 - 温和不强迫 */}
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-[21px]">
        <Activity className="w-6 h-6 text-[#228B22]" />
        进一步了解
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link 
          to="/symptom" 
          className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-[#20B2AA] hover:bg-[#20B2AA]/5 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#20B2AA]/10 flex items-center justify-center group-hover:bg-[#20B2AA] transition-colors">
              <Activity className="w-5 h-5 text-[#20B2AA] group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="font-medium text-slate-800 text-[17px]">症状识别</div>
              <div className="text-xs text-slate-500">早期发现与自检</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#20B2AA] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link 
          to="/symptom/self-check" 
          className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-[#ff6b9d] hover:bg-[#ff6b9d]/5 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#ff6b9d]/10 flex items-center justify-center group-hover:bg-[#ff6b9d] transition-colors">
              <Heart className="w-5 h-5 text-[#ff6b9d] group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="font-medium text-slate-800 text-[17px]">乳房自检</div>
              <div className="text-xs text-slate-500">正确手法与步骤</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#ff6b9d] group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  </AnimatedSection>
</TabsContent>


        {/* 风险因素 */}
{/* 风险因素 */}
<TabsContent value="risk" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
  <AnimatedSection>
    <h2 className="text-3xl font-bold text-slate-900 mb-6">乳腺癌风险因素</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 不可控因素 */}
      <div>
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-200">
          <div className="w-1 h-5 bg-slate-400 rounded-full" />
          <h3 className="text-base font-semibold text-slate-700 text-[21px]">不可控因素</h3>
          <span className="text-sm text-slate-400 ml-auto">与生俱来或难以改变</span>
        </div>
        
        <div className="space-y-4">
          {riskFactors.filter(r => r.type === 'negative').map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="group"
            >
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-medium text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-900 text-[19px]">{item.factor}</span>
                    <span className={`text-sm px-2 py-0.5 rounded-full ${
                      item.level === '高' ? 'bg-rose-100 text-rose-600' :
                      item.level === '中' ? 'bg-amber-100 text-amber-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {item.level}风险
                    </span>
                  </div>
                  <p className="text-[16px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 可控因素 */}
      <div>
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-200">
          <div className="w-1 h-5 bg-emerald-500 rounded-full" />
          <h3 className="text-base font-semibold text-slate-700 text-[21px]">可控因素</h3>
          <span className="text-sm text-slate-400 ml-auto">可通过生活方式改善</span>
        </div>
        
        <div className="space-y-4">
          {riskFactors.filter(r => r.type === 'positive').map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="group"
            >
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-emerald-50/50 transition-colors border border-transparent hover:border-emerald-100">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-900 text-[19px]">{item.factor}</span>
                    <span className={`text-sm px-2 py-0.5 rounded-full ${
                      item.level === '高' ? 'bg-rose-100 text-rose-600' :
                      item.level === '中' ? 'bg-amber-100 text-amber-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {item.level}风险
                    </span>
                  </div>
                  <p className="text-[16px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    {/* 高危人群注意事项 - 保持原格式 */}
    <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6">
      <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2 text-[21px]">
        <Users className="w-7 h-7" />
        高危人群注意事项
      </h4>
      <p className="text-[16px] text-amber-700 mb-3">
        如果您有以下情况，建议咨询医生进行风险评估，可能需要更早开始筛查或采取额外的预防措施：
      </p>
      <ul className="space-y-2">
        {['一级亲属（母亲、姐妹、女儿）患乳腺癌', '携带BRCA1或BRCA2基因突变', '既往患乳腺癌或卵巢癌', '胸部接受过放射治疗'].map((text, i) => (
          <li key={i} className="text-[17px] text-amber-700 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            {text}
          </li>
        ))}
      </ul>
    </div>
  </AnimatedSection>
</TabsContent>


          {/* 自检清单 */}
          <TabsContent value="checklist" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <h2 className="text-3xl font-bold text-[#228B22] mb-6">每日健康自检清单</h2>
            <ChecklistContent />
          </TabsContent>

          {/* 筛查建议 */}
          <TabsContent value="screening" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <ScreeningPage />
          </TabsContent>

          {/* 治疗概览 */}
          <TabsContent value="treatment" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <TreatmentPage />
          </TabsContent>
        </Tabs>

        {/* 页面底部导航 - 仅在 lifestyle tab 显示 */}
    

      </div>
    </div>
  );
}
