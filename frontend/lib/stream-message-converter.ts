export interface StreamMessage {
  type: 'text-delta' | 'text-done' | 'error' | 'tool-call';
  textDelta?: string;
  text?: string;
  error?: string;
  toolName?: string;
  args?: Record<string, unknown>;
}

export interface MastraMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export function convertStreamToMarkdown(messages: StreamMessage[]): string {
  return messages
    .filter(msg => msg.type === 'text-delta' && msg.textDelta)
    .map(msg => msg.textDelta)
    .join('');
}

export function parseSSEData(data: string): StreamMessage | null {
  try {
    if (data === '[DONE]') {
      return { type: 'text-done' };
    }
    
    const parsed = JSON.parse(data);
    
    if (parsed.type === 'textDelta' && parsed.textDelta) {
      return {
        type: 'text-delta',
        textDelta: parsed.textDelta
      };
    }
    
    if (parsed.type === 'toolCall' && parsed.toolName) {
      return {
        type: 'tool-call',
        toolName: parsed.toolName,
        args: parsed.args
      };
    }
    
    if (parsed.error) {
      return {
        type: 'error',
        error: parsed.error
      };
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to parse SSE data:', error);
    return null;
  }
}

export function createMastraMessage(
  content: string, 
  role: 'user' | 'assistant' = 'assistant'
): MastraMessage {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    role,
    content,
    timestamp: Date.now()
  };
}