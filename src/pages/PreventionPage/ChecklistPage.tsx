import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Apple, 
  Dumbbell, 
  Heart, 
  Moon, 
  Sun, 
  Wine, 
  Calendar, 
  Trophy, 
  RotateCcw,
  Sparkles,
  TrendingUp,
  Target,
  Info,
  ChevronRight,
  Award,
  Flame,
  Stethoscope,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const preventionChecklist = [
  { 
    id: 1, 
    item: "保持健康体重", 
    category: "体重管理", 
    icon: Heart,
    detail: "BMI保持在18.5-24之间，腰围控制在80cm以下",
    benefit: "降低激素依赖性乳腺癌风险"
  },
  { 
    id: 2, 
    item: "每周运动150分钟以上", 
    category: "运动", 
    icon: Dumbbell,
    detail: "中等强度运动，如快走、游泳、骑车等",
    benefit: "调节激素水平，增强免疫力"
  },
  { 
    id: 3, 
    item: "限制酒精摄入", 
    category: "饮食", 
    icon: Wine,
    detail: "女性每日酒精摄入不超过1个标准杯",
    benefit: "即使是少量饮酒也会增加乳腺癌风险"
  },
  { 
    id: 4, 
    item: "不吸烟", 
    category: "生活习惯", 
    icon: Sun,
    detail: "避免主动吸烟和二手烟暴露",
    benefit: "吸烟会增加多种癌症风险"
  },
  { 
    id: 5, 
    item: "定期乳腺检查", 
    category: "筛查", 
    icon: Calendar,
    detail: "40岁以上每年进行乳腺X线或超声检查",
    benefit: "早期发现，治愈率可达90%以上"
  },
  { 
    id: 6, 
    item: "保持良好心态", 
    category: "心理健康", 
    icon: Heart,
    detail: "学会压力管理，保持积极乐观",
    benefit: "长期压力会影响免疫系统功能"
  },
  { 
    id: 7, 
    item: "多吃蔬菜水果", 
    category: "饮食", 
    icon: Apple,
    detail: "每天摄入5份以上新鲜蔬果",
    benefit: "提供抗氧化物质和膳食纤维"
  },
  { 
    id: 8, 
    item: "限制高脂肪食物", 
    category: "饮食", 
    icon: Apple,
    detail: "减少红肉和加工肉类摄入",
    benefit: "高脂饮食与乳腺癌风险相关"
  },
  { 
    id: 9, 
    item: "保证充足睡眠", 
    category: "生活习惯", 
    icon: Moon,
    detail: "每晚7-8小时优质睡眠",
    benefit: "睡眠不足会影响激素平衡"
  },
  { 
    id: 10, 
    item: "减少精神压力", 
    category: "心理健康", 
    icon: Heart,
    detail: "通过冥想、瑜伽等方式放松身心",
    benefit: "慢性压力会削弱免疫功能"
  },
];

const categoryColors: Record<string, string> = {
  "体重管理": "bg-pink-100 text-pink-600",
  "运动": "bg-green-100 text-green-600",
  "饮食": "bg-amber-100 text-amber-600",
  "生活习惯": "bg-blue-100 text-blue-600",
  "筛查": "bg-purple-100 text-purple-600",
  "心理健康": "bg-rose-100 text-rose-600",
};

const achievements = [
  { threshold: 0, title: "健康新手", icon: "🌱", desc: "开始你的健康之旅" },
  { threshold: 30, title: "健康学徒", icon: "🌿", desc: "不错的开始，继续加油" },
  { threshold: 50, title: "健康达人", icon: "🌳", desc: "你已经养成了好习惯" },
  { threshold: 70, title: "健康专家", icon: "⭐", desc: "太棒了，你是健康榜样" },
  { threshold: 100, title: "健康大师", icon: "👑", desc: "完美！保持健康生活方式" },
];

