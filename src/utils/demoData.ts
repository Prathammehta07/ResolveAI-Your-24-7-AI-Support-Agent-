import type { Message, DemoConversation, IntentType } from '@/types';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function createMessage(role: 'user' | 'assistant', content: string, intent?: IntentType): Message {
  return {
    id: generateId(),
    role,
    content,
    timestamp: new Date(Date.now() - Math.random() * 3600000),
    intent,
    actions: role === 'assistant' ? { copy: false, thumbsUp: false, thumbsDown: false } : undefined,
  };
}

const DEMO_CONVERSATIONS: DemoConversation[] = [
  {
    id: 'demo-1',
    issueType: 'order_tracking',
    resolutionTime: 1.8,
    status: 'resolved',
    messages: [
      createMessage('user', 'Where is my order #ORD-77234? I ordered 3 days ago and haven\'t received any updates.', 'order_tracking'),
      createMessage('assistant', 'I completely understand how eager you must be to receive your package! Let me check on that for you right away.\n\nYour order #ORD-77234 is currently **out for delivery** and should arrive today by 6 PM. The carrier is FedEx, and your tracking number is FX-8847201934.\n\nYou can track it live at fedex.com/tracking. Would you like me to send delivery updates to your email as well?', 'order_tracking'),
      createMessage('user', 'Yes please, that would be great!'),
      createMessage('assistant', 'Perfect! I\'ve enabled email notifications for all delivery updates on order #ORD-77234. You\'ll receive an email when it\'s out for delivery, when it\'s nearby, and when it\'s delivered.\n\nIs there anything else I can help you with today?', 'order_tracking'),
    ],
  },
  {
    id: 'demo-2',
    issueType: 'refund',
    resolutionTime: 3.2,
    status: 'resolved',
    messages: [
      createMessage('user', 'I want a refund for order #ORD-78123. The product arrived broken and this is unacceptable!', 'refund'),
      createMessage('assistant', 'I\'m so sorry the product arrived broken — that\'s absolutely not the experience we want for you. Let me take care of that refund right away.\n\nI\'ve initiated your refund for order #ORD-78123. Here\'s what happens next:\n\n• Refund amount: $49.99 will be returned to your original payment method\n• Processing time: 3-5 business days\n• Confirmation email sent to your registered address\n\nWould you prefer a replacement instead, or is there anything else I can help you with?', 'refund'),
      createMessage('user', 'No, just the refund is fine. Thank you for handling this quickly.'),
      createMessage('assistant', 'You\'re very welcome! Your refund is all set, and you should see the $49.99 back in your account within 3-5 business days. You\'ll get an email confirmation shortly.\n\nI truly apologize again for the broken item. If there\'s anything else I can do to help, please don\'t hesitate to ask!', 'refund'),
    ],
  },
  {
    id: 'demo-3',
    issueType: 'password_reset',
    resolutionTime: 2.1,
    status: 'resolved',
    messages: [
      createMessage('user', 'I forgot my password and can\'t log into my account. Help!', 'password_reset'),
      createMessage('assistant', 'No worries at all — let\'s get you back into your account quickly! Here\'s exactly what to do:\n\n**Step 1:** Go to the login page and click \'Forgot Password\'\n**Step 2:** Enter your registered email address\n**Step 3:** Check your inbox (and spam folder!) for a reset link\n**Step 4:** Click the link within 15 minutes and create a strong new password\n\nThe reset email should arrive within 2 minutes. Did you receive it, or would you like me to manually unlock your account?', 'password_reset'),
      createMessage('user', 'I got the email and reset my password. I\'m back in!'),
      createMessage('assistant', 'That\'s fantastic news! I\'m so glad you\'re back in your account. For security, I recommend enabling two-factor authentication in your account settings — it adds an extra layer of protection.\n\nIs there anything else I can help you with today?', 'password_reset'),
    ],
  },
  {
    id: 'demo-4',
    issueType: 'billing',
    resolutionTime: 4.5,
    status: 'resolved',
    messages: [
      createMessage('user', 'I was double charged on my credit card. There are two charges of $29.99 on May 28th. Fix this immediately!', 'billing'),
      createMessage('assistant', 'I sincerely apologize for the duplicate charge — that should never happen, and I completely understand your frustration. Let me fix this right away.\n\nI\'ve reviewed your billing history, and you\'re absolutely right — there were two identical charges of $29.99 on May 28th. I\'ve initiated an immediate reversal of the duplicate charge.\n\n• Refund amount: $29.99\n• Timeline: 1-2 business days to your credit card ending in 4242\n• Confirmation email sent\n\nI\'ve also added a note to your account to prevent this from happening again. Is there anything else about your billing I can clarify?', 'billing'),
    ],
  },
  {
    id: 'demo-5',
    issueType: 'cancellation',
    resolutionTime: 5.8,
    status: 'resolved',
    messages: [
      createMessage('user', 'I want to cancel my subscription. I\'m not using the service enough to justify the cost.', 'cancellation'),
      createMessage('assistant', 'I\'m sorry to hear you\'re considering leaving us. Before we proceed, may I ask what\'s prompting this decision?\n\nIf it\'s about pricing, I\'d love to offer you a **30% discount for the next 3 months** as a valued customer. That would bring your Pro Plan down to just $20.99/month.\n\nIf you still prefer to cancel, I can process that immediately — no hard feelings! Your access will remain active until the end of your current billing period (June 30th).\n\nWhat would work best for you?', 'cancellation'),
      createMessage('user', 'Actually the discount sounds good. I\'ll stay with the 30% off.'),
      createMessage('assistant', 'That\'s wonderful! I\'m so glad we could make this work for you. I\'ve applied the 30% discount to your Pro Plan — your next 3 monthly charges will be $20.99 instead of $29.99.\n\nThe discount starts with your next billing cycle on July 1st. You\'ll receive a confirmation email shortly.\n\nIf you ever want to explore features you might not be using, I\'m here to help. Is there anything else I can assist with?', 'cancellation'),
    ],
  },
  {
    id: 'demo-6',
    issueType: 'technical',
    resolutionTime: 3.1,
    status: 'resolved',
    messages: [
      createMessage('user', 'The app keeps crashing when I try to export my reports. This has been happening for 2 days now.', 'technical'),
      createMessage('assistant', 'I\'m sorry you\'re experiencing this issue! Let\'s get it sorted out quickly. Try these steps in order:\n\n**Quick Fixes:**\n1. Clear your browser cache and cookies\n2. Try opening the app in an incognito/private window\n3. Check your internet connection (try loading another website)\n4. Try a different browser (Chrome, Firefox, Safari)\n\nIf none of these work, could you share a screenshot of the error message? I\'ll create a priority tech ticket for you with an estimated resolution time of 2-4 hours.\n\nWhich step are you on?', 'technical'),
      createMessage('user', 'Clearing the cache worked! The export is working now.'),
      createMessage('assistant', 'Excellent! I\'m so glad that fixed it. Clearing cache resolves about 80% of similar issues, so you made the right call.\n\nIf this happens again, try the incognito mode trick — it bypasses most browser-related issues instantly.\n\nI\'ve also logged this in our system so our dev team can investigate the root cause. Is there anything else I can help you with today?', 'technical'),
    ],
  },
  {
    id: 'demo-7',
    issueType: 'product_info',
    resolutionTime: 2.4,
    status: 'resolved',
    messages: [
      createMessage('user', 'What plans do you offer? I run a small team of 5 people.', 'product_info'),
      createMessage('assistant', 'Great question! For a team of 5, I\'d recommend our **Pro Plan** — it\'s perfect for small teams and includes everything you need.\n\n**Pro Plan ($29/month per user):**\n• Unlimited projects and team collaboration\n• Advanced analytics and reporting\n• Priority support (that\'s me!)\n• API access for integrations\n• 99.9% uptime SLA\n\nFor 5 users, that\'s $145/month. We also offer a 14-day free trial so you can test everything risk-free.\n\nWould you like me to set up a trial for your team right now?', 'product_info'),
    ],
  },
  {
    id: 'demo-8',
    issueType: 'angry',
    resolutionTime: 6.2,
    status: 'escalated',
    messages: [
      createMessage('user', 'This is RIDICULOUS!!! I\'ve been waiting 5 days for a response and NOTHING. Your service is TERRIBLE and I want to speak to a manager NOW!!!', 'angry'),
      createMessage('assistant', 'I completely understand your frustration, and I sincerely apologize for this experience. You deserve much better from us, and there\'s no excuse for keeping you waiting 5 days.\n\nHere\'s what I\'m doing RIGHT NOW to fix this:\n\n1. I\'m personally escalating this to our senior support team\n2. I\'m adding a **$50 account credit** for the unacceptable delay\n3. I\'m prioritizing your case for immediate resolution within the next 30 minutes\n\nI\'m personally making sure this is resolved for you. A senior specialist will contact you directly within 30 minutes.\n\nCan you confirm the best way to reach you for the update?', 'angry'),
    ],
  },
];

