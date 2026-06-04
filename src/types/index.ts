export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  actions?: {
    copy: boolean;
    thumbsUp: boolean;
    thumbsDown: boolean;
  };
}

export interface ConversationState {
  messages: Message[];
  isTyping: boolean;
  isEscalated: boolean;
  stats: {
    ticketsResolved: number;
    avgResolutionTime: number;
    satisfactionScore: number;
    costSaved: number;
  };
}

export interface APISettings {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export type IntentType = 
  | 'order_tracking'
  | 'refund'
  | 'password_reset'
  | 'billing'
  | 'cancellation'
  | 'technical'
  | 'product_info'
  | 'angry'
  | 'general';

export type TabType = 'chat' | 'dashboard' | 'team';

export interface DemoConversation {
  id: string;
  messages: Message[];
  issueType: IntentType;
  resolutionTime: number;
  status: 'resolved' | 'escalated' | 'in_progress';
}
