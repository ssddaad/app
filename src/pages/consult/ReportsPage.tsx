import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  Download, 
  Eye, 
  Search,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Printer,
  Share2,
  MessageSquare,
  Upload,
  TrendingUp,
  Bell,
  BookOpen,
  ChevronRight,
  Activity,
  Shield,
  ArrowUpRight,
  Heart,
  User,
  ChevronDown
} from 'lucide-react';
import Header from '@/components/header';
import AIAssistant from '@/components/AIAssistant/AIAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import './ReportsPage.css';

// 报告数据 - 更真实的医疗记录
const REPORTS = [
  {
    id: 'R20240201001',
    type: '乳腺超声',
    hospital: '市中心医院',
    doctor: '李明华',
    date: '2024-02-01',
    status: 'normal',
    summary: '双侧乳腺未见明显异常，建议定期随访',
    details: '双侧乳腺腺体结构清晰，层次分明的皮下脂肪层未见异常回声。双乳各象限探查未见明显肿块及囊性结构，双侧腋窝淋巴结形态正常，皮髓质分界清晰。',
    indicators: [
      { name: '乳腺组织回声', value: '均匀', status: 'normal', ref: '均匀' },
      { name: '导管系统', value: '无扩张', status: 'normal', ref: '无扩张' },
      { name: '血流信号', value: '未见异常', status: 'normal', ref: '未见异常' },
      { name: '腋窝淋巴结', value: '未见肿大', status: 'normal', ref: '未见肿大' },
    ],
    recommendations: '目前检查结果良好，建议每年进行一次乳腺超声检查。日常注意乳房自检，如发现肿块、疼痛或乳头溢液等情况及时就诊。',
  },
  {
    id: 'R20240115002',
    type: '乳腺钼靶',
    hospital: '省人民医院',
    doctor: '王雪梅',
    date: '2024-01-15',
    status: 'attention',
    summary: '右乳良性钙化灶，BI-RADS 2级',
    details: '右乳外上象限可见散在粗大钙化灶，呈良性表现。左乳未见明显异常密度影。双乳皮肤及乳头未见异常，皮下脂肪层清晰。',
    indicators: [
      { name: 'BI-RADS分级', value: '2级', status: 'attention', ref: '0-2级正常' },
      { name: '钙化灶性质', value: '粗大良性', status: 'normal', ref: '粗大/良性' },
      { name: '乳腺密度', value: 'B型（散在纤维腺体型）', status: 'normal', ref: 'A/B/C/D' },
      { name: '结构扭曲', value: '无', status: 'normal', ref: '无' },
    ],
    recommendations: 'BI-RADS 2级为良性发现，无需特殊处理。建议6-12个月后复查钼靶，观察钙化灶有无变化。40岁以上女性建议每年钼靶检查。',
  },
  {
    id: 'R20231210003',
    type: '血常规检查',
    hospital: '市妇幼保健院',
    doctor: '张晓燕',
    date: '2023-12-10',
    status: 'normal',
    summary: '血常规各项指标均在正常参考范围内',
    details: '白细胞计数、红细胞计数、血红蛋白浓度、血小板计数及分类均在正常参考区间内。无贫血及感染迹象。',
    indicators: [
      { name: '白细胞', value: '6.5×10⁹/L', status: 'normal', ref: '4-10×10⁹/L' },
      { name: '血红蛋白', value: '125g/L', status: 'normal', ref: '115-150g/L' },
      { name: '血小板', value: '220×10⁹/L', status: 'normal', ref: '100-300×10⁹/L' },
      { name: '中性粒细胞', value: '58%', status: 'normal', ref: '50-70%' },
    ],
    recommendations: '血液指标正常，提示身体状态良好。化疗期间患者需定期监测血常规，关注白细胞及血小板变化。',
  },
  {
    id: 'R20231105004',
    type: '肿瘤标志物',
    hospital: '肿瘤医院',
    doctor: '刘芳',
    date: '2023-11-05',
    status: 'normal',
    summary: '乳腺癌相关肿瘤标志物均在正常范围内',
    details: 'CA15-3、CA125、CEA、CA19-9等肿瘤标志物检测值均在正常参考范围内，较上次检查无明显波动。',
    indicators: [
      { name: 'CA15-3', value: '12.5 U/mL', status: 'normal', ref: '<28 U/mL' },
      { name: 'CA125', value: '15.2 U/mL', status: 'normal', ref: '<35 U/mL' },
      { name: 'CEA', value: '1.8 ng/mL', status: 'normal', ref: '<5 ng/mL' },
      { name: 'CA19-9', value: '8.5 U/mL', status: 'normal', ref: '<37 U/mL' },
    ],
    recommendations: '肿瘤标志物正常，建议术后患者每3-6个月复查一次。单一指标轻微波动无需过度焦虑，需结合影像学检查综合判断。',
  },
  {
    id: 'R20231020005',
    type: '乳腺MRI',
    hospital: '协和医院',
    doctor: '陈建国',
    date: '2023-10-20',
    status: 'normal',
    summary: '乳腺MRI增强扫描未见异常强化灶',
    details: '双乳实质呈散在纤维腺体型，增强扫描未见异常强化病灶。皮肤及胸壁肌肉未见异常信号，双侧腋窝未见明显肿大淋巴结。',
    indicators: [
      { name: '背景强化', value: '轻度', status: 'normal', ref: '轻度/中度/显著' },
      { name: '病灶强化', value: '无', status: 'normal', ref: '无/有' },
      { name: '时间-信号曲线', value: '正常', status: 'normal', ref: '正常' },
      { name: '淋巴结', value: '未见异常', status: 'normal', ref: '短径<10mm' },
    ],
    recommendations: 'MRI检查敏感性高，适合致密型乳腺及假体植入患者。本例检查结果良好，建议高风险人群每年MRI联合钼靶筛查。',
  },
];

