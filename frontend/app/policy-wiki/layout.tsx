import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import Headline from "@/components/ui/headline";

export const metadata: Metadata = {
  title: "日本の政党DeepWiki - PolicyScope",
  description: "AIによる日本の政党に関する包括的な情報分析システム",
};

export default function PolicyWikiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NuqsAdapter>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
          <div className="container mx-auto px-4 py-8">
            <Headline 
              title="日本の政党DeepWiki"
              subtitle="AI-Powered Political Intelligence"
              className="mx-auto"
            />
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </NuqsAdapter>
  );
}