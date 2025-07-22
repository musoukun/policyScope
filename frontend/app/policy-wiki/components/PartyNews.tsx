"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, ExternalLink } from "lucide-react";
import type { Party } from "@/types/party";

interface NewsItem {
  title: string;
  url: string;
  date: string;
  source: string;
  snippet: string;
}

interface PartyNewsProps {
  party: Party;
}

export function PartyNews({ party }: PartyNewsProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // 仮のニュースデータ（実際にはGoogle Searchや別のAPIを使用）
      const mockNews: NewsItem[] = [
        {
          title: `${party.name}が新政策を発表`,
          url: "#",
          date: new Date().toLocaleDateString("ja-JP"),
          source: "日本経済新聞",
          snippet: "最新の政策について詳細を発表しました...",
        },
        {
          title: `${party.name}党首が記者会見`,
          url: "#",
          date: new Date(Date.now() - 86400000).toLocaleDateString("ja-JP"),
          source: "朝日新聞",
          snippet: "重要な発表を行いました...",
        },
        {
          title: `${party.name}の支持率が変動`,
          url: "#",
          date: new Date(Date.now() - 172800000).toLocaleDateString("ja-JP"),
          source: "読売新聞",
          snippet: "最新の世論調査結果によると...",
        },
      ];
      
      setNews(mockNews);
      setFetched(true);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!fetched && !loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          ニュースを取得するには更新ボタンをクリックしてください
        </p>
        <Button onClick={fetchNews}>
          ニュースを取得
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">最新ニュース</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchNews}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          更新
        </Button>
      </div>

      <div className="space-y-4">
        {news.map((item, index) => (
          <article
            key={index}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <h4 className="font-medium mb-1">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline inline-flex items-center gap-1"
              >
                {item.title}
                <ExternalLink className="h-3 w-3" />
              </a>
            </h4>
            <p className="text-sm text-muted-foreground mb-2">{item.snippet}</p>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{item.source}</span>
              <span>{item.date}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}