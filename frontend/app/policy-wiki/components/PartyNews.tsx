"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, ExternalLink } from "lucide-react";
import type { Party, PartyNews as PartyNewsType } from "@/types/party";
import { getPartyNews, updatePartyNews } from "@/app/actions/parties";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface PartyNewsProps {
  party: Party;
}

export function PartyNews({ party }: PartyNewsProps) {
  const [newsData, setNewsData] = useState<PartyNewsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadNews();
  }, [party.id]);

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await getPartyNews(party.id);
      setNewsData(data);
    } catch (error) {
      console.error("ニュースの読み込みに失敗しました:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNews = async () => {
    setUpdating(true);
    try {
      const updatedNews = await updatePartyNews(party.id, party.name);
      if (updatedNews) {
        setNewsData(updatedNews);
      }
    } catch (error) {
      console.error("ニュースの更新に失敗しました:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (!newsData && !loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          ニュースを取得するには更新ボタンをクリックしてください
        </p>
        <Button onClick={fetchNews} disabled={updating}>
          {updating ? "取得中..." : "ニュースを取得"}
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
        <div className="flex items-center gap-2">
          {newsData?.updated_at && (
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(newsData.updated_at), {
                addSuffix: true,
                locale: ja,
              })}
            </span>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={fetchNews}
            disabled={updating}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${updating ? "animate-spin" : ""}`} />
            更新
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {newsData?.news_data.map((item, index) => (
          <article
            key={index}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <h4 className="font-medium mb-2">
              {item.タイトル}
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              {item.概要}
            </p>
            <a
              href={item.URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              記事を読む
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}