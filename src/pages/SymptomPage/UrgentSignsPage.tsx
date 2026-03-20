import { useState } from 'react';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Stethoscope, 
  Calendar,
  ChevronRight,
  Heart,
  Activity,
  FileText,
  Shield,
  Sparkles,
  Bell,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const urgentSigns = [
  { 
    sign: '发现乳房无痛性肿块', 
    level: '高危', 
    desc: '质地硬、边界不清、活动度差的肿块，是乳腺癌最常见的早期症状',
    action: '立即就医，进行超声或钼靶检查',
    why: '无痛性肿块是乳腺癌的典型表现，早期发现可大大提高治愈率'
  },
  { 
    sign: '乳头出现血性溢液', 
    level: '高危', 
    desc: '非哺乳期单侧单孔血性或浆液性溢液，需要高度警惕',
    action: '立即就医，可能需要乳管镜检查',
    why: '血性溢液可能是导管内乳头状瘤或乳腺癌的表现'
  },
  { 
    sign: '乳房皮肤出现橘皮样改变', 
    level: '高危', 
    desc: '皮肤增厚、毛孔明显，呈橘皮样外观，提示淋巴回流受阻',
    action: '立即就医，可能需要活检明确诊断',
    why: '橘皮样改变提示肿瘤可能已侵犯皮肤或淋巴系统'
  },
  { 
    sign: '乳头突然内陷或偏斜', 
    level: '高危', 
    desc: '乳头方向改变或向内凹陷，可能是肿瘤牵拉所致',
    action: '立即就医，进行影像学检查',
    why: '乳头改变提示肿瘤位于乳头附近或侵犯乳管'
  },
  { 
    sign: '腋窝淋巴结肿大', 
    level: '中危', 
    desc: '腋窝触及肿大、质硬的淋巴结，可能是乳腺癌转移',
    action: '尽快就医，进行详细检查',
    why: '腋窝淋巴结是乳腺癌最常见的转移部位'
  },
  { 
    sign: '乳房持续性疼痛不缓解', 
    level: '中危', 
    desc: '疼痛持续超过2周，不随月经周期变化',
    action: '预约医生检查，排除恶性病变',
    why: '虽然多数乳腺癌不痛，但持续性疼痛需要排查'
  },
  { 
    sign: '乳头乳晕区皮肤糜烂脱屑', 
    level: '高危', 
    desc: '皮肤长期不愈的糜烂、结痂或脱屑，可能是Paget病',
    action: '立即就医，需要活检确诊',
    why: 'Paget病是一种特殊类型的乳腺癌'
  },
  { 
    sign: '乳房外形明显改变', 
    level: '中危', 
    desc: '双侧乳房明显不对称或局部隆起',
    action: '尽快就医，进行影像学检查',
    why: '外形改变可能提示深部肿瘤或组织牵拉'
  },
];



const examinationFlow = [
  {
    step: 1,
    title: '初诊检查',
    desc: '医生询问病史，进行乳房触诊',
    icon: User,
    details: ['详细询问症状出现时间', '了解家族史和个人史', '进行乳房和腋窝触诊']
  },
  {
    step: 2,
    title: '影像学检查',
    desc: '乳腺超声、X线或MRI检查',
    icon: Activity,
    details: ['乳腺超声（无辐射，适合年轻女性）', '乳腺X线摄影（筛查金标准）', '乳腺MRI（高危人群或致密型乳腺）']
  },
  {
    step: 3,
    title: '病理检查',
    desc: '如需要，进行穿刺或手术活检',
    icon: FileText,
    details: ['细针穿刺活检', '粗针穿刺活检', '手术切除活检']
  },
  {
    step: 4,
    title: '确诊治疗',
    desc: '根据病理结果制定治疗方案',
    icon: Stethoscope,
    details: ['明确病理类型和分期', '制定个体化治疗方案', '开始规范治疗']
  },
];

