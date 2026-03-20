"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { CalendarDays, User, Bell, ArrowRight } from "lucide-react";

// 新闻数据
const newsList = [
  {
    id: 1,
    title: "乳腺癌筛查：早发现早治疗",
    content: `乳腺癌是全球女性最常见的恶性肿瘤之一，但好消息是，通过定期筛查，我们可以在早期阶段发现乳腺癌，大大提高治愈率。`,
    date: "2026-01-24",
    author: "乳腺健康专家团队",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "乳腺癌治疗新突破",
    content: `近年来，乳腺癌治疗领域取得了令人振奋的突破，为患者带来了新的希望。靶向治疗和免疫治疗的进展为患者提供了更多选择。`,
    date: "2026-01-23",
    author: "肿瘤科专家",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "乳腺健康：日常护理指南",
    content: `保持乳腺健康需要从日常生活做起，养成良好的生活习惯对预防乳腺疾病至关重要。健康饮食、规律运动、限制酒精摄入都很重要。`,
    date: "2026-01-22",
    author: "乳腺护理专家",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=250&fit=crop",
  },
];

// 公告数据
const announcementList = [
  {
    id: 1,
    title: "乳腺癌防治月活动",
    date: "2026-01-24",
  },
  {
    id: 2,
    title: "新的乳腺癌筛查指南",
    date: "2026-01-23",
  },
  {
    id: 3,
    title: "免费健康咨询服务",
    date: "2026-01-22",
  },
];

export default function HealthNewsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <Header />
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-8">
        <div className="flex gap-6">
          {/* 左侧 - 新闻列表 */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-1 h-6 rounded-full"
                style={{ background: "linear-gradient(180deg, #ff6b9d 0%, #ff4d94 100%)" }}
              />
              <h2 className="text-xl font-bold text-[#333]">健康资讯</h2>
            </div>
            
            <div className="space-y-5">
              {newsList.map((news) => (
                <Link key={news.id} href={`/health-news/${news.id}`}>
                  <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer border-none shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                    <CardContent className="p-0">
                      <div className="flex">
                        {/* 图片 */}
                        <div className="w-[200px] h-[140px] flex-shrink-0 overflow-hidden">
                          <img
                            src={news.image || "/placeholder.svg"}
                            alt={news.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        {/* 内容 */}
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-[#333] mb-2 line-clamp-1 hover:text-[#ff6b9d] transition-colors">
                              {news.title}
                            </h3>
                            <p className="text-sm text-[#666] line-clamp-2 leading-relaxed">
                              {news.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-[#999] mt-3">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {news.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              {news.author}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* 右侧 - 公告栏 */}
          <div className="w-[300px] flex-shrink-0">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-1 h-6 rounded-full"
                style={{ background: "linear-gradient(180deg, #ff6b9d 0%, #ff4d94 100%)" }}
              />
              <h2 className="text-xl font-bold text-[#333]">最新公告</h2>
            </div>

            <Card className="border-none shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
              <CardContent className="p-0">
                {announcementList.map((announcement, index) => (
                  <Link 
                    key={announcement.id} 
                    href={`/health-news/announcement/${announcement.id}`}
                    className="block"
                  >
                    <div 
                      className={`p-4 flex items-start gap-3 transition-colors hover:bg-[#fff5f8] cursor-pointer ${
                        index !== announcementList.length - 1 ? "border-b border-[#f0f0f0]" : ""
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #fff0f5 0%, #ffe4ed 100%)" }}
                      >
                        <Bell className="h-4 w-4 text-[#ff6b9d]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#333] mb-1 line-clamp-1 hover:text-[#ff6b9d] transition-colors">
                          {announcement.title}
                        </h4>
                        <p className="text-xs text-[#999]">{announcement.date}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#ccc] flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
