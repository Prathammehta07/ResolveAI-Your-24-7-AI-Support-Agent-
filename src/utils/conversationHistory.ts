import type { Message, ConversationState } from '@/types';

const STORAGE_KEY = 'resolveai_conversation_history';
const MAX_HISTORY_ITEMS = 50; // Maximum number of conversations to store

export interface HistoryItem {
  id: string;
  timestamp: Date;
  messages: Message[];
  preview: string;
  messageCount: number;
  duration?: number; // in minutes
}

// Save current conversation to history
export function saveConversationToHistory(state: ConversationState): void {
  try {
    const history = getConversationHistory();
    
    // Don't save empty conversations
    if (state.messages.length <= 1) return;
    
    const newItem: HistoryItem = {
      id: generateId(),
      timestamp: new Date(),
      messages: state.messages,
      preview: state.messages[1]?.content.substring(0, 100) || 'New conversation',
      messageCount: state.messages.length,
    };
    
    // Add to beginning of array (most recent first)
    history.unshift(newItem);
    
    // Keep only the most recent MAX_HISTORY_ITEMS
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save conversation history:', error);
  }
}

// Get all conversation history
export function getConversationHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Convert timestamp strings back to Date objects
    return parsed.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp),
      messages: item.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error('Failed to load conversation history:', error);
    return [];
  }
}

// Get a specific conversation by ID
export function getConversationById(id: string): HistoryItem | null {
  const history = getConversationHistory();
  return history.find(item => item.id === id) || null;
}

// Delete a conversation from history
export function deleteConversation(id: string): void {
  try {
    const history = getConversationHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete conversation:', error);
  }
}

// Clear all conversation history
export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Format timestamp for display
export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
}

// Format full date and time
export function formatFullDateTime(date: Date): string {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
