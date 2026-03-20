import { useState } from 'react';
import { 
  Calendar, 
  User, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Stethoscope,
  Clock,
  FileText,
  Heart,
  Activity,
  Search,
  Shield
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import img1 from './sui2.jpg';
import img2 from './sui4.jpg';
import img3 from './sui5.jpg';
import img4 from './sui7.jpg';

const screeningGuide = [
  { 
    age: "20-39岁", 
    method: "临床体检", 
    frequency: "每3年1次",
    note: "由医生进行乳房触诊检查，同时学习正确的自检方法。此年龄段乳腺癌发病率较低，但仍需保持警惕。",
    image: img1,
    details: [
      "建议每3年进行一次临床乳房检查",
      "学习并坚持每月乳房自检",
      "如有家族史，建议提前开始筛查",
      "发现异常及时就医"
    ]
  },
  { 
    age: "40-49岁", 
    method: "乳腺X线+超声", 
    frequency: "每年1次",
    note: "建议每年进行一次乳腺X线摄影和超声检查。此年龄段乳腺癌发病率开始上升，定期筛查尤为重要。",
    image: img2,
    details: [
      "每年进行一次乳腺X线摄影（钼靶）",
      "结合乳腺超声检查",
      "继续每月乳房自检",
      "高危人群可能需要更频繁检查"
    ]
  },
  { 
    age: "50-69岁", 
    method: "乳腺X线筛查", 
    frequency: "每1-2年1次",
    note: "乳腺X线摄影是此年龄段的主要筛查手段。这是乳腺癌发病率最高的年龄段，定期筛查可显著降低死亡率。",
    image: img3,
    details: [
      "每1-2年进行一次乳腺X线摄影",
      "根据乳腺密度决定是否加做超声",
      "坚持每月乳房自检",
      "定期临床体检"
    ]
  },
  { 
    age: "70岁以上", 
    method: "个体化筛查", 
    frequency: "遵医嘱",
    note: "根据身体状况、预期寿命和既往病史决定筛查方案。身体健康、预期寿命较长的女性应继续筛查。",
    image: img4,
    details: [
      "与医生讨论是否继续筛查",
      "考虑整体健康状况",
      "根据既往筛查结果决定",
      "保持自我检查习惯"
    ]
  },
];

const screeningMethods = [
  {
    name: "乳腺超声",
    desc: "利用超声波检查乳腺组织，无辐射，适合年轻女性和致密型乳腺",
    pros: ["无辐射，安全可靠", "适合年轻女性", "可区分囊性和实性肿块", "检查过程舒适", "价格相对较低"],
    cons: ["对微小钙化不敏感", "依赖医生经验", "筛查效率相对较低", "可能有假阳性结果"],
    duration: "15-30分钟",
    preparation: "无需特殊准备",
    suitable: "所有年龄段，尤其是年轻女性"
  },
  {
    name: "乳腺X线摄影（钼靶）",
    desc: "利用X射线检查乳腺，是乳腺癌筛查的金标准",
    pros: ["可发现微小钙化", "筛查金标准", "有影像记录便于对比", "技术成熟可靠", "成本效益高"],
    cons: ["有少量辐射", "致密型乳腺效果差", "检查时有压迫感", "可能有假阳性结果"],
    duration: "15-20分钟",
    preparation: "避免在经期进行检查",
    suitable: "40岁以上女性"
  },
  {
    name: "乳腺MRI",
    desc: "利用磁共振成像，对致密型乳腺和高危人群更敏感",
    pros: ["无辐射", "对致密型乳腺敏感", "发现率高", "可发现多发病灶", "对植入假体者适用"],
    cons: ["价格较高", "检查时间长", "可能有假阳性", "对钙化不敏感", "需要注射造影剂"],
    duration: "30-45分钟",
    preparation: "去除所有金属物品",
    suitable: "高危人群、致密型乳腺"
  },
];

const riskGroups = {
  normal: {
    title: "普通风险人群",
    description: "没有特殊风险因素的女性，按照常规建议进行筛查即可。",
    criteria: [
      "无乳腺癌家族史",
      "无BRCA基因突变",
      "既往无乳腺疾病",
      "无胸部放射治疗史"
    ],
    recommendation: "建议从40岁开始进行乳腺癌筛查，每1-2年进行一次乳腺X线摄影检查。"
  },
  high: {
    title: "高危人群",
    description: "具有某些风险因素的女性，需要更早、更频繁地进行筛查。",
    criteria: [
      "一级亲属患乳腺癌",
      "BRCA基因突变携带者",
      "既往患乳腺癌或卵巢癌",
      "胸部接受过放射治疗",
      "有遗传性乳腺癌综合征"
    ],
    recommendation: "建议从40岁开始每年筛查，或比家族最早发病年龄提前10年进行筛查。可能需要结合MRI检查。"
  }
};

const faqData = [
  {
    question: "乳腺X线检查会痛吗？",
    answer: "检查时乳房会被轻轻压迫，可能会有一些不适，但通常不会很痛。压迫是为了获得更清晰的影像，时间很短。如果感到疼痛，可以告诉技师调整压力。"
  },
  {
    question: "筛查发现异常怎么办？",
    answer: "筛查发现异常不等于患癌。大多数异常情况是良性的，如囊肿、纤维腺瘤等。医生会根据情况建议进一步检查，如超声、MRI或穿刺活检，以明确诊断。"
  },
  {
    question: "怀孕期间可以做乳腺检查吗？",
    answer: "怀孕期间可以进行乳腺超声检查，这是安全的。乳腺X线摄影通常避免在孕期进行，除非有明确的临床指征。如果担心，可以咨询医生。"
  },
  {
    question: "乳房自检可以替代专业筛查吗？",
    answer: "不能。乳房自检是重要的自我监测手段，但不能替代专业的医学筛查。自检可能发现一些明显的变化，但很多早期病变只能通过专业检查发现。建议两者结合。"
  },
  {
    question: "筛查有辐射风险吗？",
    answer: "乳腺X线摄影确实使用X射线，但辐射剂量很低，远低于可能造成伤害的水平。对于40岁以上女性，筛查的益处远大于潜在的辐射风险。"
  }
];

export default function ScreeningPage() {
  const [activeMethod, setActiveMethod] = useState(0);

  return (
    <div className="w-full px-4 md:px-12 lg:px-20 xl:px-24 py-10 text-[16px]">

      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { value: '90%', label: '早期发现治愈率', icon: Heart },
          { value: '40岁', label: '建议开始筛查年龄', icon: Calendar },
          { value: '1-2年', label: '建议筛查频率', icon: Clock },
          { value: '30%', label: '筛查降低死亡率', icon: Activity },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Icon className="w-8 h-8 text-[#3CB371] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gradient-pink">{stat.value}</div>
                  <div className="text-sm text-[#666]">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 年龄筛查建议（统一页面，无 Tabs） */}
      <section className="w-full mb-12">
        <h3 className="text-2xl font-bold text-[#008080] mb-3 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          各年龄段筛查建议
        </h3>
        <p className="text-[#666] mb-6 text-lg">不同年龄段的乳腺癌风险和筛查建议有所不同。</p>

        <div className="space-y-6">
          {screeningGuide.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-[2fr,3fr] gap-0">
                <div className="h-48 md:h-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.method}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="font-semibold text-[#333] text-xl">{item.age}</span>
                    <span className="px-4 py-1.5 bg-[#3CB371] text-white text-base rounded-full">
                      {item.frequency}
                    </span>
                  </div>
                  <p className="text-base font-medium text-[#3CB371] mb-3">{item.method}</p>
                  <p className="text-base text-[#666] mb-5 leading-relaxed">{item.note}</p>
                  <ul className="space-y-3">
                    {item.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-base text-[#666]">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 筛查方法（保持在同一页面，减少卡片） */}
      <section className="w-full mb-12">
        <h3 className="text-2xl font-bold text-[#008080] mb-3 flex items-center gap-2">
          <Stethoscope className="w-6 h-6" />
          筛查方法详解
        </h3>
        <p className="text-[#666] mb-6 text-lg">了解不同筛查方法的特点，选择最适合自己的方式。</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,2fr] gap-6">
          <div className="space-y-3">
            {screeningMethods.map((method, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveMethod(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                  activeMethod === idx
                    ? 'bg-[#008080] text-white border-transparent shadow-md'
                    : 'bg-white border-gray-200 hover:border-[#3CB371]/60 hover:shadow-sm'
                }`}
              >
                <Stethoscope
                  className={`w-6 h-6 ${
                    activeMethod === idx ? 'text-white' : 'text-[#3CB371]'
                  }`}
                />
                <span className="font-medium text-lg">{method.name}</span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h4 className="text-2xl font-bold text-[#333] mb-4">
              {screeningMethods[activeMethod].name}
            </h4>
            <p className="text-base text-[#666] mb-8 leading-relaxed">
              {screeningMethods[activeMethod].desc}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-base font-medium text-blue-700">检查时间</span>
                </div>
                <p className="text-base text-blue-600">
                  {screeningMethods[activeMethod].duration}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-base font-medium text-green-700">准备事项</span>
                </div>
                <p className="text-base text-green-600">
                  {screeningMethods[activeMethod].preparation}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-purple-500" />
                  <span className="text-base font-medium text-purple-700">适用人群</span>
                </div>
                <p className="text-base text-purple-600">
                  {screeningMethods[activeMethod].suitable}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-base text-green-600 font-medium mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  优点
                </p>
                <ul className="space-y-2">
                  {screeningMethods[activeMethod].pros.map((pro, i) => (
                    <li key={i} className="text-base text-[#666] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-base text-amber-600 font-medium mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  局限
                </p>
                <ul className="space-y-2">
                  {screeningMethods[activeMethod].cons.map((con, i) => (
                    <li key={i} className="text-base text-[#666] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 风险人群（双列信息块） */}
      <section className="w-full mb-12">
        <h3 className="text-2xl font-bold text-[#008080] mb-3 flex items-center gap-2">
          <User className="w-6 h-6" />
          风险人群分类
        </h3>
        <p className="text-[#666] mb-6 text-lg">
          了解自己是普通风险还是高风险人群，采取相应的筛查策略。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-green-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-green-100 rounded-xl">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[#333] text-xl">
                  {riskGroups.normal.title}
                </h4>
                <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  常规筛查
                </span>
              </div>
            </div>
            <p className="text-base text-[#666] mb-5 leading-relaxed">
              {riskGroups.normal.description}
            </p>
            <div className="mb-5">
              <p className="text-base font-medium text-[#333] mb-3">判断标准：</p>
              <ul className="space-y-2">
                {riskGroups.normal.criteria.map((c, i) => (
                  <li key={i} className="text-base text-[#666] flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-base text-green-700 leading-relaxed">
                <span className="font-medium">建议：</span>
                {riskGroups.normal.recommendation}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-red-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[#333] text-xl">
                  {riskGroups.high.title}
                </h4>
                <span className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded-full">
                  加强筛查
                </span>
              </div>
            </div>
            <p className="text-base text-[#666] mb-5 leading-relaxed">
              {riskGroups.high.description}
            </p>
            <div className="mb-5">
              <p className="text-base font-medium text-[#333] mb-3">判断标准：</p>
              <ul className="space-y-2">
                {riskGroups.high.criteria.map((c, i) => (
                  <li key={i} className="text-base text-[#666] flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-base text-red-700 leading-relaxed">
                <span className="font-medium">建议：</span>
                {riskGroups.high.recommendation}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 常见问题（列表形式，减少卡片感） */}
      <section className="w-full mb-8">
        <h3 className="text-2xl font-bold text-[#228B22] mb-3 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          常见问题解答
        </h3>
        <p className="text-[#666] mb-6 text-lg">关于乳腺癌筛查的常见疑问。</p>

        <div className="space-y-4">
          {faqData.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#3CB371]/10 rounded-lg shrink-0">
                  <Search className="w-6 h-6 text-[#3CB371]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#333] mb-3 text-lg">{faq.question}</h4>
                  <p className="text-base text-[#666] leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
