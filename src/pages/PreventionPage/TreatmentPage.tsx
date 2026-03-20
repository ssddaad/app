import { useState } from 'react';
import { 
  Stethoscope, 
  Zap, 
  Target, 
  Shield, 
  Activity, 
  Info,
  Heart,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  FileText,
  Pill
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const treatments = [
  { 
    name: "手术治疗", 
    desc: "保乳手术或全乳切除，是乳腺癌的主要治疗手段",
    detail: "根据肿瘤大小、位置和分期，选择保乳手术或全乳切除术。早期患者可考虑保乳手术，保留乳房外形。",
    icon: Stethoscope,
    applicable: "各期患者",
    duration: "1-3小时",
    recovery: "2-6周",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=250&fit=crop",
    types: [
      { name: "保乳手术", desc: "切除肿瘤及周围少量组织，保留乳房" },
      { name: "全乳切除", desc: "切除整个乳房，必要时包括淋巴结" },
      { name: "乳房重建", desc: "术后进行乳房外形重建" }
    ],
    advantages: ["直接切除肿瘤", "病理分期准确", "可保留乳房外形（保乳手术）"],
    considerations: ["需要术后辅助治疗", "可能有手术并发症", "需要恢复期"]
  },
  { 
    name: "放射治疗", 
    desc: "术后辅助放疗，降低局部复发风险",
    detail: "利用高能射线杀灭癌细胞，通常在手术后进行，可降低局部复发率。现代放疗技术精准度高，副作用可控。",
    icon: Zap,
    applicable: "术后患者",
    duration: "5-7周",
    recovery: "即时",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=250&fit=crop",
    types: [
      { name: "全乳放疗", desc: "对整个乳房进行放射治疗" },
      { name: "部分放疗", desc: "仅对肿瘤区域进行放疗" },
      { name: "术中放疗", desc: "手术时进行单次放疗" }
    ],
    advantages: ["降低局部复发率", "保留乳房（保乳术后）", "非侵入性治疗"],
    considerations: ["治疗周期长", "可能有皮肤反应", "疲劳感"]
  },
  { 
    name: "化学治疗", 
    desc: "使用抗癌药物杀灭癌细胞，可全身性治疗",
    detail: "通过静脉或口服给药，药物随血液循环到达全身，杀灭可能存在的转移癌细胞。可术前（新辅助）或术后（辅助）使用。",
    icon: Pill,
    applicable: "中晚期患者",
    duration: "3-6个月",
    recovery: "数周至数月",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=250&fit=crop",
    types: [
      { name: "辅助化疗", desc: "术后进行，杀灭残留癌细胞" },
      { name: "新辅助化疗", desc: "术前进行，缩小肿瘤" },
      { name: "姑息化疗", desc: "晚期患者控制病情" }
    ],
    advantages: ["全身性治疗", "可术前缩小肿瘤", "降低远处转移风险"],
    considerations: ["有全身副作用", "需要多周期治疗", "可能影响生育"]
  },
  { 
    name: "内分泌治疗", 
    desc: "适用于激素受体阳性患者，阻断雌激素作用",
    detail: "通过药物阻断雌激素对乳腺癌细胞的刺激作用，降低复发风险。需要长期服用，通常5-10年。",
    icon: Target,
    applicable: "激素受体阳性",
    duration: "5-10年",
    recovery: "即时",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
    types: [
      { name: "他莫昔芬", desc: "适用于绝经前后女性" },
      { name: "芳香化酶抑制剂", desc: "主要用于绝经后女性" },
      { name: "卵巢功能抑制", desc: "适用于绝经前女性" }
    ],
    advantages: ["口服方便", "副作用相对较小", "显著降低复发率"],
    considerations: ["需要长期服用", "可能引起更年期症状", "需定期监测"]
  },
  { 
    name: "靶向治疗", 
    desc: "针对HER2阳性患者的精准治疗",
    detail: "针对HER2阳性乳腺癌的特异性治疗，可精准杀灭癌细胞，副作用相对较小。代表药物为曲妥珠单抗（赫赛汀）。",
    icon: Target,
    applicable: "HER2阳性",
    duration: "1年",
    recovery: "即时",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop",
    types: [
      { name: "曲妥珠单抗", desc: "经典HER2靶向药物" },
      { name: "帕妥珠单抗", desc: "双重HER2阻断" },
      { name: "T-DM1", desc: "抗体药物偶联物" }
    ],
    advantages: ["精准靶向", "副作用较小", "显著提高生存率"],
    considerations: ["价格较高", "需检测HER2状态", "可能有心脏毒性"]
  },
  { 
    name: "免疫治疗", 
    desc: "激活自身免疫系统对抗癌症",
    detail: "通过药物激活患者自身的免疫系统，增强对癌细胞的识别和杀灭能力。目前主要用于三阴性乳腺癌等特定类型。",
    icon: Shield,
    applicable: "特定类型",
    duration: "视情况而定",
    recovery: "即时",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
    types: [
      { name: "PD-1/PD-L1抑制剂", desc: "解除免疫抑制" },
      { name: "CTLA-4抑制剂", desc: "增强T细胞活性" }
    ],
    advantages: ["激活自身免疫系统", "可能产生长期效果", "副作用相对可控"],
    considerations: ["适用人群有限", "可能引起免疫相关副作用", "价格昂贵"]
  },
];

const treatmentStages = [
  {
    stage: "早期（I-II期）",
    icon: Heart,
    color: "from-green-400 to-green-500",
    treatments: ["手术治疗", "放射治疗", "内分泌治疗"],
    note: "早期发现，治愈率高。通常采用手术为主，配合术后辅助治疗。",
    survival: "5年生存率 > 90%",
    approach: "以手术为主的综合治疗"
  },
  {
    stage: "局部晚期（III期）",
    icon: Activity,
    color: "from-orange-400 to-orange-500",
    treatments: ["新辅助化疗", "手术治疗", "放射治疗"],
    note: "需要综合治疗，可能先进行化疗缩小肿瘤，再手术，最后放疗。",
    survival: "5年生存率 50-70%",
    approach: "新辅助+手术+辅助综合治疗"
  },
  {
    stage: "晚期转移（IV期）",
    icon: Shield,
    color: "from-red-400 to-red-500",
    treatments: ["化学治疗", "靶向治疗", "免疫治疗"],
    note: "以控制病情、延长生存、提高生活质量为主要目标。",
    survival: "中位生存期 2-3年",
    approach: "以系统治疗为主的个体化治疗"
  },
];

const patientStories = [
  {
    name: "李女士",
    age: 45,
    stage: "早期",
    treatment: "保乳手术+放疗+内分泌治疗",
    years: "康复5年",
    quote: "早期发现让我保住了乳房，现在生活完全正常。定期筛查真的很重要！"
  },
  {
    name: "王女士",
    age: 52,
    stage: "II期",
    treatment: "新辅助化疗+手术+放疗",
    years: "康复3年",
    quote: "虽然治疗过程辛苦，但坚持下来就是胜利。现在的医学真的很先进。"
  },
  {
    name: "张女士",
    age: 38,
    stage: "HER2阳性",
    treatment: "手术+化疗+靶向治疗",
    years: "康复2年",
    quote: "靶向治疗让我看到了希望，副作用比化疗小很多。保持乐观很重要！"
  }
];

export default function TreatmentPage() {
  const [activeTreatment, setActiveTreatment] = useState(0);

  return (
    <div className="w-full px-4 md:px-12 lg:px-20 xl:px-24 py-10 text-[16px]">
      {/* Back Button */}

      {/* Header Image */}
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-10">
        <img 
          src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&h=400&fit=crop" 
          alt="医疗治疗" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2E8B57]/80 to-transparent flex items-center">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-2">乳腺癌治疗方式</h2>
            <p className="text-white/90 text-lg">科学治疗，规范用药，战胜疾病</p>
          </div>
        </div>
      </div>


      <Tabs defaultValue="methods" className="w-full">
        <TabsList className="w-full justify-start mb-8 bg-white p-1 rounded-xl shadow-sm flex-wrap">
          <TabsTrigger value="methods" className="flex-1 md:flex-none py-3 data-[state=active]:bg-gradient-prevention data-[state=active]:text-white rounded-lg px-6 transition-all duration-300 text-base">
            <Stethoscope className="w-5 h-5 mr-2" />
            治疗方法
          </TabsTrigger>
          <TabsTrigger value="stages" className="flex-1 md:flex-none py-3 data-[state=active]:bg-gradient-prevention data-[state=active]:text-white rounded-lg px-6 transition-all duration-300 text-base">
            <Activity className="w-5 h-5 mr-2" />
            分期治疗
          </TabsTrigger>
          <TabsTrigger value="stories" className="flex-1 md:flex-none py-3 data-[state=active]:bg-gradient-prevention data-[state=active]:text-white rounded-lg px-6 transition-all duration-300 text-base">
            <Users className="w-5 h-5 mr-2" />
            康复故事
          </TabsTrigger>
        </TabsList>

        {/* 治疗方法 */}
        <TabsContent value="methods">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#228B22] mb-3">主要治疗方法</h3>
            <p className="text-[#666] mb-6 text-lg">现代医学提供多种治疗手段，医生会根据患者具体情况制定个体化方案</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Treatment Selection */}
              <div className="lg:col-span-1 space-y-3">
                {treatments.map((treatment, idx) => {
                  const Icon = treatment.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveTreatment(idx)}
                      className={`p-5 rounded-xl cursor-pointer transition-all duration-300 ${
                        activeTreatment === idx 
                          ? 'bg-gradient-to-r from-[#3CB371] to-[#2E8B57] text-white shadow-lg' 
                          : 'bg-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-6 h-6 ${activeTreatment === idx ? 'text-white' : 'text-[#3CB371]'}`} />
                        <span className="font-medium text-lg">{treatment.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Treatment Details */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-md overflow-hidden">
                  <div className="h-56 overflow-hidden">
                    <img 
                      src={treatments[activeTreatment].image} 
                      alt={treatments[activeTreatment].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-5">
                      <h4 className="text-3xl font-bold text-[#333]">{treatments[activeTreatment].name}</h4>
                      <span className="px-4 py-1.5 bg-[#3CB371]/10 text-[#3CB371] text-base rounded-full">
                        {treatments[activeTreatment].applicable}
                      </span>
                    </div>
                    <p className="text-[#666] mb-6 text-lg leading-relaxed">{treatments[activeTreatment].detail}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-blue-600 mb-1">治疗周期</p>
                        <p className="text-base font-medium text-blue-700">{treatments[activeTreatment].duration}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <Heart className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-green-600 mb-1">恢复期</p>
                        <p className="text-base font-medium text-green-700">{treatments[activeTreatment].recovery}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-lg font-medium text-[#333] mb-3">治疗类型：</p>
                      <div className="flex flex-wrap gap-3">
                        {treatments[activeTreatment].types.map((type, i) => (
                          <div key={i} className="px-4 py-3 bg-gray-50 rounded-lg">
                            <p className="text-base font-medium text-[#333]">{type.name}</p>
                            <p className="text-sm text-[#666] mt-1">{type.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-base text-green-600 font-medium mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          优势
                        </p>
                        <ul className="space-y-2">
                          {treatments[activeTreatment].advantages.map((adv, i) => (
                            <li key={i} className="text-base text-[#666] flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500" />
                              {adv}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-base text-amber-600 font-medium mb-3 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          注意事项
                        </p>
                        <ul className="space-y-2">
                          {treatments[activeTreatment].considerations.map((con, i) => (
                            <li key={i} className="text-base text-[#666] flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 分期治疗 */}
        <TabsContent value="stages">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#228B22] mb-3">分期治疗方案</h3>
            <p className="text-[#666] mb-6 text-lg">不同分期的乳腺癌需要不同的治疗策略</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {treatmentStages.map((stage, idx) => {
                const Icon = stage.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                      <CardContent className="p-8">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center mb-5`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-semibold text-[#333] text-xl mb-3">{stage.stage}</h4>
                        <p className="text-base text-[#666] mb-5 leading-relaxed">{stage.note}</p>
                        
                        <div className="mb-5">
                          <p className="text-sm text-[#999] mb-2">主要治疗方式</p>
                          <div className="flex flex-wrap gap-2">
                            {stage.treatments.map((t, i) => (
                              <span key={i} className="px-3 py-1.5 bg-[#3CB371]/10 text-[#3CB371] text-sm rounded-full">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg mb-4">
                          <p className="text-sm text-green-600 mb-1">治疗策略</p>
                          <p className="text-base text-green-700 font-medium">{stage.approach}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-[#3CB371]" />
                          <span className="text-base text-[#666]">{stage.survival}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 bg-gradient-to-r from-[#228B22]/10 to-[#3CB371]/10 border border-[#3CB371]/30 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <Info className="w-8 h-8 text-[#3CB371] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-[#333] text-xl mb-3">治疗方案选择</h4>
                  <p className="text-[#666] leading-relaxed mb-3 text-base">
                    具体治疗方案需要根据患者的病理类型、分期、分子分型、身体状况等因素综合制定，请遵医嘱进行治疗。
                    乳腺癌的治疗强调个体化和综合治疗，不同患者可能需要不同的治疗组合。
                  </p>
                  <p className="text-[#666] leading-relaxed text-base">
                    治疗过程中，保持积极乐观的心态、良好的营养状态、适度的运动都有助于提高治疗效果和生活质量。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 康复故事 */}
        <TabsContent value="stories">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#228B22] mb-3">康复故事</h3>
            <p className="text-[#666] mb-6 text-lg">真实的康复经历，给正在治疗中的患者以希望和力量</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {patientStories.map((story, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-xl">
                          {story.name[0]}
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#333] text-lg">{story.name}</h4>
                          <p className="text-sm text-[#666]">{story.age}岁 · {story.stage}</p>
                        </div>
                      </div>
                      
                      <div className="mb-5">
                        <p className="text-sm text-[#999] mb-1">治疗方案</p>
                        <p className="text-base text-[#666]">{story.treatment}</p>
                      </div>

                      <div className="p-5 bg-pink-50 rounded-xl mb-5">
                        <Sparkles className="w-6 h-6 text-pink-500 mb-3" />
                        <p className="text-base text-[#666] italic leading-relaxed">"{story.quote}"</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-base text-green-600 font-medium">{story.years}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-8">
              <h4 className="font-semibold text-amber-800 mb-4 flex items-center gap-2 text-lg">
                <FileText className="w-6 h-6" />
                给患者的建议
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "积极配合治疗，按时服药和复查",
                  "保持乐观心态，相信现代医学",
                  "注意营养均衡，适当运动",
                  "寻求家人朋友的支持",
                  "加入患者互助群体，分享经验",
                  "关注心理健康，必要时寻求专业帮助"
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-3 text-base text-amber-700">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>


    </div>
  );
}