// 报告类型 - 更自然的分类
const REPORT_TYPES = [
  { id: 'all', name: '全部报告' },
  { id: 'imaging', name: '影像检查' },
  { id: 'lab', name: '实验室检查' },
  { id: 'pathology', name: '病理检查' },
  { id: 'followup', name: '随访复查' },
];

// 状态配置 - 更柔和的颜色
const STATUS_CONFIG = {
  normal: { 
    label: '正常', 
    color: '#059669', 
    icon: CheckCircle, 
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0'
  },
  attention: { 
    label: '需关注', 
    color: '#d97706', 
    icon: AlertCircle, 
    bgColor: '#fffbeb',
    borderColor: '#fcd34d'
  },
  abnormal: { 
    label: '异常', 
    color: '#dc2626', 
    icon: AlertCircle, 
    bgColor: '#fef2f2',
    borderColor: '#fecaca'
  },
};

// 检查提醒 - 更贴心的文案
const CHECKUP_REMINDERS = [
  { 
    type: '乳腺超声', 
    nextDate: '2024-08-01', 
    daysLeft: 180, 
    note: '建议每年一次',
    icon: Activity 
  },
  { 
    type: '乳腺钼靶', 
    nextDate: '2024-07-15', 
    daysLeft: 165, 
    note: '40岁以上每年一次',
    icon: Shield 
  },
];

// 健康趋势数据
const HEALTH_TRENDS = [
  { month: '10月', ca153: 12.5, ca125: 15.2 },
  { month: '11月', ca153: 12.8, ca125: 14.9 },
  { month: '12月', ca153: 12.2, ca125: 15.5 },
  { month: '1月', ca153: 12.5, ca125: 15.2 },
  { month: '2月', ca153: 12.3, ca125: 15.0 },
];

