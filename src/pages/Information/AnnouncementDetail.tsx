import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {  Button, Card, Divider, Breadcrumb, Badge,} from 'antd';
import { 
  ArrowLeftOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
  CheckCircleOutlined,
  RightOutlined
} from '@ant-design/icons';
import img1 from "@/pages/Information/announcement1.jpg"
import img2 from "@/pages/Information/announcement2.jpg"
import img3 from "@/pages/Information/announcement3.jpg"
import img4 from "@/pages/Information/announcement4.jpg"

const AnnouncementDetail: React.FC = () => {
  const { announcementId } = useParams<{ announcementId: string }>();
  const [announcement, setAnnouncement] = useState<any>(null);

  useEffect(() => {
    const announcements: Record<string, any> = {
      '1': { 
        id: 1, 
        title: '乳腺癌防治月活动', 
        date: '2026-01-24',
        endDate: '2026-02-28',
        type: 'event',
        typeLabel: '活动公告',
        typeColor: '#6B9080',
        isUrgent: true,
        image: img1,
        location: '市中心医院门诊大楼3楼乳腺健康中心',
        contact: '400-123-4567',
        organizer: '乳腺健康协会',
        text: `
          <p class="lead-paragraph">每年的十月是乳腺癌防治月，我们特别举办了一系列免费活动，旨在提高公众对乳腺健康的认识，帮助更多女性了解乳腺癌的预防和治疗知识。</p>
          
          <div class="announcement-highlight">
            <h4>🎉 活动亮点</h4>
            <ul>
              <li>免费健康讲座，专家面对面答疑</li>
              <li>免费乳腺超声筛查（限前100名）</li>
              <li>康复者经验分享，传递希望和力量</li>
              <li>精美健康礼品赠送</li>
            </ul>
          </div>
          
          <h3>活动安排</h3>
          <div class="timeline-wrapper">
            <div class="timeline-item">
              <div class="timeline-time">每周六 14:00-16:00</div>
              <div class="timeline-content">
                <h4>免费健康讲座</h4>
                <p>邀请知名乳腺科专家讲解乳腺健康知识，包括乳腺癌的预防、早期筛查、治疗方法等。</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-time">周一至周五 9:00-17:00</div>
              <div class="timeline-content">
                <h4>免费筛查活动</h4>
                <p>为符合条件的女性提供免费的乳腺超声检查，需提前预约。</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-time">每月最后一个周日 15:00-17:00</div>
              <div class="timeline-content">
                <h4>康复者分享会</h4>
                <p>邀请乳腺癌康复者分享她们的治疗经历和心路历程，为正在治疗的患者提供支持和鼓励。</p>
              </div>
            </div>
          </div>
          
          <h3>参与方式</h3>
          <p>请通过以下方式预约参加：</p>
          <ul>
            <li><strong>电话预约：</strong>拨打我们的预约热线 400-123-4567</li>
            <li><strong>在线预约：</strong>关注我们的微信公众号进行在线预约</li>
            <li><strong>现场预约：</strong>直接前往市中心医院门诊大楼3楼乳腺健康中心</li>
          </ul>
          
          <h3>活动地点</h3>
          <div class="location-box">
            <p><EnvironmentOutlined /> 市中心医院门诊大楼3楼乳腺健康中心</p>
            <p>交通便利，可乘坐地铁2号线至中心医院站，A出口步行5分钟即到。</p>
          </div>
          
          <div class="call-to-action">
            <p>让我们一起关注乳腺健康，早预防、早发现、早治疗！</p>
            <p>期待您的参与！</p>
          </div>
        ` 
      },
      '2': { 
        id: 2, 
        title: '新的乳腺癌筛查指南', 
        date: '2026-01-23',
        type: 'guide',
        typeLabel: '指南更新',
        typeColor: '#52c41a',
        isUrgent: false,
        image: img2,
        text: `
          <p class="lead-paragraph">根据最新的医学研究和专家建议，我们对乳腺癌筛查指南进行了更新。新的指南更加科学、更加个性化，旨在帮助不同年龄段和风险等级的女性制定最适合自己的筛查方案。</p>
          
          <div class="announcement-highlight green">
            <h4>📋 主要更新内容</h4>
            <ul>
              <li>建议40-44岁的女性可选择每年进行一次乳腺X光检查</li>
              <li>45-54岁的女性建议每年进行一次乳腺X光检查</li>
              <li>55岁及以上的女性建议每两年进行一次乳腺X光检查</li>
              <li>高风险人群需要更早开始筛查，并可能需要更频繁的检查</li>
            </ul>
          </div>
          
          <h3>高风险因素包括</h3>
          <div class="risk-factors-grid">
            <div class="risk-factor-card">
              <h4>家族史</h4>
              <p>有乳腺癌家族史，特别是一级亲属患病</p>
            </div>
            <div class="risk-factor-card">
              <h4>基因突变</h4>
              <p>携带BRCA1或BRCA2基因突变</p>
            </div>
            <div class="risk-factor-card">
              <h4>既往病史</h4>
              <p>既往有乳腺不典型增生或小叶原位癌</p>
            </div>
            <div class="risk-factor-card">
              <h4>放疗史</h4>
              <p>接受过胸部放疗</p>
            </div>
          </div>
          
          <h3>筛查建议表</h3>
          <div class="screening-table-wrapper">
            <table class="screening-table">
              <thead>
                <tr>
                  <th>年龄段</th>
                  <th>一般风险</th>
                  <th>高风险</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>40-44岁</td>
                  <td>可选择每年筛查</td>
                  <td>建议每年筛查</td>
                </tr>
                <tr>
                  <td>45-54岁</td>
                  <td>建议每年筛查</td>
                  <td>必须每年筛查</td>
                </tr>
                <tr>
                  <td>55岁以上</td>
                  <td>每两年筛查</td>
                  <td>每年筛查</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="tip-box">
            <h4><InfoCircleOutlined /> 重要提示</h4>
            <p>请咨询您的医生，了解适合您的筛查方案。每个人的情况不同，需要个性化的筛查计划。</p>
          </div>
        ` 
      },
      '3': { 
        id: 3, 
        title: '免费健康咨询服务', 
        date: '2026-01-22',
        type: 'service',
        typeLabel: '服务公告',
        typeColor: '#5B8C8C',
        isUrgent: false,
        image: img3,
        contact: '400-123-4567',
        email: 'health@example.com',
        text: `
          <p class="lead-paragraph">我们很高兴地宣布，从本月开始提供免费乳腺健康咨询服务，由专业医护人员为您解答各种乳腺健康问题。无论您有任何疑问，都可以随时联系我们。</p>
          
          <div class="announcement-highlight blue">
            <h4>服务内容</h4>
            <ul>
              <li>乳腺健康知识咨询</li>
              <li>乳腺癌预防建议</li>
              <li>筛查指导</li>
              <li>术后康复指导</li>
              <li>心理支持</li>
            </ul>
          </div>
          
          <h3>咨询方式</h3>
          <div class="contact-methods">
            <div class="contact-card">
              <h4>电话咨询</h4>
              <p>400-123-4567</p>
              <span class="contact-time">周一至周五 9:00-17:00</span>
            </div>
            <div class="contact-card">
              <h4>在线咨询</h4>
              <p>官方网站/微信公众号</p>
              <span class="contact-time">24小时在线</span>
            </div>
            <div class="contact-card">
              <h4>现场咨询</h4>
              <p>市中心医院门诊大楼3楼</p>
              <span class="contact-time">周一至周日 8:00-18:00</span>
            </div>
          </div>
          
          <h3>电子邮件</h3>
          <p>您也可以通过电子邮件联系我们：<MailOutlined /> <a href="mailto:health@example.com">health@example.com</a></p>
          <p>我们会在24小时内回复您的邮件。</p>
          
          <div class="call-to-action blue">
            <p>我们的专业团队随时为您服务，欢迎咨询！</p>
            <p>您的健康，我们的使命。</p>
          </div>
        ` 
      },
      '4': { 
        id: 4, 
        title: '康复者经验分享会', 
        date: '2026-01-21',
        type: 'event',
        typeLabel: '活动公告',
        typeColor: '#6B9080',
        isUrgent: false,
        image: img4,
        location: '市中心医院多功能厅',
        contact: '400-123-4567',
        text: `
          <p class="lead-paragraph">我们诚挚邀请您参加乳腺癌康复者经验分享会。在这里，康复者将分享她们的治疗经历和心路历程，为正在与病魔抗争的患者带来希望和力量。</p>
          
          <div class="announcement-highlight">
            <h4>分享会亮点</h4>
            <ul>
              <li>真实康复故事，传递生命力量</li>
              <li>治疗经验分享，提供实用建议</li>
              <li>心理调适方法，帮助积极面对</li>
              <li>互动交流环节，解答您的疑问</li>
            </ul>
          </div>
          
          <h3>本期分享嘉宾</h3>
          <div class="speakers-grid">
            <div class="speaker-card">
              <h4>张女士</h4>
              <p>5年康复者</p>
              <span>分享主题：从确诊到康复的心路历程</span>
            </div>
            <div class="speaker-card">
              <h4>李女士</h4>
              <p>8年康复者</p>
              <span>分享主题：治疗期间的饮食与运动</span>
            </div>
            <div class="speaker-card">
              <h4>王女士</h4>
              <p>3年康复者</p>
              <span>分享主题：如何保持积极乐观的心态</span>
            </div>
          </div>
          
          <h3>活动信息</h3>
          <div class="event-info-box">
            <p><CalendarOutlined /> <strong>时间：</strong>每月最后一个周日 15:00-17:00</p>
            <p><EnvironmentOutlined /> <strong>地点：</strong>市中心医院多功能厅</p>
            <p><PhoneOutlined /> <strong>报名：</strong>400-123-4567</p>
          </div>
          
          <h3>特别福利</h3>
          <ul>
            <li>免费健康资料包</li>
            <li>专家一对一咨询机会</li>
            <li>康复者互助小组入会资格</li>
            <li>精美纪念品</li>
          </ul>
          
          <div class="call-to-action">
            <p>让我们一起传递希望和力量！</p>
            <p>每一位康复者的故事，都是生命的赞歌。</p>
          </div>
        ` 
      },
    };
    
    setAnnouncement(announcements[announcementId || '1']);
  }, [announcementId]);

  if (!announcement) return (
    <div className="article-loading">
      <div className="loading-spinner"></div>
      <p>正在加载公告...</p>
    </div>
  );

  return (
    <div className="announcement-detail-page">
      {/* 公告头部大图 */}
      <div className="article-hero">
        <img src={announcement.image} alt={announcement.title} className="article-hero-image" />
        <div className="article-hero-overlay"></div>
        <div className="article-hero-content">
          <Breadcrumb className="article-breadcrumb">
            <Breadcrumb.Item><Link to="/info">首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/info/info">公告</Link></Breadcrumb.Item>
            <Breadcrumb.Item>公告详情</Breadcrumb.Item>
          </Breadcrumb>
          
          <div className="announcement-type-badge" style={{ backgroundColor: announcement.typeColor }}>
            {announcement.typeLabel}
            {announcement.isUrgent && <Badge count="紧急" style={{ marginLeft: 8, backgroundColor: '#E57373' }} />}
          </div>
          
          <h1 className="article-hero-title">{announcement.title}</h1>
          <div className="article-hero-meta">
            <span className="meta-item"><CalendarOutlined /> 发布日期：{announcement.date}</span>
            {announcement.endDate && (
              <>
                <span className="meta-divider">|</span>
                <span className="meta-item"><ClockCircleOutlined /> 截止日期：{announcement.endDate}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 公告内容 */}
      <div className="article-content-wrapper">
        <div className="article-main">
          <Card className="article-content-card announcement-content-card">
            {/* 快速信息卡片 */}
            {(announcement.location || announcement.contact) && (
              <div className="quick-info-bar">
                {announcement.location && (
                  <div className="quick-info-item">
                    <EnvironmentOutlined />
                    <span>{announcement.location}</span>
                  </div>
                )}
                {announcement.contact && (
                  <div className="quick-info-item">
                    <PhoneOutlined />
                    <span>{announcement.contact}</span>
                  </div>
                )}
                {announcement.organizer && (
                  <div className="quick-info-item">
                    <UserOutlined />
                    <span>{announcement.organizer}</span>
                  </div>
                )}
              </div>
            )}
            
            <div 
              className="article-content" 
              dangerouslySetInnerHTML={{ __html: announcement.text }}
            />
            
            <Divider />
            
            {/* 公告底部操作 */}
            <div className="article-actions">
              <Button type="primary" icon={<CheckCircleOutlined />} className="action-btn">
                我已了解
              </Button>
              <Button icon={<PhoneOutlined />} className="action-btn">
                联系咨询
              </Button>
            </div>
          </Card>
          
          {/* 返回按钮 */}
          <div className="article-back">
            <Link to="/info">
              <Button icon={<ArrowLeftOutlined />} size="large">
                返回资讯首页
              </Button>
            </Link>
          </div>
        </div>
        
        {/* 侧边栏 */}
        <div className="article-sidebar">
          <Card title="其他公告" className="related-articles-card">
            {[1, 2, 3, 4].filter(id => id !== parseInt(announcementId || '1')).slice(0, 3).map((id) => (
              <Link 
                key={id} 
                to={`/info/announcement/${id}`}
                className="related-article-item"
              >
                <div className="related-bullet" style={{ backgroundColor: '#6B9080' }}></div>
                <div className="related-article-info">
                  <h4>公告标题 {id}</h4>
                  <span><RightOutlined /> 查看详情</span>
                </div>
              </Link>
            ))}
          </Card>
          
          <Card className="health-tip-card announcement-tip-card">
            <h4>关注我们</h4>
            <p>关注我们的微信公众号，第一时间获取最新健康资讯和活动信息。</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetail;
