import { useState, useCallback } from 'react';
import type { Message, APISettings, IntentType } from '@/types';
import { MASTER_SYSTEM_PROMPT, SCENARIO_PROMPTS } from '@/prompts/systemPrompt';
import { detectIntent } from '@/utils/intentDetector';

const MOCK_RESPONSES: Record<IntentType, string[]> = {
  order_tracking: [
    "I completely understand how eager you must be to receive your package! Let me check on that for you right away.\n\nYour order #ORD-78234 is currently **out for delivery** and should arrive today by 6 PM. The carrier is FedEx, and your tracking number is FX-8847201934.\n\nYou can track it live at fedex.com/tracking. Would you like me to send delivery updates to your email as well?",
    "I've pulled up your order details! Your package was shipped on June 2nd via UPS Express and is currently at your local distribution center — just one stop away from delivery.\n\nEstimated delivery: **Today by 8 PM**\nTracking: UPS-1Z999AA10123456784\n\nIs there anything specific about the delivery you'd like me to help with?",
    "Let me look into your order status right now! I can see your order #ORD-78234 has been shipped and is in transit.\n\n📦 **Current Status:** In Transit\n🚚 **Carrier:** USPS Priority Mail\n📍 **Location:** Arrived at local facility\n⏰ **Expected Delivery:** Tomorrow by 5 PM\n\nWould you like me to set up SMS notifications for delivery updates?"
  ],
  refund: [
    "I'm so sorry the product didn't meet your expectations. Let me take care of that refund for you right away.\n\nI've initiated your refund for order #ORD-78234. Here's what happens next:\n\n• Refund amount: $49.99 will be returned to your original payment method\n• Processing time: 3-5 business days\n• Confirmation email sent to your registered address\n\nWould you prefer a replacement instead, or is there anything else I can help you with?",
    "I completely understand, and I apologize for the inconvenience. Your satisfaction is our priority.\n\nI've processed your refund request:\n\n**Refund Details:**\n- Order: #ORD-78234\n- Amount: $89.99\n- Method: Original credit card ending in 4242\n- Timeline: 3-5 business days\n\nYou'll receive an email confirmation shortly. Would you like to explore alternative products that might better suit your needs?",
    "I sincerely apologize for the issue with your order. Let me process that refund immediately.\n\n✅ **Refund Initiated**\n💰 Amount: $129.99\n💳 To: Visa ending in 8765\n⏱️ Processing: 2-3 business days (expedited)\n\nI've also added a $10 store credit to your account for the trouble. Is there anything else I can assist you with today?"
  ],
  password_reset: [
    "No worries at all — let's get you back into your account quickly! Here's exactly what to do:\n\n**Step 1:** Go to the login page and click 'Forgot Password'\n**Step 2:** Enter your registered email address\n**Step 3:** Check your inbox (and spam folder!) for a reset link\n**Step 4:** Click the link within 15 minutes and create a strong new password\n\nThe reset email should arrive within 2 minutes. Did you receive it, or would you like me to manually unlock your account?",
    "I can definitely help you regain access! Here's the step-by-step reset process:\n\n1. Visit our login page → Click **'Forgot Password'**\n2. Enter your email: user@example.com\n3. Check your email for a secure reset link (valid for 15 minutes)\n4. Create a new password with at least 8 characters\n\nIf you don't see the email in 2 minutes, check your spam folder. Still having trouble? I can unlock your account manually right now!",
    "Let's get your password reset right away! I've just triggered a password reset to your registered email.\n\n🔑 **Reset Email Sent**\n📧 To: user@example.com\n⏰ Link expires in: 15 minutes\n\nPlease check your inbox (and spam folder). Once you click the link, you'll be able to set a new password immediately. Need me to resend it or help with anything else?"
  ],
  billing: [
    "I sincerely apologize for the confusion regarding that charge. Let me review this with you right away.\n\nI can see a charge of $29.99 on your account dated June 1st. This appears to be your monthly subscription renewal for the Pro Plan.\n\nWould you like me to:\n• Send you a detailed invoice breakdown?\n• Check if there was a double charge?\n• Discuss switching to a different plan?\n\nI want to make sure everything is clear and fair for you.",
    "Thank you for bringing this to my attention. I completely understand your concern about unexpected charges.\n\nI've reviewed your billing history, and I can confirm that the $49.99 charge on May 28th was for your annual subscription renewal. However, I also noticed you were charged twice!\n\nI've initiated an immediate reversal of the duplicate charge ($49.99 will be refunded within 1-2 business days). You'll receive a confirmation email shortly.\n\nIs there anything else about your billing you'd like me to clarify?",
    "I understand your concern about the billing discrepancy. Let me investigate this immediately.\n\nAfter reviewing your account, I found:\n💳 Charge: $59.99 on June 3rd\n📋 Reason: Annual Premium Plan renewal\n✅ Status: Valid charge\n\nHowever, I notice you weren't notified beforehand. I apologize for that oversight. I've sent you a detailed invoice and added a $5 credit to your account for the inconvenience. Would you like me to explain any specific charges?"
  ],
  cancellation: [
    "I'm sorry to hear you're considering leaving us. Before we proceed, may I ask what's prompting this decision?\n\nIf it's about pricing, I'd love to offer you a **30% discount for the next 3 months** as a valued customer. That would bring your Pro Plan down to just $20.99/month.\n\nIf you still prefer to cancel, I can process that immediately — no hard feelings! Your access will remain active until the end of your current billing period (June 30th).\n\nWhat would work best for you?",
    "I understand, and I respect your decision. Let me help you with that right away.\n\nI've processed your cancellation request:\n\n• Plan: Pro Monthly\n• Cancellation effective: June 30, 2026\n• You'll retain full access until then\n• No further charges will occur\n\nYour account data will be preserved for 30 days in case you change your mind. We'd absolutely love to have you back anytime — just log in and reactivate!\n\nIs there anything else I can help you with today?",
    "I appreciate you being a valued customer, and I'm sorry to see you go. Before I process the cancellation, could you share what's not working for you?\n\nBased on your feedback, I can:\n✨ Offer a customized plan\n✨ Provide additional features at no cost\n✨ Give you a 2-month free trial of our Enterprise tier\n\nOr if you're certain, I'll process the cancellation immediately with no questions asked. Your call!"
  ],
  technical: [
    "I'm sorry you're experiencing this issue! Let's get it sorted out quickly. Try these steps in order:\n\n**Quick Fixes:**\n1. Clear your browser cache and cookies\n2. Try opening the app in an incognito/private window\n3. Check your internet connection (try loading another website)\n4. Try a different browser (Chrome, Firefox, Safari)\n\nIf none of these work, could you share a screenshot of the error message? I'll create a priority tech ticket for you with an estimated resolution time of 2-4 hours.\n\nWhich step are you on?",
    "That sounds frustrating, and I apologize for the trouble. Let's troubleshoot this together!\n\n**Let's try these solutions:**\n• **First:** Close and reopen the app completely\n• **Then:** Check if your app is updated to the latest version\n• **Next:** Try logging out and back in\n• **Finally:** Clear app data/cache from your device settings\n\nStill having issues? I've created a support ticket (#TECH-4521) with high priority. Our tech team will reach out within 2 hours with a specialized fix.\n\nWould you like me to also send you temporary access via our web app?",
    "I understand how frustrating technical issues can be. Let me help you resolve this step by step.\n\n🔧 **Troubleshooting Steps:**\n1. Restart your device\n2. Update to the latest app version (v3.2.1)\n3. Clear cache: Settings → Storage → Clear Cache\n4. Reinstall the app if needed\n\nIf the issue persists after trying these steps, I'll escalate this to our senior tech team immediately. Can you tell me which step you're stuck on?"
  ],
  product_info: [
    "Great question! I'd love to help you find the perfect plan. To give you the best recommendation, could you tell me a bit about what you'll be using our service for?\n\nIn the meantime, here's a quick overview of our most popular plans:\n\n**Starter ($9/mo):** Perfect for individuals — includes basic features and 5 projects.\n**Pro ($29/mo):** Best for teams — unlimited projects, advanced analytics, priority support.\n**Enterprise ($99/mo):** For organizations — custom integrations, dedicated account manager, SLA.\n\nWhich of these sounds closest to what you need?",
    "I'd be happy to walk you through our features! To make sure I highlight what's most relevant to you, what's your primary use case?\n\nOur platform offers:\n• **Smart Automation** — Save 10+ hours/week on repetitive tasks\n• **Real-time Analytics** — Track performance with beautiful dashboards\n• **Team Collaboration** — Work seamlessly with unlimited team members\n• **API Access** — Integrate with 500+ tools you already use\n• **Enterprise Security** — SOC 2 compliant with 99.9% uptime\n\nWould you like me to set up a quick demo or a free 14-day trial of our Pro plan?",
    "Excellent question! Let me break down our offerings for you.\n\n🌟 **Most Popular: Pro Plan ($29/mo)**\n✓ Unlimited projects & users\n✓ Advanced analytics dashboard\n✓ Priority 24/7 support\n✓ API access & integrations\n\n💼 **For Teams: Enterprise ($99/mo)**\n✓ Everything in Pro +\n✓ Custom SLA (99.99% uptime)\n✓ Dedicated success manager\n✓ On-premise deployment option\n\nWhich features matter most to you? I can tailor a recommendation!"
  ],
  angry: [
    "I completely understand your frustration, and I sincerely apologize for this experience. You deserve much better from us.\n\nHere's what I'm doing RIGHT NOW to fix this:\n\n1. I'm personally escalating this to our senior support team\n2. I'm adding a **$25 account credit** for the inconvenience\n3. I'm prioritizing your issue for immediate resolution within the next hour\n\nI'm personally making sure this is resolved for you. You won't have to explain this again — I have all the details.\n\nCan you confirm the best way to reach you for the update?",
    "I hear you, and I am truly sorry. There's no excuse for what happened, and I take full responsibility for fixing this immediately.\n\n**Here's my action plan:**\n• I'm issuing a full refund plus 20% extra as an apology credit\n• I'm connecting you with our senior specialist who will resolve this within 30 minutes\n• I'm personally monitoring this case until it's 100% resolved\n\nYou've been incredibly patient, and we're going to make this right. You should receive a call from our specialist within the next 10 minutes.\n\nIs there anything else I can do for you right now?",
    "I sincerely apologize for letting you down. Your frustration is completely valid, and I'm committed to making this right immediately.\n\n🚨 **Immediate Actions Taken:**\n✅ Senior manager notified (will call you in 15 min)\n✅ Full refund processed + $30 credit added\n✅ Your case marked as URGENT priority\n✅ I'm personally overseeing resolution\n\nYou shouldn't have experienced this, and I promise we'll exceed your expectations moving forward. What's the best phone number to reach you?"
  ],
  general: [
    "Hello! Welcome to ResolveAI support. I'm here to help you with anything you need — whether it's tracking orders, handling refunds, resetting passwords, billing questions, or technical issues.\n\nWhat can I assist you with today?",
    "Hi there! I'm ResolveAI, your 24/7 support agent. I can help you with orders, refunds, account issues, billing, technical problems, and more.\n\nWhat brings you here today? I'm ready to help!",
    "Welcome! 👋 I'm your AI support assistant, available 24/7 to help with any questions or issues.\n\nI can assist with:\n📦 Order tracking & shipping\n💰 Refunds & billing\n🔐 Account & password issues\n🛠️ Technical support\n📋 Product information\n\nHow can I help you today?",
    "Hey! Thanks for reaching out. I'm here to make your life easier. Whether you have a question about our products, need help with an order, or want to resolve any issue - I've got you covered!\n\nJust tell me what's on your mind, and I'll provide the best solution possible.",
    "Hello! 😊 I'm your friendly support assistant. I specialize in solving problems quickly and efficiently. From order tracking to technical troubleshooting, I'm here to help 24/7.\n\nWhat would you like assistance with right now?",
    "Hi! Great to connect with you. I'm equipped to handle all types of customer inquiries - from simple questions to complex issues. Just describe what you need, and I'll take care of it immediately.\n\nHow can I help?",
    "Greetings! I'm your dedicated support specialist. My goal is to provide fast, accurate solutions to whatever challenge you're facing. No question is too big or small!\n\nWhat's on your mind?"
  ]
};

