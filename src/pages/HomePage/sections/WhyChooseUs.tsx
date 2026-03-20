import { Users, Clock, Award, Heart } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: "专业团队",
    description: "汇集资深医学专家，提供权威的健康咨询服务",
  },
  {
    icon: Clock,
    title: "24小时在线",
    description: "全天候在线服务，随时为您解答健康疑问",
  },
  {
    icon: Award,
    title: "权威认证",
    description: "所有内容均经过专业医学审核，确保信息准确可靠",
  },
  {
    icon: Heart,
    title: "贴心关怀",
    description: "以患者为中心，提供温暖贴心的全程健康管理",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-8 bg-[linear-gradient(135deg,_#fef7f0_0%,_#fff5f7_50%,_#f0f9ff_100%)]">
      <div className="w-full px-4 md:px-12 lg:px-20 xl:px-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#ff4d94]">
            为什么选择我们
          </h2>
        </div>
        
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <li
                key={index}
                className="group bg-white rounded-2xl p-5 md:p-6 
                  shadow-[0_4px_22px_rgba(0,0,0,0.06)] border border-[#f1f1f1] 
                  transition-all duration-300 
                  hover:shadow-lg hover:-translate-y-1 hover:border-[#ff6b9d]/20"
              >
                {/* 水平排列的图标和标题 */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl 
                      shadow-[0_4px_10px_rgba(255,107,157,0.25)]
                      transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      background: "linear-gradient(135deg, #ff9a9e 0%,rgb(241, 78, 132) 100%)",
                    }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-[20px] font-bold text-[#333] group-hover:text-[#ff4d94] transition-colors leading-tight">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="text-sm text-[#666] leading-relaxed pl-[64px]">
                  {feature.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