// 报告解读指南 - 更实用的内容
const GUIDE_ITEMS = [
  { 
    title: '如何读懂BI-RADS分级', 
    desc: '0-6级分别代表什么含义，是否需要穿刺',
    icon: BookOpen 
  },
  { 
    title: '肿瘤标志物升高怎么办', 
    desc: 'CA153轻微升高的常见原因及应对',
    icon: Activity 
  },
  { 
    title: '不同检查该如何选择', 
    desc: '超声、钼靶、MRI各自的优势与适用人群',
    icon: Stethoscope 
  },
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<typeof REPORTS[0] | null>(null);
  const [showReportDetail, setShowReportDetail] = useState(false);
  const [showTrendDetail, setShowTrendDetail] = useState(false);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  // 过滤报告 - 更智能的分类
  const filteredReports = REPORTS.filter(report => {
    let matchType = selectedType === 'all';
    if (selectedType === 'imaging') {
      matchType = ['乳腺超声', '乳腺钼靶', '乳腺MRI'].includes(report.type);
    } else if (selectedType === 'lab') {
      matchType = ['血常规检查', '肿瘤标志物'].includes(report.type);
    }
    
    const matchSearch = report.type.includes(searchQuery) || 
      report.hospital.includes(searchQuery) ||
      report.doctor.includes(searchQuery) ||
      report.summary.includes(searchQuery);
    return matchType && matchSearch;
  });

  // 统计数据
  const stats = {
    total: REPORTS.length,
    normal: REPORTS.filter(r => r.status === 'normal').length,
    attention: REPORTS.filter(r => r.status === 'attention').length,
    lastCheck: REPORTS[0]?.date,
  };

  const handleViewReport = (report: typeof REPORTS[0]) => {
    setSelectedReport(report);
    setShowReportDetail(true);
  };

  const handleDownload = (report: typeof REPORTS[0]) => {
    toast.success('报告准备下载', {
      description: `${report.type}报告PDF正在生成...`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    toast.success('分享链接已复制', {
      description: '您可以将报告分享给家人或咨询医生',
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedReport(expandedReport === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fef7f0_0%,_#fff5f7_50%,_#f0f9ff_100%)]">
      <Header onSearch={() => {}} />
      
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* 页面头部 - 温暖简洁 */}
        <div className="pt-8 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-rose-400 rounded-full"></div>
            <h1 className="text-3xl font-bold text-gray-900">我的检查档案</h1>
          </div>
          <p className="text-gray-500 ml-4">
            记录您的每一次检查，陪伴您的健康旅程
          </p>
        </div>

        {/* 统计卡片 - 更柔和的设计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-[16px] text-gray-500">检查记录</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm">
            <div className="text-3xl font-bold text-emerald-600 mb-1">{stats.normal}</div>
            <div className="text-[16px] text-gray-500">结果正常</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm">
            <div className="text-3xl font-bold text-amber-600 mb-1">{stats.attention}</div>
            <div className="text-[16px] text-gray-500">需关注</div>
          </div>
          <button 
            onClick={() => setShowTrendDetail(true)}
            className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm hover:border-rose-200 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[16px] text-gray-500">健康趋势</span>
              <ArrowUpRight size={16} className="text-gray-400 group-hover:text-rose-500" />
            </div>
            <div className="text-[16px] font-medium text-gray-700">查看指标变化</div>
          </button>
        </div>

        {/* 筛选与搜索 - 更自然 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {REPORT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-full text-[16px] font-medium whitespace-nowrap transition-all ${
                  selectedType === type.id
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                    : 'bg-white text-gray-600 border border-stone-200 hover:border-rose-300'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="搜索检查项目、医生..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-stone-200 focus:border-rose-300 focus:ring-rose-100 rounded-full"
            />
          </div>
        </div>

        {/* 报告时间线 - 替代卡片列表 */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center justify-between">
            <span className="text-[16px] text-gray-500">共 {filteredReports.length} 份报告</span>
            <span className="text-[16px] text-gray-400">按时间倒序</span>
          </div>
          
          <div className="relative">
            {/* 时间线 */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-stone-200"></div>
            
            {filteredReports.map((report) => {
              const statusConfig = STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG];
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedReport === report.id;
              
              return (
                <div key={report.id} className="relative pl-12 pb-6 last:pb-0">
                  {/* 时间点 */}
                  <div 
                    className="absolute left-2 top-1 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center"
                    style={{ borderColor: statusConfig.color }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: statusConfig.color }}
                    ></div>
                  </div>
                  
                  {/* 报告内容 */}
                  <div 
                    className={`bg-white rounded-xl border transition-all cursor-pointer overflow-hidden ${
                      isExpanded ? 'border-rose-200 shadow-md' : 'border-stone-100 hover:border-stone-200'
                    }`}
                    onClick={() => toggleExpand(report.id)}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[16px]  font-medium text-gray-400 w-16">
                            {report.date.slice(5)}
                          </span>
                          <h3 className="font-semibold text-gray-900 text-[18px]">{report.type}</h3>
                          <span 
                            className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                            style={{ 
                              color: statusConfig.color, 
                              backgroundColor: statusConfig.bgColor,
                              border: `1px solid ${statusConfig.borderColor}`
                            }}
                          >
                            <StatusIcon size={12} />
                            {statusConfig.label}
                          </span>
                        </div>
                        <ChevronDown 
                          size={18} 
                          className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </div>
                      
                      <p className="text-gray-600 text-[16px] mb-3 line-clamp-2">
                        {report.summary}
                      </p>
                      
                      <div className="flex items-center gap-4 text-[16px] text-gray-500">
                        <span className="flex items-center gap-1 text-[16px]">
                          <User size={16} />
                          {report.doctor}
                        </span>
                        <span className="flex items-center gap-1 text-[16px]">
                          <Stethoscope size={16} />
                          {report.hospital}
                        </span>
                      </div>
                    </div>
                    
                    {/* 展开详情 */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-stone-100 bg-stone-50/50">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {report.indicators.slice(0, 4).map((indicator, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-3 border border-stone-100">
                              <div className="text-[14px] text-gray-500 mb-1">{indicator.name}</div>
                              <div className={`font-semibold ${indicator.status === 'normal' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {indicator.value}
                              </div>
                              <div className="text-[14px] text-gray-400 mt-1">参考：{indicator.ref}</div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 border-stone-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewReport(report);
                            }}
                          >
                            <Eye size={16} className="mr-2" />
                            查看完整报告
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 border-stone-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(report);
                            }}
                          >
                            <Download size={16} className="mr-2" />
                            下载PDF
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部两栏 - 更克制的布局 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 检查提醒 */}
          <div className="bg-white rounded-xl p-6 border border-stone-100">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                <Bell size={18} />
              </div>
              <h3 className="font-semibold text-gray-900 text-[21px]">下次检查提醒</h3>
            </div>
            
            <div className="space-y-4">
              {CHECKUP_REMINDERS.map((reminder, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-rose-400">
                      <reminder.icon size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-[17px]">{reminder.type}</div>
                      <div className="text-sm text-gray-500 mt-0.5 ">{reminder.note}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-rose-500">{reminder.daysLeft}</div>
                    <div className="text-sm text-gray-500">天后</div>
                  </div>
                </div>
              ))}
            </div>
            
            <Link to="/appointment">
              <Button className="w-full mt-4 bg-rose-500 hover:bg-rose-600 text-white">
                <Calendar size={16} className="mr-2" />
                预约检查
              </Button>
            </Link>
          </div>

          {/* 知识指南 */}
          <div className="bg-white rounded-xl p-6 border border-stone-100">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                <BookOpen size={18} />
              </div>
              <h3 className="font-semibold text-gray-900 text-[21px]">报告解读指南</h3>
            </div>
            
            <div className="space-y-3">
              {GUIDE_ITEMS.map((item, index) => (
                <button 
                  key={index}
                  className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-stone-50 transition-colors text-left group"
                  onClick={() => toast.info('指南详情', { description: `${item.title}内容准备中` })}
                >
                  <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-500 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                    <item.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-[17px]">{item.title}</div>
                    <div className="text-sm text-gray-500 mt-0.5 line-clamp-1">{item.desc}</div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 上传区域 - 更温和 */}
        <div className="mt-8 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-rose-400">
                <Upload size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">上传外院检查报告</h4>
                <p className="text-sm text-gray-600 mt-0.5">将不同医院的报告统一管理，方便对比分析</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="border-rose-300 text-rose-600 hover:bg-white"
              onClick={() => toast.info('上传功能', { description: '请确保报告图片清晰，文字可辨认' })}
            >
              选择文件
            </Button>
          </div>
        </div>
      </main>

      {/* AI助手 */}
      <AIAssistant />

      {/* 报告详情弹窗 - 更宽更专业 */}
      <Dialog open={showReportDetail} onOpenChange={setShowReportDetail}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto z-[1100]">
          {selectedReport && (
            <>
              <DialogHeader className="border-b border-stone-100 pb-4">
                <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: STATUS_CONFIG[selectedReport.status as keyof typeof STATUS_CONFIG].bgColor,
                      color: STATUS_CONFIG[selectedReport.status as keyof typeof STATUS_CONFIG].color
                    }}
                  >
                    <FileText size={20} />
                  </div>
                  <div>
                    <div>{selectedReport.type}</div>
                    <div className="text-sm font-normal text-gray-500 mt-0.5">
                      {selectedReport.hospital} · {selectedReport.date}
                    </div>
                  </div>
                  <span 
                    className="ml-auto px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      color: STATUS_CONFIG[selectedReport.status as keyof typeof STATUS_CONFIG].color,
                      backgroundColor: STATUS_CONFIG[selectedReport.status as keyof typeof STATUS_CONFIG].bgColor
                    }}
                  >
                    {STATUS_CONFIG[selectedReport.status as keyof typeof STATUS_CONFIG].label}
                  </span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* 检查结论 */}
                <div className="bg-stone-50 rounded-xl p-5 border border-stone-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Heart size={16} className="text-rose-400" />
                    检查结论
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedReport.summary}
                  </p>
                </div>

                {/* 详细描述 */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">详细描述</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {selectedReport.details}
                  </p>
                </div>

                {/* 指标表格 */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">关键指标</h4>
                  <div className="border border-stone-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-stone-50">
                        <tr>
                          <th className="text-left p-3 font-medium text-gray-600">检查项目</th>
                          <th className="text-left p-3 font-medium text-gray-600">结果</th>
                          <th className="text-left p-3 font-medium text-gray-600">参考范围</th>
                          <th className="text-left p-3 font-medium text-gray-600">状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {selectedReport.indicators.map((indicator, idx) => (
                          <tr key={idx} className="bg-white">
                            <td className="p-3 text-gray-900">{indicator.name}</td>
                            <td className="p-3 font-medium text-gray-900">{indicator.value}</td>
                            <td className="p-3 text-gray-500">{indicator.ref}</td>
                            <td className="p-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                indicator.status === 'normal' 
                                  ? 'bg-emerald-50 text-emerald-600' 
                                  : 'bg-amber-50 text-amber-600'
                              }`}>
                                {indicator.status === 'normal' ? '正常' : '需关注'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 医生建议 */}
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Stethoscope size={16} className="text-blue-500" />
                    医生建议
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {selectedReport.recommendations}
                  </p>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <Button variant="outline" onClick={handlePrint} className="flex-1 border-stone-200">
                  <Printer size={16} className="mr-2" />
                  打印
                </Button>
                <Button variant="outline" onClick={handleShare} className="flex-1 border-stone-200">
                  <Share2 size={16} className="mr-2" />
                  分享
                </Button>
                <Button variant="outline" onClick={() => handleDownload(selectedReport)} className="flex-1 border-stone-200">
                  <Download size={16} className="mr-2" />
                  下载
                </Button>
                <Link to="/consult" className="flex-1">
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white">
                    <MessageSquare size={16} className="mr-2" />
                    咨询医生
                  </Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 趋势弹窗 */}
      <Dialog open={showTrendDetail} onOpenChange={setShowTrendDetail}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <TrendingUp size={20} className="text-rose-500" />
              指标变化趋势
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">CA15-3 & CA125 近5个月变化</h4>
              <div className="h-48 flex items-end justify-between gap-2 px-2">
                {HEALTH_TRENDS.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex gap-1 justify-center h-32 items-end">
                      <div 
                        className="w-3 bg-rose-300 rounded-t"
                        style={{ height: `${(data.ca153 / 20) * 100}%` }}
                        title={`CA15-3: ${data.ca153}`}
                      ></div>
                      <div 
                        className="w-3 bg-rose-500 rounded-t"
                        style={{ height: `${(data.ca125 / 20) * 100}%` }}
                        title={`CA125: ${data.ca125}`}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-rose-300 rounded"></div>
                  <span className="text-gray-600">CA15-3</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-rose-500 rounded"></div>
                  <span className="text-gray-600">CA125</span>
                </div>
              </div>
            </div>
            
            <div className="bg-stone-50 rounded-lg p-4 text-sm text-gray-600">
              <p className="leading-relaxed">
                您的肿瘤标志物指标在过去5个月中保持稳定波动，均在正常参考范围内。建议继续保持每3-6个月的复查频率，化疗期间患者需密切监测。
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
