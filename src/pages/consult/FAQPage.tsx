import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Phone,
  Heart,
  Shield,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import Header from '@/components/header';
import AIAssistant from '@/components/AIAssistant/AIAssistant';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import './FAQPage.css';

// FAQ分类 - 增加人文描述
const CATEGORIES = [
  { 
    id: 'prevention', 
    name: '预防筛查', 
    icon: Shield,
    description: '早发现，早安心',
    color: 'from-violet-100 to-purple-50'
  },
  { 
    id: 'diagnosis', 
    name: '诊断治疗', 
    icon: Stethoscope,
    description: '专业指导，不再迷茫',
    color: 'from-blue-100 to-sky-50'
  },
  { 
    id: 'surgery', 
    name: '手术康复', 
    icon: Sparkles,
    description: '温柔呵护每一步',
    color: 'from-rose-100 to-pink-50'
  },
  { 
    id: 'life', 
    name: '生活护理', 
    icon: Heart,
    description: '日常点滴关爱',
    color: 'from-emerald-100 to-teal-50'
  },
  { 
    id: 'platform', 
    name: '平台使用', 
    icon: BookOpen,
    description: '轻松上手，随时陪伴',
    color: 'from-amber-100 to-orange-50'
  },
];

// FAQ数据 - 优化文案，减少机械感
const FAQS = [
  {
    id: 1,
    category: 'prevention',
    question: '乳腺癌早期会有哪些身体信号？',
    answer: '每位女性的身体都是独特的，但以下变化值得您多一分关注：\n\n• 乳房出现无痛肿块，质地偏硬，边缘不规则\n• 乳头有血性或透明液体溢出\n• 皮肤出现类似橘皮的纹理，或局部凹陷\n• 乳头方向改变或内陷\n• 腋下淋巴结持续肿大\n\n请记住：早期乳腺癌往往没有明显不适，定期筛查是最温柔的自我保护方式。建议每月一次自检，每年一次专业检查。',
    views: 12580,
    helpful: 98,
  },
  {
    id: 2,
    category: 'prevention',
    question: '在家如何温柔地进行乳腺自检？',
    answer: '选择一个放松的时刻，比如沐浴后，与自己的身体温柔对话：\n\n**观察时刻**\n面对镜子，自然垂手，观察乳房轮廓是否有变化，皮肤是否有褶皱或凹陷。\n\n**触摸探索**\n用指腹（非指尖）轻柔画圈，从外上象限开始，顺时针覆盖整个乳房，包括腋下区域。感受是否有不同于以往的硬块。\n\n**平躺确认**\n平卧时在肩下垫软枕，再次轻柔触摸，这时乳房平铺，更容易发现细微变化。\n\n**最佳时机**\n月经结束后7-10天，此时乳房最柔软，感受最准确。\n\n💝 这不是任务，而是与自己身体的亲密对话。',
    views: 10234,
    helpful: 96,
  },
  {
    id: 3,
    category: 'prevention',
    question: '不同年龄段，筛查频率如何安排最安心？',
    answer: '根据您的年龄阶段，我们为您整理了温柔的筛查建议：\n\n**20-39岁：建立基础意识**\n每1-3年进行一次临床乳腺检查，学会自我观察，了解自己的身体常态。\n\n**40-44岁：开始定期筛查**\n可选择每年乳腺X光检查，与医生讨论个人风险因素。\n\n**45-54岁：黄金筛查期**\n建议每年一次乳腺X光，这是发现早期病变的关键窗口。\n\n**55岁以上：保持节奏**\n每两年一次筛查，或根据医生建议调整。\n\n**需要特别关注的情况**\n如有家族史、基因突变携带、既往不典型增生等情况，建议提前至30岁开始，并增加MRI检查。\n\n🌸 定期筛查不是焦虑的来源，而是安心的保障。',
    views: 9876,
    helpful: 95,
  },
  {
    id: 4,
    category: 'prevention',
    question: '乳腺癌会遗传吗？有家族史该怎么办？',
    answer: '关于遗传，希望这些信息能缓解您的担忧：\n\n**遗传的真相**\n约85%的乳腺癌发生在没有家族史的女性中。即使有家族史，也不意味着必然发生，而是提醒我们需要更多关注。\n\n**遗传性乳腺癌特点**\n• 与BRCA1/2基因相关，但携带者中也有30%不会发病\n• 通常发病年龄较早，但现代医学已能有效管理\n• 可通过基因检测了解风险，提前制定预防策略\n\n**建议基因检测的情况**\n家族中多人患乳腺癌或卵巢癌、有亲属50岁前发病、家族中有男性乳腺癌患者。\n\n**积极预防方式**\n更频繁的筛查、健康生活方式、必要时预防性药物或手术咨询——现代医学为您准备了多种选择。\n\n🤍 知识是消除恐惧的良药，了解风险是为了更好地掌控健康。',
    views: 11234,
    helpful: 97,
  },
  {
    id: 5,
    category: 'diagnosis',
    question: '乳腺增生和乳腺癌之间有多远？',
    answer: '绝大多数乳腺增生都是良性的生理变化，与癌症之间有很长的距离：\n\n**生理性增生——身体的自然节律**\n与月经周期相关的胀痛、结节感，月经后缓解，这是激素变化的正常表现，不会增加患癌风险。\n\n**病理性增生——需要关注的信号**\n乳腺不典型增生确实会略微增加风险（约4-5倍），但这仍然意味着95%以上的安全概率。发现后只需密切随访，并非癌症前奏。\n\n**如何区分**\n定期超声检查是最佳方式。40岁以上建议结合钼靶，让专业医生为您判断。\n\n**日常建议**\n规律作息、适度运动、减少咖啡因摄入、选择合适的内衣——这些小事都是对乳腺的温柔呵护。\n\n🌿 不必为"增生"二字过度担忧，定期观察、保持心情愉悦最重要。',
    views: 14567,
    helpful: 99,
  },
  {
    id: 6,
    category: 'diagnosis',
    question: '确诊后，有哪些治疗选择？',
    answer: '现代医学为乳腺癌提供了多种个性化治疗方案，您不是一个人在面对：\n\n**手术治疗——精准而温柔**\n• 保乳手术：切除肿瘤同时保留乳房外形，适合早期患者\n• 乳房全切：必要时切除整个乳房，可进行重建手术\n• 前哨淋巴结活检：精准判断转移，避免过度清扫\n\n**放射治疗——局部守护**\n保乳术后通常需要，精准照射，降低复发风险，疗程约3-6周。\n\n**药物治疗——全身呵护**\n• 化疗：针对快速分裂的细胞，可在术前缩小肿瘤或术后清除残留\n• 内分泌治疗：适用于激素敏感型，口服药物，通常持续5-10年\n• 靶向治疗：针对HER2阳性，精准打击，副作用相对较小\n• 免疫治疗：激活自身免疫系统，适用于特定类型\n\n**治疗决策**\n医生会根据您的分子分型、分期、年龄和身体状况，与您共同制定最适合的方案。\n\n💜 治疗过程虽然不易，但每一步都有专业团队陪伴。',
    views: 8765,
    helpful: 94,
  },
  {
    id: 7,
    category: 'diagnosis',
    question: '治疗后，还能拥有做母亲的权利吗？',
    answer: '答案是肯定的，但需要更精心的规划：\n\n**最佳怀孕时机**\n一般建议完成所有治疗（手术、化疗、放疗）后2-3年再考虑怀孕。这段时间用于观察复发风险，确保身体充分恢复。\n\n**怀孕与复发风险**\n目前研究认为，怀孕不会增加乳腺癌复发风险。但孕期激素水平变化需要密切监测，建议在医生指导下进行。\n\n**生育力保护**\n如果您尚未生育且计划未来怀孕，化疗前可与医生讨论：\n• 卵子或胚胎冷冻保存\n• 卵巢保护药物\n• 咨询生殖医学专家\n\n**孕期特别关照**\n选择对乳腺影响小的产检方式，避免乳腺X光，超声检查完全安全。哺乳期可能需要调整，但多数情况下可以母乳喂养。\n\n🤱 成为母亲的愿望值得被尊重和保护，与医生坦诚沟通您的计划。',
    views: 7654,
    helpful: 93,
  },
  {
    id: 8,
    category: 'surgery',
    question: '术后恢复，如何让身体更舒服一些？',
    answer: '术后康复是一段需要耐心的旅程，以下是温柔的护理建议：\n\n**伤口护理——轻柔对待**\n保持伤口清洁干燥，术后2周内避免沾水。观察是否有红肿、渗液或发热，如有异常及时联系医护团队。\n\n**功能恢复——循序渐进**\n• 术后24小时：活动手指，促进血液循环\n• 术后3-5天：开始肘部屈伸，防止僵硬\n• 术后1-2周：在康复师指导下进行肩部活动\n• 避免提重物（>2-3kg），保护伤口\n\n**预防淋巴水肿——日常细节**\n患侧手臂避免抽血、测血压，避免佩戴过紧首饰，做家务时戴手套保护皮肤，可咨询是否需要压力袖套。\n\n**身心调养**\n高蛋白饮食（鱼、蛋、豆制品）帮助伤口愈合，新鲜蔬果提供维生素。允许自己有情绪波动，与家人朋友分享感受，必要时寻求心理支持。\n\n**复查节奏**\n术后2年内每3-6个月一次，3-5年每6-12个月一次，之后每年一次。这不是负担，而是对自己的持续关爱。\n\n🌸 恢复需要时间，对自己温柔一点。',
    views: 9876,
    helpful: 96,
  },
  {
    id: 9,
    category: 'surgery',
    question: '化疗期间，如何缓解身体的不适？',
    answer: '化疗副作用是暂时的，以下方法或许能让您舒服一些：\n\n**恶心呕吐——少食多餐**\n避免空腹接受化疗，准备苏打饼干、姜茶。选择清淡、室温的食物，避免油腻辛辣。医生开具的止吐药请按时服用。\n\n**脱发——美丽的另一种可能**\n使用温和洗发水，避免高温吹风。脱发通常在化疗2-3周后开始，这是暂时的，结束后会重新生长。许多姐妹选择时尚的假发、丝巾或帽子，也是一种风格。\n\n**疲劳——允许自己休息**\n这是最常见的副作用。安排轻度活动如散步，反而有助于缓解疲劳。保证夜间睡眠，白天可短暂小憩。不要勉强自己保持往常的节奏。\n\n**免疫力下降——细心防护**\n勤洗手，避免人群密集场所，注意食物卫生。白细胞低时避免生冷食物，水果削皮食用。\n\n**口腔溃疡——温和护理**\n用软毛牙刷，淡盐水漱口，避免辛辣刺激。可咨询医生使用保护性漱口水。\n\n**情绪支持**\n化疗期间情绪波动很正常，与理解您的人聊聊，或加入患者互助小组，您并不孤单。\n\n💚 每一次治疗都是向康复迈进的一步，副作用会随时间减轻。',
    views: 8234,
    helpful: 95,
  },
  {
    id: 10,
    category: 'life',
    question: '哺乳期发现异常，可以做检查吗？',
    answer: '哺乳期完全可以进行乳腺检查，且非常安全：\n\n**首选检查——乳腺超声**\n无辐射，不影响哺乳，可清晰显示乳腺结构，是哺乳期的最佳选择。\n\n**乳腺MRI——必要时使用**\n无辐射，但需注射造影剂。建议检查前哺乳或排空乳房，注射后4小时可恢复哺乳，安全性已得到验证。\n\n**乳腺X光——谨慎但可行**\n有极少量辐射，通常建议哺乳期后进行。如确需检查，排空乳房后进行，辐射量极小，对哺乳影响有限。\n\n**检查前准备**\n排空乳房能让检查更准确，告知医生您正在哺乳，他们会调整检查手法和判读标准。\n\n**特别提醒**\n哺乳期乳腺组织较致密，影像学表现与非哺乳期不同，需要经验丰富的医生判读，避免误判。\n\n👶 您的健康就是宝宝最好的礼物，不要因为哺乳而延误必要的检查。',
    views: 6543,
    helpful: 92,
  },
  {
    id: 11,
    category: 'life',
    question: '日常饮食中，有哪些温柔的呵护？',
    answer: '食物是我们每天给自己的礼物，以下是滋养身体的建议：\n\n**多多亲近的食物**\n\n**色彩丰富的蔬果**\n十字花科蔬菜（西兰花、卷心菜）含抗癌物质，深色浆果（蓝莓、草莓）富含抗氧化剂，每天5种颜色以上。\n\n**优质蛋白质**\n深海鱼（三文鱼、鲭鱼）提供Omega-3，豆制品含植物雌激素（对乳腺友好），适量瘦肉、鸡蛋。\n\n**全谷物能量**\n燕麦、糙米、全麦面包，提供持久能量和膳食纤维。\n\n**需要保持距离的食物**\n\n**高脂肪加工食品**\n油炸食品、加工肉类、过多红肉，可能增加炎症反应。\n\n**高糖食物**\n甜点、含糖饮料会导致血糖波动，影响免疫力。\n\n**酒精**\n建议尽量避免，酒精与乳腺癌风险相关。\n\n**保健品谨慎**\n避免含动物雌激素的补品，服用任何补充剂前请咨询医生。\n\n**体重管理**\n保持健康体重，适度运动，但不要过度节食，身体需要营养来修复。\n\n🥗 饮食不是限制，而是选择对自己更温柔的方式。',
    views: 7890,
    helpful: 94,
  },
  {
    id: 12,
    category: 'platform',
    question: '如何开始一次在线咨询？',
    answer: '我们的医生团队随时准备倾听您的问题：\n\n**第一步：进入咨询空间**\n点击顶部"在线咨询"，或从首页温暖入口进入。\n\n**第二步：选择沟通方式**\n• 文字咨询：随时发送，适合详细描述\n• 语音预约：预约时段，适合复杂情况（即将上线）\n\n**第三步：描述您的情况**\n详细说明症状、持续时间、既往病史。可上传检查报告照片，越详细医生越能给出精准建议。\n\n**第四步：安心等待回复**\n医生通常在5分钟内响应，您会收到温柔的消息提醒。对话记录随时可查，方便回顾。\n\n**第五步：后续跟进**\n如需面诊或检查，可一键预约。医生会为您规划下一步。\n\n**咨询小贴士**\n• 提前整理好想问的问题清单\n• 准备好近期检查报告\n• 描述症状时尽量具体（部位、性质、持续时间）\n• 不必紧张，医生都经过专业培训，理解女性的担忧\n\n💬 紧急情况下，请拨打24小时关怀热线：400-123-4567',
    views: 5432,
    helpful: 98,
  },
  {
    id: 13,
    category: 'platform',
    question: '如何查看和管理我的检查报告？',
    answer: '您的所有健康记录都在这里安全保存：\n\n**查看报告**\n进入"检查报告"页面，所有记录按时间排列， newest在前。可按类型筛选，或用关键词搜索特定项目。\n\n**报告详情**\n点击任意报告，查看完整结果、医生建议、各项指标趋势。异常指标会用温和的颜色标注，不必惊慌，医生会为您解读。\n\n**管理功能**\n\n**下载与分享**\n支持PDF格式下载，可保存到手机或发送给其他医生，方便转诊或二次意见。\n\n**上传外部报告**\n其他医院的检查单也可上传，统一管理您的健康档案，让医生全面了解您的情况。\n\n**咨询联动**\n查看报告后如有疑问，可直接发起咨询，医生会结合报告给出专业解读。\n\n**隐私保护**\n所有数据加密存储，仅您和授权医生可见，我们严格遵守医疗隐私法规。\n\n📋 健康档案是您的宝贵财富，定期回顾有助于发现趋势变化。',
    views: 4567,
    helpful: 97,
  },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [likedFaqs, setLikedFaqs] = useState<number[]>([]);

  const filteredFaqs = FAQS.filter(faq => {
    const matchCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchSearch = faq.question.includes(searchQuery) || faq.answer.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedFaqs.includes(id)) {
      setLikedFaqs(likedFaqs.filter(faqId => faqId !== id));
    } else {
      setLikedFaqs([...likedFaqs, id]);
      toast.success('感谢您的信任，我们会继续陪伴您');
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fef7f0_0%,_#fff5f7_50%,_#f0f9ff_100%)]">
      {/* 装饰性背景元素 */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-rose-100/40 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-teal-100/30 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />
      
      <Header onSearch={() => {}} />
      
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 py-12 lg:py-16">

        {/* 分类导航 - 横向滚动，卡片式 */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-12 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-br from-rose-400 to-rose-500 text-white shadow-lg shadow-rose-200'
                : 'bg-white text-gray-600 hover:bg-rose-50 shadow-sm hover:shadow-md'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              selectedCategory === 'all' ? 'bg-white/20' : 'bg-gradient-to-br from-gray-100 to-gray-50'
            }`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">全部问题</div>
              <div className={`text-xs ${selectedCategory === 'all' ? 'text-rose-100' : 'text-gray-400'}`}>
                {FAQS.length}个解答
              </div>
            </div>
          </button>

          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-br from-rose-400 to-rose-500 text-white shadow-lg shadow-rose-200'
                    : 'bg-white text-gray-600 hover:bg-rose-50 shadow-sm hover:shadow-md'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isActive ? 'bg-white/20' : `bg-gradient-to-br ${category.color}`
                }`}>
                  <category.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">{category.name}</div>
                  <div className={`text-xs ${isActive ? 'text-rose-100' : 'text-gray-400'}`}>
                    {category.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* FAQ列表 - 手风琴式，极简线条 */}
        <div className="mb-16">
          <div className="flex items-baseline justify-between mb-6 px-2">
            <h2 className="font-serif text-2xl text-gray-800 font-light">
              {selectedCategory === 'all' ? '全部问题' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-sm text-gray-400 font-light">
              共 {filteredFaqs.length} 个温柔解答
            </span>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div 
                key={faq.id}
                className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                  expandedId === faq.id 
                    ? 'shadow-lg shadow-rose-100/50 ring-1 ring-rose-100' 
                    : 'shadow-sm hover:shadow-md hover:bg-rose-50/30'
                }`}
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-serif font-semibold text-sm mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-800 text-base lg:text-lg font-medium leading-relaxed pt-0.5">
                      {faq.question}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                      <Heart className="w-3.5 h-3.5 fill-rose-200 text-rose-200" />
                      {faq.views.toLocaleString()}位姐妹看过
                    </span>
                    {expandedId === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-rose-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {expandedId === faq.id && (
                  <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                    <div className="pl-12 border-l-2 border-rose-100 ml-4">
                      <div className="prose prose-gray max-w-none">
                        <div className="text-gray-600 leading-[1.9] text-[15px] whitespace-pre-line">
                          {faq.answer.split('\n').map((line, idx) => {
                            if (line.startsWith('**') && line.endsWith('**')) {
                              return <p key={idx} className="font-semibold text-gray-800 mt-4 mb-2 text-rose-700">{line.replace(/\*\*/g, '')}</p>;
                            }
                            if (line.startsWith('•') || line.startsWith('-')) {
                              return <p key={idx} className="ml-4 my-1.5 text-gray-600">{line}</p>;
                            }
                            if (line.trim() === '') {
                              return null;
                            }
                            return <p key={idx} className="my-2">{line}</p>;
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-rose-50">
                        <button
                          onClick={(e) => handleLike(faq.id, e)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                            likedFaqs.includes(faq.id)
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-rose-100 hover:text-rose-700'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {likedFaqs.includes(faq.id) ? '已解决我的疑问' : '这对我有帮助'}
                        </button>

                        <Link 
                          to="/consult"
                          className="flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-medium px-4 py-2 rounded-full hover:bg-rose-50 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          还想咨询医生
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 未找到答案 - 温暖CTA */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-rose-50 via-white to-teal-50 p-8 lg:p-8 text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fda4af%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          
          <div className="relative z-10">
            <div className="w-16 h-12 bg-white rounded-full shadow-lg shadow-rose-100 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-rose-400" />
            </div>
            
            <h3 className="font-serif text-2xl text-gray-800 mb-3">
              没找到您想要的答案？
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              每位女性的情况都是独特的，我们的医生团队随时准备为您提供个性化的专业解答
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/consult">
                <Button className="bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white px-8 py-6 rounded-full shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-200 transition-all duration-300 text-base">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  开始在线咨询
                </Button>
              </Link>
              <Link to="/emergency">
                <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-white hover:border-rose-200 hover:text-rose-600 px-8 py-6 rounded-full transition-all duration-300 text-base">
                  <Phone className="w-5 h-5 mr-2" />
                  紧急联系电话
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <AIAssistant />
    </div>
  );
}
