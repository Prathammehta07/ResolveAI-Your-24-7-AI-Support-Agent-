import type { IntentType } from '@/types';

interface IntentKeywordMap {
  intent: IntentType;
  keywords: string[];
}

const INTENT_KEYWORDS: IntentKeywordMap[] = [
  {
    intent: 'order_tracking',
    keywords: ['order', 'track', 'tracking', 'where', 'package', 'delivery', 'shipping', 'shipped', 'arrive', 'when will', 'hasn\'t arrived', 'not received', 'status', 'dispatch', 'courier', 'fedex', 'ups', 'usps', 'shipment', 'parcel', 'in transit', 'delivered', 'lost package', 'missing order', 'my order', 'order number', 'tracking number', 'delivery status', 'shipping status', 'order status', 'where is my', 'when will it arrive', 'estimated delivery', 'order update'],
  },
  {
    intent: 'refund',
    keywords: ['refund', 'return', 'money back', 'broken', 'defective', 'wrong item', 'not what', 'chargeback', 'get my money', 'damaged', 'faulty', 'exchange', 'replacement', 'dissatisfied', 'disappointed', 'want refund', 'give me refund', 'return policy', 'not working properly', 'quality issue', 'poor quality', 'doesn\'t work', 'item broken', 'need to return', 'send back', 'money return', 'full refund', 'partial refund'],
  },
  {
    intent: 'password_reset',
    keywords: ['password', 'forgot', 'can\'t log in', 'locked out', 'reset', 'login', 'sign in', 'account access', 'authentication', 'credentials', 'unlock', 'recover account', 'forgot password', 'change password', 'new password', 'access denied', 'invalid password', 'cannot login', 'login failed', 'account locked', 'password not working', 'reset password', 'email verification', 'two factor', '2fa', 'security code'],
  },
  {
    intent: 'billing',
    keywords: ['charge', 'charged', 'billed', 'payment', 'invoice', 'fee', 'subscription', 'overcharge', 'double charge', 'unexpected fee', 'billing', 'credit card', 'debit', 'transaction', 'receipt', 'bill', 'cost', 'price', 'pay', 'paid', 'payment failed', 'card declined', 'billing issue', 'payment issue', 'wrong amount', 'incorrect charge', 'cancel charge', 'refund charge', 'subscription fee', 'monthly charge', 'annual charge'],
  },
  {
    intent: 'cancellation',
    keywords: ['cancel', 'stop', 'unsubscribe', 'close account', 'end subscription', 'don\'t want', 'terminate', 'quit', 'leave', 'deactivate', 'delete account', 'remove', 'opt out', 'renewal', 'auto-renew', 'cancel subscription', 'cancel plan', 'stop billing', 'no longer need', 'want to cancel', 'how to cancel', 'cancel service'],
  },
  {
    intent: 'technical',
    keywords: ['not working', 'broken', 'error', 'bug', 'crash', 'slow', 'loading', 'freeze', 'glitch', 'problem with app', 'feature broken', 'issue', 'troubleshoot', 'fix', 'malfunction', 'won\'t open', 'stuck', 'lag', 'performance', 'connectivity', 'server down', 'offline', 'system error', 'app crash', 'website down', 'page not loading', 'white screen', 'black screen', 'connection error', 'timeout', 'api error', 'database error'],
  },
  {
    intent: 'product_info',
    keywords: ['price', 'plan', 'feature', 'what does', 'how much', 'pricing', 'cost', 'compare', 'upgrade', 'downgrade', 'which plan', 'options', 'tiers', 'packages', 'information', 'details', 'tell me about', 'explain', 'help me choose', 'recommendation', 'product details', 'service information', 'what do you offer', 'your services', 'available plans', 'plan comparison', 'best plan', 'recommended plan'],
  },
];

const ANGRY_INDICATORS = [
  'terrible', 'horrible', 'awful', 'worst', 'hate', 'furious', 'angry', 'ridiculous',
  'unacceptable', 'disgusting', 'pathetic', 'useless', 'stupid', 'scam', 'fraud',
  '!!!', 'WORST', 'TERRIBLE', 'HORRIBLE', 'FIX THIS', 'RIGHT NOW', 'IMMEDIATELY',
  'outrageous', 'absurd', 'incompetent', 'unprofessional', 'disgraceful', 'shameful',
  'waste of money', 'never again', 'very disappointed', 'extremely unhappy',
  'this is ridiculous', 'are you kidding', 'i demand', 'complaint', 'complain',
  'sue', 'lawsuit', 'report you', 'bad service', 'poor service', 'worst experience',
];

export function detectIntent(message: string): IntentType {
  const lowerMessage = message.toLowerCase();
  
  // Check for angry sentiment first
  const isAngry = ANGRY_INDICATORS.some(indicator => 
    lowerMessage.includes(indicator.toLowerCase())
  );
  
  if (isAngry) {
    // Check if there's also a specific intent
    for (const { intent, keywords } of INTENT_KEYWORDS) {
      if (keywords.some(kw => lowerMessage.includes(kw.toLowerCase()))) {
        return intent; // Return the specific intent, anger is handled by the prompt
      }
    }
    return 'angry';
  }
  
  // Score-based detection for better accuracy
  let bestIntent: IntentType = 'general';
  let highestScore = 0;
  
  for (const { intent, keywords } of INTENT_KEYWORDS) {
    const score = keywords.filter(kw => lowerMessage.includes(kw.toLowerCase())).length;
    if (score > highestScore) {
      highestScore = score;
      bestIntent = intent;
    }
  }
  
  // Only return non-general if we found at least one keyword match
  return highestScore > 0 ? bestIntent : 'general';
}

export function getScenarioPrompt(intent: IntentType): string | null {
  if (intent === 'general' || intent === 'angry') return null;
  
  const promptMap: Record<string, string> = {
    order_tracking: 'The customer wants to track their order.',
    refund: 'Customer is requesting a refund.',
    password_reset: 'User cannot access their account.',
    billing: 'Customer reports billing discrepancy.',
    cancellation: 'Customer wants to cancel their subscription.',
    technical: 'Customer reports technical issue.',
    product_info: 'Customer is asking about our product/plans.',
  };
  
  return promptMap[intent] || null;
}

export function getIntentLabel(intent: IntentType): string {
  const labels: Record<IntentType, string> = {
    order_tracking: 'Order Tracking',
    refund: 'Refund',
    password_reset: 'Password Reset',
    billing: 'Billing',
    cancellation: 'Cancellation',
    technical: 'Technical Issue',
    product_info: 'Product Info',
    angry: 'Angry Customer',
    general: 'General',
  };
  return labels[intent] || 'General';
}

export function getIntentColor(intent: IntentType): string {
  const colors: Record<IntentType, string> = {
    order_tracking: '#06B6D4',
    refund: '#F97316',
    password_reset: '#8B5CF6',
    billing: '#10B981',
    cancellation: '#EF4444',
    technical: '#F59E0B',
    product_info: '#EC4899',
    angry: '#DC2626',
    general: '#64748B',
  };
  return colors[intent] || '#64748B';
}
