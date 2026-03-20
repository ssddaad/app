import React from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import { RightOutlined, CalendarOutlined, FieldTimeOutlined } from '@ant-design/icons';
import NewsDetail from './NewsDetail';
import AnnouncementDetail from './AnnouncementDetail';
import './information.css';
import Header from '@/components/header'; 
import AIAssistant from '@/components/AIAssistant/AIAssistant';
import img1 from "@/pages/Information/announcement1.jpg"
import img2 from "@/pages/Information/announcement2.jpg"
import img3 from "@/pages/Information/announcement3.jpg"
import img4 from "@/pages/Information/announcement4.jpg"
import img5 from "@/pages/Information/news1.jpg"
import img6 from "@/pages/Information/news2.jpg"
import img7 from "@/pages/Information/news3.jpg"
import img8 from "@/pages/Information/news4.jpg"
interface NewsItem {
  id: number;
  title: string;
  date: string;
  summary: string;
  image: string;
}

interface AnnouncementItem {
  id: number;
  title: string;
  text: string;
  icon: 'event' | 'guide' | 'service' | 'share';
  image: string;
}

// 使用本地温暖风格的图片
const news: NewsItem[] = [
  { 
    id: 1, 
    title: '最新研究：乳腺癌筛查的益处', 
    date: '2026-01-24', 
    summary: '研究表明定期筛查可以早期发现乳腺癌，五年生存率超过90%',
    image: img5
  },
  { 
    id: 2, 
    title: '乳腺癌治疗新突破', 
    date: '2026-01-23', 
    summary: '新药物在临床试验中显示出良好的治疗效果，为患者带来新希望',
    image: img6
  },
  { 
    id: 3, 
    title: '乳腺健康：日常护理指南', 
    date: '2026-01-22', 
    summary: '专家分享保持乳腺健康的日常习惯和建议，从饮食到运动',
    image: img7
  },
  { 
    id: 4, 
    title: '乳腺癌的早期症状有哪些？', 
    date: '2026-01-21', 
    summary: '了解乳腺癌的早期症状，及时发现及时治疗，提高治愈率',
    image: img8
  },
];

const announcements: AnnouncementItem[] = [
  { 
    id: 1, 
    title: '乳腺癌防治月活动', 
    text: '欢迎参加我们的免费讲座，了解乳腺健康知识，还有免费筛查活动',
    icon: 'event',
    image: img1
  },
  { 
    id: 2, 
    title: '新的乳腺癌筛查指南', 
    text: '了解最新的筛查建议，定期检查是关键，早预防早发现',
    icon: 'guide',
    image: img2
  },
  { 
    id: 3, 
    title: '免费健康咨询服务', 
    text: '我们提供专业的乳腺健康咨询服务，由专业医护人员为您解答',
    icon: 'service',
    image: img3
  },
  { 
    id: 4, 
    title: '康复者经验分享会', 
    text: '邀请乳腺癌康复者分享治疗经历和心路历程，传递希望和力量',
    icon: 'share',
    image: img4
  },
];

function Icon({ type }: { type: AnnouncementItem['icon'] | 'news' }) {
  switch (type) {
    case 'event':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
        </svg>
      );
    case 'guide':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      );
    case 'service':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
      );
    case 'share':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
        </svg>
      );
    case 'news':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 4h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 3h8v2H8v-2zm0 3h5v2H8v-2z"/>
        </svg>
      );
    default:
      return null;
  }
}

const InformationHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fef7f0_0%,_#fff5f7_50%,_#f0f9ff_100%)] flex flex-col">
      <Header onSearch={() => {}} />
      <div className="info-content-wrapper">
        {/* 最新资讯 */}
        <div className="news-section">
          <div className="news-header">
            <div className="section-title-wrapper">
              <div className="section-icon news-icon-bg">
                <Icon type="news" />
              </div>
              <h2>最新资讯</h2>
            </div>
            <Link to="/info/info" className="more-btn">
              查看更多 <RightOutlined />
            </Link>
          </div>
          <div className="news-grid">
            {news.map((item) => (
              <Link to={`/info/news/${item.id}`} key={item.id} className="news-card">
                <div className="news-card-image">
                  <img src={item.image} alt={item.title} />
                  <div className="news-card-overlay">
                    <span className="read-more">阅读全文</span>
                  </div>
                </div>
                <div className="news-card-content">
                  <div className="news-card-meta">
                    <span className="news-date">
                      <CalendarOutlined /> {item.date}
                    </span>
                  </div>
                  <h3 className="news-card-title">{item.title}</h3>
                  <p className="news-card-summary">{item.summary}</p>
                  <div className="news-card-footer">
                    <span className="read-more-link">
                      了解更多 <RightOutlined />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 健康公告 */}
        <div className="announcement-section">
          <div className="announcement-header">
            <div className="section-title-wrapper">
              <div className="section-icon announcement-icon-bg">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
              </div>
              <h2>健康公告</h2>
            </div>
            <Link to="/info/info" className="more-btn">
              查看更多 <RightOutlined />
            </Link>
          </div>
          <div className="announcement-grid">
            {announcements.map((item) => (
              <Link to={`/info/announcement/${item.id}`} key={item.id} className="announcement-card">
                <div className="announcement-card-image">
                  <img src={item.image} alt={item.title} />
                  <div className="announcement-card-badge">
                    <div className={`announcement-icon ${item.icon}`}>
                      <Icon type={item.icon} />
                    </div>
                  </div>
                </div>
                <div className="announcement-card-content">
                  <h3 className="announcement-card-title">{item.title}</h3>
                  <p className="announcement-card-desc">{item.text}</p>
                  <div className="announcement-card-footer">
                    <span className="view-details">
                      <FieldTimeOutlined /> 查看详情 <RightOutlined />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoList: React.FC = () => (
  <div className="info-list-page">
    <div className="info-list-header">
      <Link to="/info" className="back-btn">
        <RightOutlined style={{ transform: 'rotate(180deg)' }} /> 返回首页
      </Link>
      <h2>全部资讯</h2>
    </div>
    <div className="info-list-grid">
      {news.map((n) => (
        <Link key={n.id} to={`/info/news/${n.id}`} className="info-list-card">
          <div className="info-list-image">
            <img src={n.image} alt={n.title} />
          </div>
          <div className="info-list-content">
            <div className="info-list-date">
              <CalendarOutlined /> {n.date}
            </div>
            <h3>{n.title}</h3>
            <p>{n.summary}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

const InformationPage: React.FC = () => {
  return (
    <div className="information-root">
      <div className="main-content">
      <AIAssistant />
      <Routes>
        <Route index element={<InformationHome />} />
        <Route path="info" element={<InfoList />} />
        <Route path="news/:newsId" element={<NewsDetail />} />
        <Route path="announcement/:announcementId" element={<AnnouncementDetail />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
      </div>
    </div>
  )
}

export default InformationPage