export function getDemoConversations(): DemoConversation[] {
  return DEMO_CONVERSATIONS;
}

export function getInitialMessages(): Message[] {
  // Return the welcome message + first demo conversation messages
  const welcomeMessage: Message = {
    id: 'welcome',
    role: 'assistant',
    content: "Hi there! I'm ResolveAI, your 24/7 support agent. I can help with orders, refunds, billing, password resets, and more. What can I help you with today?",
    timestamp: new Date(),
    actions: { copy: false, thumbsUp: false, thumbsDown: false },
  };
  
  return [welcomeMessage];
}

export function getHourlyDistribution(): { hour: string; resolved: number; escalated: number }[] {
  return [
    { hour: '8am', resolved: 3, escalated: 1 },
    { hour: '9am', resolved: 7, escalated: 2 },
    { hour: '10am', resolved: 12, escalated: 2 },
    { hour: '11am', resolved: 8, escalated: 1 },
    { hour: '12pm', resolved: 5, escalated: 2 },
    { hour: '1pm', resolved: 6, escalated: 1 },
    { hour: '2pm', resolved: 9, escalated: 3 },
    { hour: '3pm', resolved: 11, escalated: 2 },
    { hour: '4pm', resolved: 7, escalated: 1 },
    { hour: '5pm', resolved: 4, escalated: 1 },
  ];
}