function getMockResponse(intent: IntentType): string {
  const responses = MOCK_RESPONSES[intent] || MOCK_RESPONSES.general;
  return responses[Math.floor(Math.random() * responses.length)];
}

export function useClaudeAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<APISettings>({
    apiKey: '',
    model: 'claude-sonnet-4-20250514',
    maxTokens: 500,
    temperature: 0.7,
  });

  const updateSettings = useCallback((newSettings: Partial<APISettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const sendMessage = useCallback(async (
    userMessage: string,
    conversationHistory: Message[]
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    const intent = detectIntent(userMessage);
    const scenarioPrompt = SCENARIO_PROMPTS[intent] || '';
    
    // If no API key, use mock responses with faster response time
    if (!settings.apiKey || settings.apiKey.trim() === '') {
      // Simulate realistic typing delay (400-800ms for very fast UX)
      await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 400));
      setIsLoading(false);
      return getMockResponse(intent);
    }

    try {
      const messages = conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

      const systemPrompt = scenarioPrompt 
        ? `${MASTER_SYSTEM_PROMPT}\n\n=== CURRENT CONTEXT ===\n${scenarioPrompt}\n\nRemember: Be warm, empathetic, and concise. Under 120 words unless giving step-by-step instructions. Provide specific, actionable solutions.`
        : MASTER_SYSTEM_PROMPT;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': settings.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: settings.model,
          max_tokens: settings.maxTokens,
          temperature: settings.temperature,
          system: systemPrompt,
          messages: [
            ...messages,
            { role: 'user', content: userMessage },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      let aiResponse = data.content?.[0]?.text || data.completion || 'I apologize, but I was unable to process your request. Please try again.';
      
      // Ensure response quality - trim excessive whitespace and validate length
      aiResponse = aiResponse.trim();
      if (aiResponse.length < 10) {
        // Fallback if response is too short
        aiResponse = getMockResponse(intent);
      }
      
      setIsLoading(false);
      return aiResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      
      // Fallback to mock on API error
      if (errorMessage.includes('401') || errorMessage.includes('403')) {
        setError('Invalid API key. Please check your API key in Settings.');
      } else if (errorMessage.includes('429')) {
        setError('Rate limit reached. Please wait a moment and try again.');
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setError('Network error. Please check your connection.');
      } else {
        setError(errorMessage);
      }

      // Return mock response as fallback
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
      return getMockResponse(intent);
    }
  }, [settings]);

  return {
    sendMessage,
    isLoading,
    error,
    settings,
    updateSettings,
    clearError: () => setError(null),
  };
}
