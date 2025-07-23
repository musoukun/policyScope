'use client';

import { StreamingMarkdown } from '@/components/StreamingMarkdown';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function SimpleChatPage() {
  const [endpoint, setEndpoint] = useState('/api/chat');
  const [message, setMessage] = useState('こんにちは！日本の政治について教えてください。');
  const [streamCount, setStreamCount] = useState(0);

  const handleStart = () => {
    setStreamCount(prev => prev + 1);
  };

  const handleComplete = () => {
    console.log('ストリーミング完了');
  };

  const handleError = (error: Error) => {
    console.error('ストリーミングエラー:', error);
  };

  const requestBody = {
    messages: [
      {
        role: 'user',
        content: message
      }
    ]
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Simple Chat デモ</CardTitle>
          <CardDescription>
            Mastraとの連携でStreamingMarkdownコンポーネントをテストします
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="endpoint" className="block text-sm font-medium mb-1">
              エンドポイント
            </label>
            <Input
              id="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="/api/chat"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              メッセージ
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="質問を入力してください"
              rows={3}
            />
          </div>
          
          <div className="text-sm text-gray-600">
            ストリーミング実行回数: {streamCount}回
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ストリーミングレスポンス</CardTitle>
        </CardHeader>
        <CardContent>
          <StreamingMarkdown
            endpoint={endpoint}
            requestBody={requestBody}
            onStart={handleStart}
            onComplete={handleComplete}
            onError={handleError}
            className="w-full"
          />
        </CardContent>
      </Card>
      
      <div className="mt-6 text-sm text-gray-500 space-y-2">
        <p><strong>使用方法:</strong></p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>エンドポイントを設定 (例: /api/chat, /api/research-party-ai など)</li>
          <li>メッセージを入力</li>
          <li>「ストリーミング開始」ボタンをクリック</li>
          <li>ストリーミング中は「停止」ボタンで中断可能</li>
          <li>レスポンスはMarkdown形式で表示されます</li>
        </ul>
      </div>
    </div>
  );
}