export function getTopIssues(): { name: string; count: number }[] {
  return [
    { name: 'Order Tracking', count: 18 },
    { name: 'Refund', count: 12 },
    { name: 'Password Reset', count: 9 },
    { name: 'Billing', count: 7 },
    { name: 'Technical Issue', count: 5 },
    { name: 'Other', count: 3 },
  ];
}

export function getSavingsTrend(): { day: string; savings: number }[] {
  return [
    { day: 'Mon', savings: 2100 },
    { day: 'Tue', savings: 2800 },
    { day: 'Wed', savings: 2400 },
    { day: 'Thu', savings: 3200 },
    { day: 'Fri', savings: 2900 },
    { day: 'Sat', savings: 1800 },
    { day: 'Sun', savings: 1500 },
  ];
}

export function getResolutionTrend(): { time: string; resolved: number; escalated: number }[] {
  return [
    { time: '8am', resolved: 3, escalated: 1 },
    { time: '9am', resolved: 7, escalated: 2 },
    { time: '10am', resolved: 12, escalated: 2 },
    { time: '11am', resolved: 8, escalated: 1 },
    { time: '12pm', resolved: 5, escalated: 2 },
    { time: '1pm', resolved: 6, escalated: 1 },
    { time: '2pm', resolved: 9, escalated: 3 },
    { time: '3pm', resolved: 11, escalated: 2 },
    { time: '4pm', resolved: 7, escalated: 1 },
    { time: '5pm', resolved: 4, escalated: 1 },
  ];
}