const weeklyTips = [
  {
    day: "周一",
    theme: "新开始",
    tip: "制定本周健康计划，设定可实现的小目标",
    action: "列出本周要完成的健康任务"
  },
  {
    day: "周二",
    theme: "运动日",
    tip: "选择一项你喜欢的运动，坚持30分钟",
    action: "快走、游泳、瑜伽或跳舞"
  },
  {
    day: "周三",
    theme: "健康饮食",
    tip: "今天尝试一道新的健康食谱",
    action: "多吃蔬菜，减少加工食品"
  },
  {
    day: "周四",
    theme: "自检日",
    tip: "进行乳房自检，关注身体变化",
    action: "按照'看触挤查'四步法检查"
  },
  {
    day: "周五",
    theme: "放松日",
    tip: "工作一周了，给自己一些放松时间",
    action: "冥想、阅读或与朋友聚会"
  },
  {
    day: "周六",
    theme: "户外活动",
    tip: "到户外去，享受阳光和新鲜空气",
    action: "徒步、骑行或公园散步"
  },
  {
    day: "周日",
    theme: "复盘日",
    tip: "回顾本周的健康习惯，为下周做准备",
    action: "记录进步，调整下周计划"
  }
];

export default function ChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [streak] = useState(5);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (checkedItems.length === preventionChecklist.length && checkedItems.length > 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [checkedItems]);

  const toggleItem = (id: number) => {
    setCheckedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const resetChecklist = () => {
    setCheckedItems([]);
  };

  const progress = (checkedItems.length / preventionChecklist.length) * 100;

  const getCurrentAchievement = () => {
    for (let i = achievements.length - 1; i >= 0; i--) {
      if (progress >= achievements[i].threshold) {
        return achievements[i];
      }
    }
    return achievements[0];
  };

  const getMessage = () => {
    if (progress === 0) return "从今天开始，养成健康习惯！";
    if (progress < 30) return "好的开始，继续保持！";
    if (progress < 60) return "做得不错，继续加油！";
    if (progress < 100) return "太棒了，即将完成！";
    return "完美！你是健康生活的榜样！";
  };

  const currentAchievement = getCurrentAchievement();

  return (
    <div className="w-full px-4 md:px-12 lg:px-20 xl:px-24 py-10">
      {/* Back Button */}
      <Link to="/prevention">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回防治指南
        </Button>
      </Link>

      {/* 导航标签栏 */}
      <div className="w-full mb-8 bg-white p-1 rounded-xl shadow-sm flex-wrap">
        <div className="flex flex-wrap w-full">
          <Link to="/prevention" className="flex-1 md:flex-none">
            <div className="flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-gray-100 ">
              <Heart className="w-4 h-4 mr-2" />
              生活方式
            </div>
          </Link>
          <Link to="/prevention/risk" className="flex-1 md:flex-none">
            <div className="flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-gray-100">
              <Activity className="w-4 h-4 mr-2" />
              风险因素
            </div>
          </Link>
          <Link to="/prevention/screening" className="flex-1 md:flex-none">
            <div className="flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-gray-100">
              <Calendar className="w-4 h-4 mr-2" />
              筛查建议
            </div>
          </Link>
          <Link to="/prevention/treatment" className="flex-1 md:flex-none">
            <div className="flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-gray-100">
              <Stethoscope className="w-4 h-4 mr-2" />
              治疗概览
            </div>
          </Link>
        </div>
      </div>

      {/* Header Image */}
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-10">
        <img 
          src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=400&fit=crop" 
          alt="健康生活" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#228B22]/80 to-transparent flex items-center">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-2">每日健康自检清单</h2>
            <p className="text-white/90">养成健康习惯，远离乳腺癌</p>
          </div>
        </div>
      </div>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-[#333] mb-2">恭喜完成！</h3>
              <p className="text-[#666]">你今天完成了所有健康任务！</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress & Achievement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Progress Card */}
        <Card className="border-0 shadow-md md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-[#ff4d94]" />
                <div>
                  <h3 className="font-semibold text-[#333]">今日完成情况</h3>
                  <p className="text-sm text-[#666]">{getMessage()}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-gradient-pink">{checkedItems.length}</span>
                <span className="text-[#666]">/{preventionChecklist.length}</span>
              </div>
            </div>
            <Progress value={progress} className="h-3 mb-2" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#666]">完成度 {Math.round(progress)}%</span>
              <Button variant="ghost" size="sm" onClick={resetChecklist} className="text-[#999]">
                <RotateCcw className="w-4 h-4 mr-1" />
                重置
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Card */}
        <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-amber-50">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">{currentAchievement.icon}</div>
            <h3 className="font-semibold text-[#333] mb-1">{currentAchievement.title}</h3>
            <p className="text-sm text-[#666]">{currentAchievement.desc}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-600 font-medium">连续打卡 {streak} 天</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {Object.entries(categoryColors).map(([category, colorClass]) => {
          const categoryItems = preventionChecklist.filter(item => item.category === category);
          const completedItems = categoryItems.filter(item => checkedItems.includes(item.id));
          const percent = Math.round((completedItems.length / categoryItems.length) * 100);
          
          return (
            <Card key={category} className="border-0 shadow-sm">
              <CardContent className="p-3 text-center">
                <span className={`inline-block px-2 py-1 text-xs rounded-full mb-2 ${colorClass}`}>
                  {category}
                </span>
                <div className="text-lg font-bold text-[#333]">{percent}%</div>
                <div className="text-xs text-[#666]">{completedItems.length}/{categoryItems.length}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Checklist */}
      <Card className="border-0 shadow-md mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#3CB371]" />
            健康习惯打卡
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {preventionChecklist.map((item, idx) => {
              const isChecked = checkedItems.includes(item.id);
              const Icon = item.icon;
              
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => toggleItem(item.id)}
                  className={`
                    flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300
                    ${isChecked ? 'bg-green-50 border-2 border-green-300' : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'}
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 mt-1
                    ${isChecked ? 'bg-green-500' : 'bg-gray-300'}
                  `}>
                    <CheckCircle2 className={`w-5 h-5 text-white ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Icon className="w-4 h-4 text-[#666]" />
                      <p className={`font-medium ${isChecked ? 'text-green-700 line-through' : 'text-[#333]'}`}>
                        {item.item}
                      </p>
                    </div>
                    <p className="text-sm text-[#666] mb-1">{item.detail}</p>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span className="text-xs text-amber-600">{item.benefit}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full shrink-0 ${categoryColors[item.category]}`}>
                    {item.category}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Plan */}
      <Card className="border-0 shadow-md mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#3CB371]" />
            每周健康计划
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {weeklyTips.map((day, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#333]">{day.day}</span>
                  <span className="text-xs text-[#3CB371] bg-green-100 px-2 py-1 rounded-full">{day.theme}</span>
                </div>
                <p className="text-sm text-[#666] mb-2">{day.tip}</p>
                <p className="text-xs text-[#999] flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {day.action}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <Sun className="w-5 h-5" />
            养成好习惯的小贴士
          </h4>
          <ul className="space-y-3">
            {[
              '每天坚持打卡，21天养成好习惯',
              '不必追求完美，逐步改善即可',
              '与家人朋友一起，互相监督鼓励',
              '定期回顾进度，庆祝每个小成就',
              '设置提醒，不要忘记每日打卡'
            ].map((tip, i) => (
              <li key={i} className="text-sm text-amber-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5" />
            健康习惯的重要性
          </h4>
          <ul className="space-y-3">
            {[
              '健康生活方式可降低30%乳腺癌风险',
              '规律运动有助于维持健康体重',
              '均衡饮食提供身体所需营养',
              '充足睡眠有助于身体修复',
              '定期筛查可早期发现病变'
            ].map((tip, i) => (
              <li key={i} className="text-sm text-blue-700 flex items-center gap-2">
                <Award className="w-4 h-4 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Link to="/prevention">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回防治指南
          </Button>
        </Link>
        <Link to="/prevention/screening">
          <Button className="bg-gradient-prevention text-white">
            查看筛查指南
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
