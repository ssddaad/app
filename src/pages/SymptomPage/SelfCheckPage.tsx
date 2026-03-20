import { useState } from 'react';
import { 
  ArrowLeft, 
  Info, 
  CheckCircle2, 
  Calendar, 
  ChevronRight,
  ChevronLeft,
  Heart,
  AlertTriangle,
  Stethoscope,
  Search,
  Hand,
  Activity,
  Bell,
  Sparkles,
  Lightbulb,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const selfCheckSteps = [
  { 
    step: 1, 
    title: '看（视诊）', 
    shortDesc: '观察乳房外观',
    desc: '面对镜子，双手叉腰，观察乳房外形、皮肤、乳头是否有异常',
    detail: '观察双侧乳房是否对称，皮肤有无凹陷、红肿，乳头有无内陷、偏斜或糜烂。注意乳房轮廓和皮肤纹理的变化。',
    tips: [
      '在光线充足的地方进行',
      '观察乳房轮廓是否对称',
      '注意皮肤颜色变化',
      '观察乳头方向是否正常'
    ],
    whatToLook: [
      '乳房大小、形状是否对称',
      '皮肤有无凹陷或隆起',
      '皮肤颜色是否改变（发红、橘皮样）',
      '乳头有无内陷、偏斜或糜烂'
    ],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
    icon: Search
  },
  { 
    step: 2, 
    title: '触（触诊）', 
    shortDesc: '触摸检查肿块',
    desc: '平躺，用手指指腹顺时针触摸乳房各象限，检查有无肿块',
    detail: '用食指、中指、无名指的指腹平放在乳房上，以画圈的方式从外向内触摸，检查有无肿块。注意肿块的质地、大小和活动度。',
    tips: [
      '使用指腹而非指尖触摸',
      '按顺时针方向系统触摸',
      '包括腋下区域',
      '触摸力度适中，不要太轻或太重'
    ],
    whatToLook: [
      '有无肿块或硬结',
      '肿块的大小和形状',
      '肿块的质地（硬或软）',
      '肿块是否可移动'
    ],
    image: 'https://preview.qiantucdn.com/freepik/free-photo/51508072.jpg!w1024_new_small_1',
    icon: Hand
  },
  { 
    step: 3, 
    title: '挤（挤压）', 
    shortDesc: '检查乳头溢液',
    desc: '轻轻挤压乳头，观察有无异常分泌物',
    detail: '用拇指和食指轻轻挤压乳头，观察有无血性、浆液性或其他异常分泌物。注意分泌物的颜色、性状和出现的部位。',
    tips: [
      '动作要轻柔，不要过度挤压',
      '观察分泌物颜色和性状',
      '注意是否单侧单孔出现',
      '发现异常及时就医'
    ],
    whatToLook: [
      '有无分泌物溢出',
      '分泌物的颜色（血性、浆液性等）',
      '分泌物的性状（稀薄、粘稠等）',
      '是否只有挤压时才出现'
    ],
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop',
    icon: Activity
  },
  { 
    step: 4, 
    title: '查（检查腋窝）', 
    shortDesc: '检查淋巴结',
    desc: '检查腋窝是否有肿大淋巴结',
    detail: '用手指触摸腋窝，检查有无肿大淋巴结，注意淋巴结的大小、质地、活动度。同时检查锁骨上下区域。',
    tips: [
      '包括锁骨上下区域',
      '注意淋巴结质地和大小',
      '发现异常及时就医',
      '两侧对比检查'
    ],
    whatToLook: [
      '有无肿大淋巴结',
      '淋巴结的大小',
      '淋巴结的质地（硬或软）',
      '淋巴结是否可移动'
    ],
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop',
    icon: Stethoscope
  },
];

const checkSchedule = [
  { 
    age: '20-39岁', 
    frequency: '每月1次', 
    note: '建议每月月经结束后7-10天进行自检',
    details: [
      '月经结束后7-10天乳房最柔软',
      '更容易发现异常变化',
      '建议同时记录检查结果'
    ]
  },
  { 
    age: '40岁以上', 
    frequency: '每月1次', 
    note: '绝经后女性可选择每月固定日期',
    details: [
      '选择每月固定日期，如每月1号',
      '保持检查的规律性',
      '配合每年专业筛查'
    ]
  },
];

const commonQuestions = [
  {
    question: '乳房自检能发现所有乳腺癌吗？',
    answer: '不能。乳房自检是重要的自我监测手段，但不能发现所有乳腺癌，尤其是非常早期的病变。自检应与专业的医学筛查（如乳腺X线、超声）结合使用。'
  },
  {
    question: '发现肿块一定是乳腺癌吗？',
    answer: '不一定。大多数乳房肿块是良性的，如纤维腺瘤、囊肿等。但发现任何肿块都应及时就医，由医生进行专业判断和必要的检查。'
  },
  {
    question: '乳房疼痛是乳腺癌的症状吗？',
    answer: '大多数乳腺癌并不引起疼痛。乳房疼痛更多与月经周期、乳腺增生等良性情况有关。但如果疼痛持续不缓解或伴有其他症状，也应就医检查。'
  },
  {
    question: '男性需要做乳房自检吗？',
    answer: '男性也可能患乳腺癌，虽然发病率很低。男性如果发现乳房或乳头有异常变化，同样应该就医检查。'
  },
  {
    question: '自检时发现什么需要立即就医？',
    answer: '发现以下情况应立即就医：无痛性肿块、乳头血性溢液、皮肤橘皮样改变、乳头突然内陷、腋窝淋巴结肿大等。'
  }
];

const selfCheckTips = [
  {
    title: '选择合适的时间',
    content: '月经结束后7-10天是最佳检查时间，此时乳房最柔软，容易发现异常。',
    icon: Calendar
  },
  {
    title: '保持规律检查',
    content: '建议每月进行一次自检，养成固定习惯，更容易发现变化。',
    icon: Bell
  },
  {
    title: '记录检查结果',
    content: '可以画图记录乳房情况，标注任何发现，便于下次对比。',
    icon: FileText
  },
  {
    title: '不要过度紧张',
    content: '发现异常不要惊慌，大多数情况是良性的，及时就医即可。',
    icon: Heart
  }
];

export default function SelfCheckPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [] = useState(false);

  const nextStep = () => {
    if (currentStep < selfCheckSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = selfCheckSteps[currentStep];
  const Icon = currentStepData.icon;

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
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=400&fit=crop" 
          alt="健康检查" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A9B8E]/80 to-transparent flex items-center">
          <div className="p-8">
            <h2 className="text-5xl font-bold text-white mb-2">乳房自检四步法</h2>
            <p className="text-white/90 text-xl">掌握正确的自检方法，守护乳腺健康</p>
          </div>
        </div>
      </div>

      {/* Step Progress */}
      <div className="flex items-center justify-center mb-8">
        {selfCheckSteps.map((step, idx) => (
          <div key={idx} className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                idx === currentStep 
                  ? 'bg-[#3CB371] text-white scale-110' 
                  : idx < currentStep 
                    ? 'bg-[#3CB371] text-white' 
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {idx < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step.step}
            </div>
            {idx < selfCheckSteps.length - 1 && (
              <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                idx < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Step Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-lg overflow-hidden h-full">
              <div className="h-56 overflow-hidden">
                <img 
                  src={currentStepData.image} 
                  alt={currentStepData.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#3CB371] flex items-center justify-center text-white">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[17px] text-[#ff4d94] font-medium">步骤 {currentStepData.step}</span>
                    <h3 className="text-2xl font-bold text-[#333]">{currentStepData.title}</h3>
                  </div>
                </div>
                <p className="text-[#666] mb-5 text-[17px]">{currentStepData.detail}</p>
                
                <div className="mb-4">
                  <p className="text-[18px] font-medium text-[#333] mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-5 text-amber-500" />
                    操作要点
                  </p>
                  <ul className="space-y-2">
                    {currentStepData.tips.map((tip, i) => (
                      <li key={i} className="text-[16px] text-[#666] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[18px] font-medium text-[#333] mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-500" />
                    需要注意
                  </p>
                  <ul className="space-y-2">
                    {currentStepData.whatToLook.map((item, i) => (
                      <li key={i} className="text-[16px] text-[#666] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Step Navigation and Tips */}
        <div className="space-y-6">
          {/* Navigation Buttons */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2 " />
                  上一步
                </Button>
                <span className="text-sm text-[#666]">
                  {currentStep + 1} / {selfCheckSteps.length}
                </span>
                <Button 
                  onClick={nextStep}
                  disabled={currentStep === selfCheckSteps.length - 1}
                  className="bg-gradient-symptom text-white"
                >
                  下一步
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Steps Overview */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h4 className="font-semibold text-[#333] mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ff4d94]" />
                四步法概览
              </h4>
              <div className="space-y-3">
                {selfCheckSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  return (
                    <div 
                      key={idx}
                      onClick={() => setCurrentStep(idx)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                        idx === currentStep 
                          ? 'bg-pink-50 border-2 border-pink-200' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[18px] font-bold ${
                          idx === currentStep ? 'bg-[#ff4d94] text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${idx === currentStep ? 'text-[#ff4d94]' : 'text-[#333]'} text-[18px]`}>
                            {step.title}
                          </p>
                          <p className="text-sm text-[#666]">{step.shortDesc}</p>
                        </div>
                        <StepIcon className={`w-4 h-4 ${idx === currentStep ? 'text-[#ff4d94]' : 'text-gray-400'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule Section */}
      <Card className="border-0 shadow-md mb-8">
        <CardContent className="p-6">
          <h3 className="text-3xl font-bold text-[#4A9B8E] mb-4 flex items-center gap-2">
            <Calendar className="w-9 h-9" />
            自检时间安排
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {checkSchedule.map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-[#333] text-lg text-[21px]">{item.age}</span>
                  <span className="px-3 py-1 bg-[#3CB371] text-white text-[16px] rounded-full">{item.frequency}</span>
                </div>
                <p className="text-[17px] text-[#E07A5F] mb-3">{item.note}</p>
                <ul className="space-y-1">
                  {item.details.map((detail, i) => (
                    <li key={i} className="text-[15px] text-[#999] flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {selfCheckTips.map((tip, idx) => {
          const TipIcon = tip.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="p-5">
                  <TipIcon className="w-8 h-8 text-[#3CB371] mb-3" />
                  <h4 className="font-semibold text-[#333] mb-2 text-[21px]">{tip.title}</h4>
                  <p className="text-[16px] text-[#666]">{tip.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <Card className="border-0 shadow-md mb-8">
        <CardContent className="p-6">
          <h3 className="text-3xl font-bold text-[#4A9B8E] mb-4 flex items-center gap-2">
            <Info className="w-8 h-8" />
            常见问题
          </h3>
          <div className="space-y-4">
            {commonQuestions.map((faq, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-[#E07A5F] mb-2 flex items-center gap-2 text-[20px]">
                  <span className="w-7 h-7 rounded-full bg-[#E07A5F] text-white text-[16px] flex items-center justify-center">Q</span>
                  {faq.question}
                </p>
                <p className="text-[17px] text-[#666] pl-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Warning Section */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
        <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap- text-[20px]">
          <AlertTriangle className="w-7 h-7" />
          自检小贴士
        </h4>
        <ul className="space-y-2">
          <li className="text-[16px] text-amber-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            自检不能替代专业筛查，建议定期进行乳腺X线或超声检查
          </li>
          <li className="text-[16px]text-amber-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            发现异常不要惊慌，及时就医进行专业检查
          </li>
          <li className="text-[16px] text-amber-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            建议建立自检记录，便于追踪变化
          </li>
          <li className="text-[16px] text-amber-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            40岁以上女性应每年进行一次专业乳腺筛查
          </li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link to="/symptom">
          <Button variant="outline">
            <ArrowLeft className="w-6 h-6 mr-2" />
            返回症状识别
          </Button>
        </Link>
        <Link to="/symptom/urgent">
          <Button className="bg-gradient-symptom text-white">
            查看就医时机
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
