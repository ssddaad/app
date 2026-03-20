import { useState } from 'react';
import { HeartPulse, BookOpen, Shield, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: "cause",
    icon: HeartPulse,
    title: "病因",
    subtitle: "了解风险",
    detail: "了解乳腺癌的发病原因和风险因素，掌握科学的健康知识。",
    // 樱花奶霜：#FFF4F5 → #FFD1D6 → #FFB3C1 → #FF8DA9
    gradientClass: "bg-[linear-gradient(135deg,_#FFF4F5_0%,_#FFD1D6_30%,_#FFB3C1_70%,_#FF8DA9_100%)]",
    path: "/cause"
  },
  {
    id: "symptom",
    icon: BookOpen,
    title: "症状",
    subtitle: "识别早期症状和警告信号",
    detail: "识别乳腺癌的早期症状和警告信号，了解何时需要就医，做到早发现、早治疗。",
    // 蜜桃雪融：#FFF0F5 → #FFB3C6 → #FFD4E6 → #F5C2D8 → #E8D8ED
    gradientClass: "bg-[linear-gradient(135deg,_#FFF0F5_0%,_#FFB3C6_25%,_#FFD4E6_50%,_#F5C2D8_75%,_#E8D8ED_100%)]",
    path: "/symptom"
  },
  {
    id: "prevention",
    icon: Shield,
    title: "防治",
    subtitle: "学习预防和防治方法",
    detail: "学习乳腺癌的预防和防治方法，掌握健康生活的关键，守护健康每一天。",
    // 粉雾轻盈：#F5F0FA → #E6DCE6 → #D8BFD8 → #C59FC5 → #B886B8
    gradientClass: "bg-[linear-gradient(135deg,_#F5F0FA_0%,_#E6DCE6_25%,_#D8BFD8_50%,_#C59FC5_75%,_#B886B8_100%)]",
    path: "/prevention"
  },
];

export default function ServiceCards() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="py-10 bg-[linear-gradient(135deg,_#fef7f0_0%,_#fff5f7_50%,_#f0f9ff_100%)]">
      <div className="w-full px-4 md:px-12 lg:px-20 xl:px-24">
        <header className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#ff4d94] mb-3">
            选择您的服务
          </h2>
          <p className="text-[#666] max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            无论您是想了解乳腺健康知识、进行自我筛查，还是获取专业医学资源，我们都能为您提供帮助
          </p>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isHovered = hoveredCard === index;
            
            return (
              <li key={index}>
                <Link to={service.path}>
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={[
                      "group relative w-full text-left overflow-hidden rounded-3xl p-7 md:p-8",
                      "shadow-xl transition-all duration-300",
                      "cursor-pointer min-h-[220px] md:min-h-[260px]",
                      service.gradientClass,
                      isHovered ? "-translate-y-2 shadow-2xl scale-[1.02]" : ""
                    ].join(" ")}
                  >
                    {/* Animated background circles */}
                    <span className="absolute inset-0 opacity-15">
                      <span className={`
                        absolute top-0 right-0 w-40 h-40 bg-white rounded-full 
                        transition-all duration-500
                        ${isHovered ? "-translate-y-1/3 translate-x-1/3 scale-125" : "-translate-y-1/2 translate-x-1/2"}
                      `} />
                      <span className={`
                        absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full 
                        transition-all duration-500
                        ${isHovered ? "translate-y-1/3 -translate-x-1/3 scale-125" : "translate-y-1/2 -translate-x-1/2"}
                      `} />
                    </span>

                    {/* Shine effect */}
                    <span 
                      className={`
                        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                        bg-gradient-to-r from-transparent via-white/20 to-transparent
                        ${isHovered ? "translate-x-full" : "-translate-x-full"}
                      `}
                      style={{ transition: "transform 0.8s ease, opacity 0.3s ease" }}
                    />

                    <span className="relative z-10 block">
                      {/* 水平排列的图标和标题 */}
                      <div className="flex items-center gap-4 mb-3">
                        <span className={`
                          inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl 
                          bg-white/25 backdrop-blur-sm transition-all duration-300
                          ${isHovered ? "scale-110 rotate-3" : ""}
                        `}>
                          <Icon className="h-7 w-7 text-white" />
                        </span>
                        <h3 className="text-3xl md:text-3xl font-bold text-white leading-tight">
                          {service.title}
                        </h3>
                      </div>

                      <p className="text-white/90 font-medium mb-3 text-sm md:text-base pl-[72px]">
                        {service.subtitle}
                      </p>

                      <p className="text-white/85 text-xs md:text-sm leading-relaxed pl-[72px]">
                        {service.detail}
                      </p>

                      {/* Arrow indicator */}
                      <span className={`
                        absolute bottom-6 right-6 flex items-center gap-1 text-white/80 
                        transition-all duration-300
                        ${isHovered ? "translate-x-1 opacity-100" : "opacity-70"}
                      `}>
                        <span className="text-xs">了解更多</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </span>
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
