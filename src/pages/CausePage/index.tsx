import { useEffect, useState, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  HeartPulse, 
  ArrowLeft, 
  Users, 
  Calendar, 
  Activity, 
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronRight,
  Dna,
  Baby,
  Wine
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const riskFactors = [
  { name: '年龄因素', value: 85, description: '45-55岁为高发年龄段，年龄越大风险越高', icon: Calendar, color: '#e11d48' }, // red
  { name: '遗传因素', value: 70, description: 'BRCA1/BRCA2基因突变携带者风险显著增加', icon: Dna, color: '#7c3aed' },     // purple
  { name: '激素因素', value: 65, description: '长期使用雌激素、晚育或未育', icon: Activity, color: '#2563eb' },           // blue
  { name: '生活方式', value: 55, description: '肥胖、缺乏运动、饮酒、吸烟', icon: Wine, color: '#16a34a' },               // green
  { name: '病史因素', value: 60, description: '既往有乳腺良性疾病史或乳腺癌家族史', icon: Stethoscope, color: '#111827' }, // dark
];

const highRiskGroups = [
  { title: '年龄相关', items: ['45岁以上女性', '月经初潮早于12岁', '绝经晚于55岁'], icon: Calendar },
  { title: '遗传相关', items: ['一级亲属患乳腺癌', 'BRCA基因突变携带者', '既往患乳腺癌'], icon: Dna },
  { title: '生育相关', items: ['未生育或首次生育晚于30岁', '未母乳喂养', '长期使用避孕药'], icon: Baby },
  { title: '生活方式', items: ['肥胖或超重', '长期饮酒', '缺乏运动', '长期精神压力'], icon: Activity },
];

const statistics = [
  { label: '全球年新增病例', value: '230万', desc: '每年新增乳腺癌患者' },
  { label: '中国年新增病例', value: '42万', desc: '占全球病例的18%' },
  { label: '早期发现治愈率', value: '90%', desc: '五年生存率' },
  { label: '高危人群占比', value: '15%', desc: '需要重点筛查' },
];

// 调暗/调亮颜色（用于侧壁）
const shadeColor = (hex: string, amount: number) => {
  const f = parseInt(hex.slice(1), 16);
  const R = (f >> 16) & 255;
  const G = (f >> 8) & 255;
  const B = f & 255;
  const t = amount < 0 ? 0 : 255;
  const p = Math.abs(amount);
  const nr = Math.round((t - R) * p) + R;
  const ng = Math.round((t - G) * p) + G;
  const nb = Math.round((t - B) * p) + B;
  return '#' + (0x1000000 + nr * 0x10000 + ng * 0x100 + nb).toString(16).slice(1);
};

// 立体饼图：多层堆叠模拟厚度，支持点击抬起扇区
function getExtrudePieOption(selectedIndex: number | null) {
  const layers = 6;           // 厚度层数更少 → 更扁
  const radius = ['0%', '58%']; // 可保留更大半径（前面你想更宽）
  const centerX = '50%';
  const centerYBase = 58;     // 基准 Y
  const layerGap = 0.9;       // 层间偏移更小 → 更扁
  const sideDarken = -0.25;   // 之前去黑线版的值，保持
  const topLighten = 0.0;
  
  const series: any[] = [];

  // 底层阴影
  series.push({
    name: 'shadow',
    type: 'pie',
    radius,
    center: [centerX, `${centerYBase + layers * layerGap + 2}%`],
    silent: true,
    z: 0,
    itemStyle: { color: 'rgba(0,0,0,0.08)' },
    label: { show: false },
    data: riskFactors.map(f => ({ value: f.value, name: f.name })),
  });

  // 中间层：侧壁
  for (let i = 0; i < layers; i++) {
    const depthRatio = i / (layers - 1);
    series.push({
      name: `side-${i}`,
      type: 'pie',
      radius,
      center: [centerX, `${centerYBase + (layers - 1 - i) * layerGap}%`],
      z: 1 + i,
      silent: true,
      label: { show: false },
      labelLine: { show: false },
      itemStyle: {
        color: (p: any) => shadeColor(riskFactors[p.dataIndex].color, sideDarken * (0.5 + depthRatio * 0.5)),
        borderWidth: 0.6,
        borderColor: 'rgba(0,0,0,0.15)',
      },
      data: riskFactors.map(f => ({ value: f.value, name: f.name })),
    });
  }

  // 顶层：可交互、显示标签
  series.push({
    name: 'top',
    type: 'pie',
    radius,
    center: [centerX, `${centerYBase - 2}%`],
    z: 100,
    selectedMode: 'single',
    startAngle: 90,
    avoidLabelOverlap: true,
    itemStyle: {
      color: (p: any) => shadeColor(riskFactors[p.dataIndex].color, topLighten),
      borderWidth: 1.2,
      borderColor: '#ffffff',
    },
    emphasis: {
      scale: true,
      scaleSize: 6,
      itemStyle: { shadowBlur: 15, shadowColor: 'rgba(0,0,0,0.25)' },
    },
    label: {
      show: true,
      position: 'outside',
      formatter: ({ name, percent }: any) => `${name}\n${percent}%`,
      color: '#333',
      fontSize: 13,
      lineHeight: 18,
    },
    labelLine: {
      show: true,
      length: 16,
      length2: 10,
      lineStyle: { color: '#666', width: 1 },
    },
    data: riskFactors.map((f, idx) => ({
      value: f.value,
      name: f.name,
      selected: selectedIndex === idx,
      // 抬起效果：通过 select.offset 以及侧壁同步偏移实现“突出”
      select: {
        itemStyle: { shadowBlur: 20, shadowColor: f.color + '66' },
        label: { fontWeight: 'bold' },
        labelLine: { lineStyle: { width: 1.5 } },
        offset: 10,
      },
    })),
    animation: true,
    animationEasing: 'elasticOut',
    animationDelay: 150,
  });

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (p: any) => `${p.name}<br/>${p.value}%`,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      backgroundColor: 'rgba(255,255,255,0.98)',
      textStyle: { color: '#111827' },
      padding: [10, 12],
    },
    series,
  };
}