const hospitalTips = [
  {
    title: '选择正规医院',
    content: '选择有乳腺专科的三甲医院或肿瘤专科医院',
    icon: Shield
  },
  {
    title: '准备相关资料',
    content: '携带身份证、医保卡、既往检查报告',
    icon: FileText
  },
  {
    title: '选择合适时间',
    content: '月经结束后7-10天就诊最佳',
    icon: Calendar
  },
  {
    title: '记录症状变化',
    content: '详细记录症状出现时间、变化情况',
    icon: Bell
  }
];

const mentalHealthTips = [
  '保持冷静，不要过度恐慌',
  '相信现代医学，积极配合检查',
  '寻求家人朋友的支持',
  '了解疾病知识，减少未知恐惧',
  '加入患者互助群体',
  '必要时寻求心理咨询'
];

export default function UrgentSignsPage() {
  const [activeTab, setActiveTab] = useState('signs');

  return (
    <div className="w-full px-4 md:px-12 lg:px-20 xl:px-24 py-10">
      <Link to="/symptom">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回症状识别
        </Button>
      </Link>

      {/* Header Image */}
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-10">
        <img 
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=400&fit=crop" 
          alt="医院就医" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/80 to-transparent flex items-center">
          <div className="p-8">
            <h2 className="text-5xl font-bold text-white mb-2">何时需要立即就医？</h2>
            <p className="text-white/90 text-[20px]">了解需要警惕的症状，及时寻求专业帮助</p>
          </div>
        </div>
      </div>



      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start mb-8 bg-white p-1 rounded-xl shadow-sm flex-wrap">
          <TabsTrigger value="signs" className="flex-1 md:flex-none py-3 data-[state=active]:bg-gradient-symptom data-[state=active]:text-white rounded-lg px-6 transition-all duration-300 text-[17px]">
            <AlertTriangle className="w-4 h-4 mr-2" />
            警示症状
          </TabsTrigger>
          <TabsTrigger value="process" className="flex-1 md:flex-none py-3 data-[state=active]:bg-gradient-symptom data-[state=active]:text-white rounded-lg px-6 transition-all duration-300 text-[17px]">
            <Activity className="w-4 h-4 mr-2" />
            就医流程
          </TabsTrigger>
          <TabsTrigger value="prepare" className="flex-1 md:flex-none py-3 data-[state=active]:bg-gradient-symptom data-[state=active]:text-white rounded-lg px-6 transition-all duration-300 text-[17px]">
            <FileText className="w-4 h-4 mr-2" />
            就医准备
          </TabsTrigger>
        </TabsList>

        {/* 警示症状 */}
        <TabsContent value="signs">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-[#ff4d94] mb-6">需要立即就医的症状</h3>
            <div className="grid grid-cols-1 gap-4">
              {urgentSigns.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className={`border-0 shadow-md hover:shadow-lg transition-all duration-300 ${
                    item.level === '高危' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-amber-500'
                  }`}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl shrink-0 ${
                          item.level === '高危' ? 'bg-red-100' : 'bg-amber-100'
                        }`}>
                          <AlertTriangle className={`w-6 h-6 ${
                            item.level === '高危' ? 'text-red-500' : 'text-amber-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-[#333] text-lg text-[21px]">{item.sign}</span>
                            <span className={`px-2 py-0.5 text-sm rounded-full ${
                              item.level === '高危' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                            }`}>
                              {item.level}
                            </span>
                          </div>
                          <p className="text-[17px] text-[#666] mb-3">{item.desc}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-[16px] text-blue-600 font-medium mb-1">建议行动</p>
                              <p className="text-[17px] text-blue-700">{item.action}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                              <p className="text-[16px] text-green-600 font-medium mb-1">为什么重要</p>
                              <p className="text-[17px] text-green-700">{item.why}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* 就医流程 */}
        <TabsContent value="process">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-[#ff4d94] mb-6">就医检查流程</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {examinationFlow.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-symptom flex items-center justify-center text-white font-bold">
                            {step.step}
                          </div>
                          <Icon className="w-7 h-7 text-[#ff4d94]" />
                        </div>
                        <h4 className="font-semibold text-[#333] mb-2 text-[21px]">{step.title}</h4>
                        <p className="text-[17px] text-[#666] mb-3">{step.desc}</p>
                        <ul className="space-y-1">
                          {step.details.map((detail, i) => (
                            <li key={i} className="text-[15px] text-[#999] flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
              <h4 className="font-semibold text-[#333] mb-4 flex items-center gap-2 text-[24px]">
                <Stethoscope className="w-7 h-7 text-[#ff4d94]" />
                可能需要做的检查
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h5 className="font-medium text-[#333] mb-2 text-[19px]">乳腺超声</h5>
                  <p className="text-[15px] text-[#666]">无创检查，适合年轻女性和致密型乳腺，可区分囊性和实性肿块。无辐射，可重复进行。</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h5 className="font-medium text-[#333] mb-2 text-[19px]">乳腺X线摄影（钼靶）</h5>
                  <p className="text-[15px] text-[#666]">筛查乳腺癌的金标准，可发现微小钙化灶，建议40岁以上女性定期检查。</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h5 className="font-medium text-[#333] mb-2 text-[19px]">乳腺MRI</h5>
                  <p className="text-[15px] text-[#666]">对致密型乳腺和植入假体的女性更敏感，常用于高危人群筛查。无辐射，但价格较高。</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h5 className="font-medium text-[#333] mb-2 text-[19px]">穿刺活检</h5>
                  <p className="text-[15px] text-[#666]">确诊的金标准，通过细针或粗针获取组织进行病理检查，明确病变性质。</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 就医准备 */}
        <TabsContent value="prepare">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#ff4d94] mb-2">就医准备事项</h3>
            <p className="text-[#666] mb-6">做好充分准备，让就医更加顺利高效</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {hospitalTips.map((tip, idx) => {
                const Icon = tip.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="p-3 bg-pink-100 rounded-xl shrink-0">
                          <Icon className="w-6 h-6 text-[#ff4d94]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#333] mb-2 text-[21px]">{tip.title}</h4>
                          <p className="text-[16px] text-[#666]">{tip.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="bg-[#ff9a9e] rounded-2xl p-6 text-white mb-8">
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-2 text-[21px]">心理调适建议</h4>
                  <p className="text-white/90 leading-relaxed mb-4">
                    发现异常后感到焦虑和担心是正常的，但请记住：大多数乳房异常都是良性的。
                    即使确诊为乳腺癌，早期发现的治愈率也非常高。
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {mentalHealthTips.map((tip, i) => (
                      <div key={i} className="flex items-center gap-2 text-[17px] text-white/90">
                        <CheckCircle2 className="w-6 h-6" />
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2 text-[21px]">
                <Info className="w-7 h-7" />
                重要提醒
              </h4>
              <ul className="space-y-2">
                <li className="text-[17px] text-amber-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  不要因为害怕而拖延就医，早期发现是关键
                </li>
                <li className="text-[17px] text-amber-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  选择正规医院和专科医生进行检查
                </li>
                <li className="text-[17px] text-amber-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  如实向医生描述症状和病史
                </li>
                <li className="text-[17px] text-amber-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  遵医嘱进行必要的检查，不要自行判断
                </li>
                <li className="text-[17px] text-amber-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  保持积极乐观的心态，相信现代医学
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Important Notice */}
      <div className="bg-[#4A9B8E] rounded-2xl p-6 text-white mb-8">
        <div className="flex items-start gap-4">
          <Heart className="w-6 h-6 shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-lg mb-2">早期发现是提高治愈率的关键！</h4>
            <p className="text-white/90 leading-relaxed">
              发现以上任何症状请立即就医，不要拖延。早期乳腺癌的五年生存率可达90%以上。
              即使症状不明显，也建议40岁以上女性每年进行一次乳腺筛查。
              记住：预防胜于治疗，早期发现胜于晚期治疗。
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link to="/symptom">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回症状识别
          </Button>
        </Link>
        <Link to="/prevention/screening">
          <Button className="bg-gradient-symptom text-white">
            查看筛查指南
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
