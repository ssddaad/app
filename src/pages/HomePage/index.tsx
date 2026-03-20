import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import ServiceCards from './sections/ServiceCards';
import WhyChooseUs from './sections/WhyChooseUs';
import AIAssistant from '@/components/AIAssistant/AIAssistant';
import img1 from '@/components/td.png'
import img2 from '@/components/jc.jpg'
import img3 from '@/components/1v1.jpg'
// ==================== 轮播图组件开始 ====================

// 轮播图数据
const BANNER_SLIDES = [
  {
    id: 1,
    image: img1,
    title: '专业乳腺科医生团队',
    subtitle: '20年临床经验，守护您的乳腺健康',
    cta: '立即预约',
  },
  {
    id: 2,
    image: img2,
    title: '多学科联合会诊',
    subtitle: '汇集乳腺外科、肿瘤科、影像科专家',
    cta: '了解详情',
  },
  {
    id: 3,
    image: img3,
    title: '一对一健康咨询',
    subtitle: '耐心解答您的每一个疑问',
    cta: '免费咨询',
  },
];

// 轮播图组件
// 轮播图组件
function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  };

  return (
    <div className="banner-section" style={{ height: '450px' }}>
      <div className="banner-slider" style={{ height: '100%' }}>
        {BANNER_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="banner-overlay" />
            <div className="banner-content">
              <h2 className="banner-title">{slide.title}</h2>
              <p className="banner-subtitle">{slide.subtitle}</p>
              <Link to="/consult">
                <Button className="banner-cta">{slide.cta}</Button>
              </Link>
            </div>
          </div>
        ))}
        
        {/* 轮播控制 */}
        <button className="banner-nav prev" onClick={prevSlide}>
          <ChevronLeft size={24} />
        </button>
        <button className="banner-nav next" onClick={nextSlide}>
          <ChevronRight size={24} />
        </button>
        
        {/* 轮播指示器 */}
        <div className="banner-dots">
          {BANNER_SLIDES.map((_, index) => (
            <button
              key={index}
              className={`banner-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fef7f0_0%,_#fff5f7_50%,_#f0f9ff_100%)] flex flex-col">
      <Header onSearch={() => {}} />
      <BannerCarousel />
      <AIAssistant />
      <div className='bg-[linear-gradient(135deg,_#fef7f0_0%,_#fff5f7_50%,_#f0f9ff_100%)]'>
        <ServiceCards />
        <WhyChooseUs />
      </div>
    </div>
  );
}