export default function CausePage() {
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [selectedFactor, setSelectedFactor] = useState<typeof riskFactors[0] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setVisibleSections((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-index]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = (index: number) => visibleSections.includes(index);

  // 图表交互
  const onChartClick = (params: any) => {
    if (typeof params.dataIndex !== 'number') return;
    const idx = params.dataIndex;
    setSelectedIndex((prev) => (prev === idx ? null : idx));
    setSelectedFactor((prev) => (prev && prev.name === riskFactors[idx].name ? null : riskFactors[idx]));

    // 同步 ECharts 的选中状态
    const inst = chartRef.current?.getEchartsInstance?.();
    if (inst) {
      inst.dispatchAction({ type: 'downplay', seriesName: 'top' });
      inst.dispatchAction({ type: 'select', seriesName: 'top', dataIndex: idx });
    }
  };

  const onChartMouseOver = (params: any) => {
    if (typeof params.dataIndex === 'number' && selectedFactor === null) {
      setSelectedIndex(params.dataIndex);
    }
  };
  const onChartMouseOut = () => {
    if (selectedFactor === null) setSelectedIndex(null);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-[#2D5A7B] text-white">
        <div className="w-full px-4 md:px-12 lg:px-20 xl:px-24 py-8">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <HeartPulse className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold">乳腺癌病因与风险</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-12 lg:px-20 xl:px-24 py-10">
        {/* 头图横幅 */}  
        <div className="relative h-32 md:h-48 rounded-2xl overflow-hidden mb-10">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=400&fit=crop" 
            alt="医疗检查" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D5A7B]/80 to-transparent flex items-center">
            <div className="p-8">
              <h2 className="text-5xl font-bold text-white mb-2">什么是乳腺癌？</h2>
              <p className="text-white/90">了解疾病，才能更好地预防和应对</p>
            </div>
          </div>
        </div>

        {/* 概览区 */}
        <div 
          data-index={0}
          className={`transition-all duration-700 ${isVisible(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <Card className="mb-10 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-3xl text-[#333]">
                <Info className="w-5 h-5 text-[#40E0D0]" />
                什么是乳腺癌？
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#666] leading-relaxed mb-6 text-[17px]">
                乳腺癌是发生在乳腺腺上皮组织的恶性肿瘤。女性乳腺是由皮肤、纤维组织、乳腺腺体和脂肪组成的，
                乳腺癌中99%发生在女性，男性仅占1%。了解乳腺癌的发病原因和风险因素，是科学预防的第一步。
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statistics.map((stat, idx) => (
                  <div key={idx} className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                    <div className="text-2xl md:text-3xl font-bold text-gradient-pink">{stat.value}</div>
                    <div className="text-[17px] font-medium text-[#333] mt-1">{stat.label}</div>

                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要风险因素 - 立体饼图 */}
        <div 
          data-index={1}
          className={`transition-all duration-700 delay-100 ${isVisible(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-slate-900 flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600" strokeWidth={2} />
              主要风险因素
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 左侧：立体饼图 */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent pointer-events-none" />
              
              <ReactECharts
                ref={chartRef}
                option={getExtrudePieOption(selectedIndex)}
                style={{ height: '420px', width: '100%' }}
                onEvents={{
                  click: onChartClick,
                  mouseover: onChartMouseOver,
                  mouseout: onChartMouseOut,
                }}
              />

              {/* 图例说明 */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
                {riskFactors.map((factor, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedIndex(idx);
                      setSelectedFactor(factor);
                      const inst = chartRef.current?.getEchartsInstance?.();
                      if (inst) {
                        inst.dispatchAction({ type: 'downplay', seriesName: 'top' });
                        inst.dispatchAction({ type: 'select', seriesName: 'top', dataIndex: idx });
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all ${
                      selectedIndex === idx 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: factor.color }}
                    />
                    {factor.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 右侧：详细信息面板 */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              {selectedFactor ? (
                <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                      style={{ 
                        backgroundColor: selectedFactor.color + '15',
                        boxShadow: `0 8px 24px ${selectedFactor.color}25`
                      }}
                    >
                      <selectedFactor.icon 
                        className="w-7 h-7" 
                        style={{ color: selectedFactor.color }} 
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {selectedFactor.name}
                      </h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span 
                          className="text-3xl font-bold"
                          style={{ color: selectedFactor.color }}
                        >
                          {selectedFactor.value}
                        </span>
                        <span className="text-lg text-slate-500">%</span>
                        <span className="text-sm text-slate-400 ml-1">风险指数</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <span className="w-1 h-4 rounded-full" style={{ backgroundColor: selectedFactor.color }} />
                        风险说明
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-lg">
                        {selectedFactor.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <span className="w-1 h-4 rounded-full" style={{ backgroundColor: selectedFactor.color }} />
                        建议措施
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                          定期进行乳腺检查
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                          保持健康生活方式
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                          关注身体异常变化
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div 
                      className="flex items-center gap-2 text-sm px-4 py-3 rounded-lg"
                      style={{ 
                        backgroundColor: selectedFactor.color + '10',
                        color: selectedFactor.color 
                      }}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">建议咨询专业医生评估个人风险</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-16">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: '#f1f5f9' }}
                  >
                    <AlertTriangle className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-500 mb-1">选择风险因素</p>
                  <p className="text-xs text-slate-400">点击或悬停图表查看详细分析</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 高危人群 */}
        <div 
          data-index={2}
          className={`transition-all duration-700 delay-200 ${isVisible(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-slate-900 flex items-center gap-2.5">
              <Users className="w-5 h-5 text-teal-600" strokeWidth={2} />
              高危人群特征
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {highRiskGroups.map((group, idx) => {
              const Icon = group.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-lg border border-slate-200 p-5 hover:border-teal-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 pt-1.5">
                      {group.title}
                    </h3>
                  </div>
                  
                  <ul className="space-y-2.5 pl-12">
                    {group.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* 温馨提示 */}
        <div 
          data-index={3}
          className={`transition-all duration-700 delay-300 ${isVisible(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <Alert className="bg-gradient-to-r from-[#40E0D0]/10 to-[#48D1CC]/10 border-[#40E0D0]/30">
            <Info className="w-5 h-5 text-[#40E0D0]" />
            <AlertDescription className="text-[#333]">
              <span className="font-semibold ">温馨提示：</span>
              如果您属于高危人群，建议从40岁开始每年进行乳腺癌筛查，或比家族最早发病年龄提前10年进行筛查。早期发现是提高治愈率的关键！
            </AlertDescription>
          </Alert>
        </div>

        {/* 继续了解 */}
        <div 
          data-index={4}
          className={`mt-12 pt-8 border-t border-slate-200 transition-all duration-700 delay-400 ${isVisible(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">继续了解</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/symptom" 
              className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-rose-500 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">症状识别</div>
                  <div className="text-sm text-slate-500">了解早期症状和警告信号</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
            </Link>

            <Link 
              to="/prevention" 
              className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">防治指南</div>
                  <div className="text-sm text-slate-500">学习预防和治疗方法</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
