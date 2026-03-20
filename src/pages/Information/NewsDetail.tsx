import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Card, Tag, Divider, Breadcrumb, Avatar } from 'antd';
import { 
  ArrowLeftOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  EyeOutlined,
  ShareAltOutlined,
  LikeOutlined,
  MessageOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import img5 from "@/pages/Information/news1.jpg"
import img6 from "@/pages/Information/news2.jpg"
import img7 from "@/pages/Information/news3.jpg"
import img8 from "@/pages/Information/news4.jpg"

const NewsDetail: React.FC = () => {
  const { newsId } = useParams<{ newsId: string }>();
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

  useEffect(() => {
    const articles: Record<string, any> = {
      '1': { 
        id: 1, 
        title: '最新研究：乳腺癌筛查的益处', 
        date: '2026-01-24', 
        author: '乳腺健康专家团队',
        avatar: img5,
        views: 2580,
        readTime: '5分钟',
        image: img5,
        tags: ['乳腺癌', '筛查', '健康'],
        content: `
          <p class="lead-paragraph">乳腺癌是全球女性最常见的恶性肿瘤之一，但好消息是，通过定期筛查，我们可以在早期阶段发现乳腺癌，大大提高治愈率。</p>
          
          <h3>为什么筛查如此重要？</h3>
          <p>早期发现的乳腺癌通常更容易治疗，五年生存率超过90%。定期筛查可以帮助医生在癌细胞扩散之前发现异常，从而为患者争取最佳的治疗时机。</p>
          
          <div class="highlight-box">
            <h4>关键数据</h4>
            <ul>
              <li>早期乳腺癌五年生存率：<strong>90%以上</strong></li>
              <li>定期筛查可降低乳腺癌死亡率：<strong>20-30%</strong></li>
              <li>建议开始筛查年龄：<strong>40岁</strong></li>
            </ul>
          </div>
          
          <h3>筛查方法有哪些？</h3>
          <div class="content-grid">
            <div class="content-card">
              <h4>乳腺X光检查（钼靶）</h4>
              <p>最常用的筛查方法，能够发现微小的钙化点，适合40岁以上女性。</p>
            </div>
            <div class="content-card">
              <h4>乳腺超声</h4>
              <p>适合致密型乳腺的女性，可以区分囊肿和实性肿块，无辐射。</p>
            </div>
            <div class="content-card">
              <h4>乳腺磁共振</h4>
              <p>适用于高风险人群，敏感度高，但成本较高。</p>
            </div>
          </div>
          
          <h3>什么时候开始筛查？</h3>
          <p>一般建议40岁以上的女性每年进行一次乳腺X光检查。如果有家族史或其他高风险因素，可能需要更早开始筛查。以下是具体的筛查建议：</p>
          <ul>
            <li><strong>40-44岁：</strong>可选择每年进行一次乳腺X光检查</li>
            <li><strong>45-54岁：</strong>建议每年进行一次乳腺X光检查</li>
            <li><strong>55岁及以上：</strong>建议每两年进行一次乳腺X光检查</li>
            <li><strong>高风险人群：</strong>需要更早开始筛查，并可能需要更频繁的检查</li>
          </ul>
          
          <h3>自我检查也很重要</h3>
          <p>除了专业筛查，每月进行一次乳腺自我检查也很重要。注意观察乳房形状、皮肤变化，以及是否有肿块。自我检查的最佳时间是在月经结束后一周。</p>
          
          <div class="tip-box">
            <h4>自我检查步骤</h4>
            <ol>
              <li>站在镜子前，观察乳房外观是否有变化</li>
              <li>举起手臂，检查乳房轮廓</li>
              <li>平躺，用手指指腹按压检查是否有肿块</li>
              <li>检查腋下淋巴结是否肿大</li>
            </ol>
          </div>
          
          <p>记住，早期发现是战胜乳腺癌的关键。定期筛查，关爱自己！</p>
        ` 
      },
      '2': { 
        id: 2, 
        title: '乳腺癌治疗新突破', 
        date: '2026-01-23', 
        author: '肿瘤科专家',
        avatar: img6,
        views: 1892,
        readTime: '4分钟',
        image: img6,
        tags: ['治疗', '新药', '突破'],
        content: `
          <p class="lead-paragraph">近年来，乳腺癌治疗领域取得了令人振奋的突破，为患者带来了新的希望。从靶向治疗到免疫治疗，医学的进步正在改变乳腺癌的治疗格局。</p>
          
          <h3>靶向治疗的进展</h3>
          <p>针对HER2阳性乳腺癌的靶向药物不断更新迭代，新的药物组合显示出更好的疗效和更少的副作用。最新的ADC药物（抗体药物偶联物）能够精准打击癌细胞，同时保护正常细胞。</p>
          
          <div class="highlight-box">
            <h4>靶向治疗优势</h4>
            <ul>
              <li>精准打击癌细胞，副作用更小</li>
              <li>口服药物方便患者服用</li>
              <li>可与其他治疗方法联合使用</li>
            </ul>
          </div>
          
          <h3>免疫治疗的应用</h3>
          <p>免疫检查点抑制剂在三阴性乳腺癌治疗中展现出良好的前景，为这类难治性乳腺癌提供了新的治疗选择。通过激活患者自身的免疫系统来攻击癌细胞，这是一种全新的治疗思路。</p>
          
          <h3>个体化治疗方案</h3>
          <p>基于基因检测的个体化治疗越来越普及，医生可以根据患者的基因特征制定最适合的治疗方案。这种精准医疗模式大大提高了治疗效果，减少了不必要的治疗。</p>
          
          <div class="content-grid">
            <div class="content-card">
              <h4>基因检测</h4>
              <p>通过基因分析，预测治疗效果和复发风险。</p>
            </div>
            <div class="content-card">
              <h4>精准用药</h4>
              <p>根据基因特征选择最有效的药物。</p>
            </div>
            <div class="content-card">
              <h4>动态监测</h4>
              <p>治疗过程中持续监测，及时调整方案。</p>
            </div>
          </div>
        ` 
      },
      '3': { 
        id: 3, 
        title: '乳腺健康：日常护理指南', 
        date: '2026-01-22', 
        author: '乳腺护理专家',
        avatar: '/images/news3.jpg',
        views: 3241,
        readTime: '6分钟',
        image: img7,
        tags: ['护理', '健康', '生活'],
        content: `
          <p class="lead-paragraph">保持乳腺健康需要从日常生活做起，养成良好的生活习惯对预防乳腺疾病至关重要。本文将为您详细介绍乳腺健康的日常护理方法。</p>
          
          <h3>健康饮食</h3>
          <p>合理的饮食结构对乳腺健康有着重要影响。以下是一些饮食建议：</p>
          <ul>
            <li>多吃蔬菜水果，特别是十字花科蔬菜（如西兰花、卷心菜）</li>
            <li>选择全谷物食品，减少精制碳水化合物的摄入</li>
            <li>限制红肉和加工肉类的摄入</li>
            <li>保持健康体重，避免肥胖</li>
          </ul>
          
          <div class="highlight-box">
            <h4>推荐食物</h4>
            <div class="food-list">
              <span class="food-tag">西兰花</span>
              <span class="food-tag">蓝莓</span>
              <span class="food-tag">三文鱼</span>
              <span class="food-tag">坚果</span>
              <span class="food-tag">绿茶</span>
              <span class="food-tag">豆类</span>
            </div>
          </div>
          
          <h3>规律运动</h3>
          <p>每周至少进行150分钟的中等强度有氧运动，如快走、游泳或骑自行车。运动不仅有助于保持健康体重，还能调节激素水平，降低乳腺癌风险。</p>
          
          <h3>限制酒精摄入</h3>
          <p>研究表明，酒精摄入与乳腺癌风险相关，建议限制饮酒或完全戒酒。即使是少量饮酒也可能增加风险。</p>
          
          <h3>定期自检</h3>
          <p>每月进行一次乳腺自我检查，熟悉自己的乳房状态，及时发现异常。自我检查应在月经结束后一周进行。</p>
          
          <div class="tip-box">
            <h4>自检要点</h4>
            <ol>
              <li>观察乳房外观是否有变化</li>
              <li>触摸检查是否有肿块</li>
              <li>注意乳头是否有异常分泌物</li>
              <li>检查腋下是否有肿大淋巴结</li>
            </ol>
          </div>
        ` 
      },
      '4': { 
        id: 4, 
        title: '乳腺癌的早期症状有哪些？', 
        date: '2026-01-21', 
        author: '乳腺专科医生',
        avatar: '/images/news4.jpg',
        views: 4567,
        readTime: '5分钟',
        image: img8,
        tags: ['症状', '早期', '预防'],
        content: `
          <p class="lead-paragraph">了解乳腺癌的早期症状对于及时发现和治疗至关重要。早期乳腺癌往往没有明显症状，但了解一些警示信号可以帮助您及时就医。</p>
          
          <h3>常见早期症状</h3>
          <div class="symptom-grid">
            <div class="symptom-card">
              <h4>乳房肿块</h4>
              <p>乳房或腋下出现无痛性肿块，质地较硬，边界不清。</p>
            </div>
            <div class="symptom-card">
              <h4>皮肤变化</h4>
              <p>乳房皮肤出现凹陷、橘皮样改变或红肿。</p>
            </div>
            <div class="symptom-card">
              <h4>乳头溢液</h4>
              <p>乳头出现血性或清水样分泌物，尤其是单侧。</p>
            </div>
            <div class="symptom-card">
              <h4>乳头内陷</h4>
              <p>乳头突然内陷或方向改变。</p>
            </div>
          </div>
          
          <h3>什么时候应该就医？</h3>
          <p>如果您发现以下任何情况，请尽快就医：</p>
          <ul>
            <li>乳房出现新的肿块或硬结</li>
            <li>乳房皮肤出现凹陷、皱褶或橘皮样改变</li>
            <li>乳头出现血性分泌物</li>
            <li>乳头突然内陷</li>
            <li>乳房或腋下持续疼痛</li>
            <li>乳房大小或形状发生明显变化</li>
          </ul>
          
          <div class="warning-box">
            <h4>重要提醒</h4>
            <p>大多数乳房肿块并非癌症，但任何新出现的肿块都应该由医生检查。早期发现是治愈乳腺癌的关键！</p>
          </div>
          
          <h3>定期筛查的重要性</h3>
          <p>即使您没有症状，定期筛查也非常重要。许多早期乳腺癌是通过筛查发现的，此时肿瘤较小，更容易治疗。</p>
        ` 
      },
    };
    
    const currentArticle = articles[newsId || '1'];
    setArticle(currentArticle);
    
    // 设置相关文章
    const related = Object.values(articles)
      .filter(a => a.id !== parseInt(newsId || '1'))
      .slice(0, 3);
    setRelatedArticles(related);
  }, [newsId]);

  if (!article) return (
    <div className="article-loading">
      <div className="loading-spinner"></div>
      <p>正在加载文章...</p>
    </div>
  );

  return (
    <div className="article-detail-page">
      {/* 文章头部大图 */}
      <div className="article-hero">
        <img src={article.image} alt={article.title} className="article-hero-image" />
        <div className="article-hero-overlay"></div>
        <div className="article-hero-content">
          <Breadcrumb className="article-breadcrumb">
            <Breadcrumb.Item><Link to="/info">首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/info/info">资讯</Link></Breadcrumb.Item>
            <Breadcrumb.Item>文章详情</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="article-hero-title">{article.title}</h1>
          <div className="article-hero-meta">
            <div className="article-author">
              <Avatar src={article.avatar} icon={<UserOutlined />} />
              <span>{article.author}</span>
            </div>
            <span className="meta-divider">|</span>
            <span className="meta-item"><CalendarOutlined /> {article.date}</span>
            <span className="meta-divider">|</span>
            <span className="meta-item"><EyeOutlined /> {article.views} 阅读</span>
            <span className="meta-divider">|</span>
            <span className="meta-item"><ClockCircleOutlined /> {article.readTime}</span>
          </div>
          <div className="article-tags">
            {article.tags.map((tag: string) => (
              <Tag key={tag} color="#6B9080">{tag}</Tag>
            ))}
          </div>
        </div>
      </div>

      {/* 文章内容 */}
      <div className="article-content-wrapper">
        <div className="article-main">
          <Card className="article-content-card">
            <div 
              className="article-content" 
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            
            <Divider />
            
            {/* 文章底部操作 */}
            <div className="article-actions">
              <Button type="primary" icon={<LikeOutlined />} className="action-btn">
                点赞
              </Button>
              <Button icon={<ShareAltOutlined />} className="action-btn">
                分享
              </Button>
              <Button icon={<MessageOutlined />} className="action-btn">
                评论
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
        
        {/* 侧边栏 - 相关文章 */}
        <div className="article-sidebar">
          <Card title="相关文章" className="related-articles-card">
            {relatedArticles.map((related) => (
              <Link 
                key={related.id} 
                to={`/info/news/${related.id}`}
                className="related-article-item"
              >
                <img src={related.image} alt={related.title} />
                <div className="related-article-info">
                  <h4>{related.title}</h4>
                  <span><CalendarOutlined /> {related.date}</span>
                </div>
              </Link>
            ))}
          </Card>
          
          <Card className="health-tip-card">
            <div className="tip-icon">💡</div>
            <h4>健康小贴士</h4>
            <p>每月进行一次乳腺自我检查，熟悉自己的乳房状态，及时发现异常。</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
