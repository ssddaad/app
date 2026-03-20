"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, User } from "lucide-react";

// 新闻详情数据
const newsData: Record<string, {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  image: string;
}> = {
  "1": {
    id: 1,
    title: "乳腺癌筛查：早发现早治疗",
    content: `
      <p>乳腺癌是全球女性最常见的恶性肿瘤之一，但好消息是，通过定期筛查，我们可以在早期阶段发现乳腺癌，大大提高治愈率。</p>
      
      <h3>为什么筛查如此重要？</h3>
      <p>早期发现的乳腺癌通常更容易治疗，五年生存率超过90%。定期筛查可以帮助医生在癌细胞扩散之前发现异常。</p>
      
      <h3>筛查方法有哪些？</h3>
      <ul>
        <li><strong>乳腺X光检查（钼靶）</strong>：最常用的筛查方法，能够发现微小的钙化点。</li>
        <li><strong>乳腺超声</strong>：适合致密型乳腺的女性，可以区分囊肿和实性肿块。</li>
        <li><strong>乳腺磁共振</strong>：适用于高风险人群。</li>
      </ul>
      
      <h3>什么时候开始筛查？</h3>
      <p>一般建议40岁以上的女性每年进行一次乳腺X光检查。如果有家族史或其他高风险因素，可能需要更早开始筛查。</p>
      
      <h3>自我检查也很重要</h3>
      <p>除了专业筛查，每月进行一次乳腺自我检查也很重要。注意观察乳房形状、皮肤变化，以及是否有肿块。</p>
    `,
    date: "2026-01-24",
    author: "乳腺健康专家团队",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=400&fit=crop",
  },
  "2": {
    id: 2,
    title: "乳腺癌治疗新突破",
    content: `
      <p>近年来，乳腺癌治疗领域取得了令人振奋的突破，为患者带来了新的希望。</p>
      
      <h3>靶向治疗的进展</h3>
      <p>针对HER2阳性乳腺癌的靶向药物不断更新迭代，新的药物组合显示出更好的疗效和更少的副作用。</p>
      
      <h3>免疫治疗的应用</h3>
      <p>免疫检查点抑制剂在三阴性乳腺癌治疗中展现出良好的前景，为这类难治性乳腺癌提供了新的治疗选择。</p>
      
      <h3>个体化治疗方案</h3>
      <p>基于基因检测的个体化治疗越来越普及，医生可以根据患者的基因特征制定最适合的治疗方案。</p>
    `,
    date: "2026-01-23",
    author: "肿瘤科专家",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop",
  },
  "3": {
    id: 3,
    title: "乳腺健康：日常护理指南",
    content: `
      <p>保持乳腺健康需要从日常生活做起，养成良好的生活习惯对预防乳腺疾病至关重要。</p>
      
      <h3>健康饮食</h3>
      <ul>
        <li>多吃蔬菜水果，特别是十字花科蔬菜</li>
        <li>选择全谷物食品</li>
        <li>限制红肉和加工肉类的摄入</li>
        <li>保持健康体重</li>
      </ul>
      
      <h3>规律运动</h3>
      <p>每周至少进行150分钟的中等强度有氧运动，如快走、游泳或骑自行车。</p>
      
      <h3>限制酒精摄入</h3>
      <p>研究表明，酒精摄入与乳腺癌风险相关，建议限制饮酒或完全戒酒。</p>
      
      <h3>定期自检</h3>
      <p>每月进行一次乳腺自我检查，熟悉自己的乳房状态，及时发现异常。</p>
    `,
    date: "2026-01-22",
    author: "乳腺护理专家",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=400&fit=crop",
  },
};

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const news = newsData[id];

  if (!news) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-[#666]">文章不存在</p>
            <Link href="/health-news">
              <Button 
                className="mt-4 text-white"
                style={{ background: "linear-gradient(135deg, #ff6b9d 0%, #ff4d94 100%)" }}
              >
                返回健康资讯
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <Header />
      <main className="flex-1 max-w-[800px] mx-auto w-full px-5 py-8">
        <Link href="/health-news">
          <Button 
            variant="ghost" 
            className="mb-6 text-[#ff6b9d] hover:text-[#ff4d94] hover:bg-[#fff5f8] -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回健康资讯
          </Button>
        </Link>

        <Card className="border-none shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-[#333] mb-4">{news.title}</h1>
            
            <div className="flex items-center gap-6 text-sm text-[#999] mb-6 pb-6 border-b border-[#f0f0f0]">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                发布日期：{news.date}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                作者：{news.author}
              </span>
            </div>

            {news.image && (
              <img
                src={news.image || "/placeholder.svg"}
                alt={news.title}
                className="w-full max-h-[400px] object-cover rounded-lg mb-6"
              />
            )}

            <div 
              className="prose prose-sm max-w-none text-[#444] leading-relaxed
                [&>p]:mb-4 [&>p]:text-base
                [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-[#333] [&>h3]:mt-6 [&>h3]:mb-3
                [&>ul]:my-4 [&>ul]:pl-6 [&>ul>li]:mb-2 [&>ul>li]:text-base
                [&_strong]:text-[#ff6b9d]"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
