// أنواع البيانات لنظام الرسائل الداخلي

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId?: string; // للرسائل الفردية
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'location' | 'contract' | 'payment';
  attachments: MessageAttachment[];
  metadata?: MessageMetadata;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  isEdited: boolean;
  editedAt?: Date;
  replyToId?: string; // للرد على رسالة معينة
  reactions: MessageReaction[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isDeleted: boolean;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'document' | 'audio' | 'video' | 'archive';
  name: string;
  url: string;
  size: number; // بالبايت
  mimeType: string;
  thumbnail?: string; // للصور والفيديوهات
  duration?: number; // للصوت والفيديو بالثواني
  uploadedAt: Date;
}

export interface MessageMetadata {
  contractId?: string;
  projectId?: string;
  serviceId?: string;
  paymentId?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  quotedText?: string; // للاقتباس
  mentionedUsers?: string[]; // معرفات المستخدمين المذكورين
}

export interface MessageReaction {
  id: string;
  userId: string;
  emoji: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'support';
  title?: string; // للمجموعات
  description?: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  lastActivity: Date;
  isArchived: boolean;
  isMuted: boolean;
  isPinned: boolean;
  settings: ConversationSettings;
  metadata?: ConversationMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationParticipant {
  userId: string;
  role: 'admin' | 'member' | 'guest';
  joinedAt: Date;
  lastReadAt?: Date;
  isActive: boolean;
  permissions: ParticipantPermissions;
}

export interface ParticipantPermissions {
  canSendMessages: boolean;
  canSendMedia: boolean;
  canAddParticipants: boolean;
  canRemoveParticipants: boolean;
  canEditConversation: boolean;
  canDeleteMessages: boolean;
}

export interface ConversationSettings {
  allowFileSharing: boolean;
  allowMediaSharing: boolean;
  allowVoiceMessages: boolean;
  allowVideoMessages: boolean;
  autoDeleteMessages: boolean;
  autoDeleteDuration?: number; // بالأيام
  requireApprovalForNewMembers: boolean;
  allowGuestAccess: boolean;
}

export interface ConversationMetadata {
  projectId?: string;
  serviceId?: string;
  contractId?: string;
  disputeId?: string;
  supportTicketId?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface MessageThread {
  id: string;
  parentMessageId: string;
  conversationId: string;
  messages: Message[];
  participantIds: string[];
  isResolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageNotification {
  id: string;
  userId: string;
  conversationId: string;
  messageId: string;
  type: 'new_message' | 'mention' | 'reply' | 'reaction' | 'file_shared';
  title: string;
  content: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface MessageSearch {
  query: string;
  conversationId?: string;
  senderId?: string;
  messageType?: Message['type'];
  dateRange?: {
    from: Date;
    to: Date;
  };
  hasAttachments?: boolean;
  attachmentType?: MessageAttachment['type'];
  sortBy?: 'relevance' | 'date_desc' | 'date_asc';
  limit?: number;
  offset?: number;
}

export interface MessageSearchResult {
  messages: (Message & {
    conversation: Pick<Conversation, 'id' | 'title' | 'type'>;
    sender: Pick<User, 'id' | 'name' | 'avatar'>;
    highlights?: string[]; // النص المميز في نتائج البحث
  })[];
  totalCount: number;
  hasMore: boolean;
  searchQuery: MessageSearch;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  startedAt: Date;
  expiresAt: Date;
}

export interface MessageDraft {
  id: string;
  conversationId: string;
  userId: string;
  content: string;
  attachments: MessageAttachment[];
  replyToId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageTemplate {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: 'greeting' | 'proposal' | 'follow_up' | 'closing' | 'custom';
  isPublic: boolean;
  usageCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationFilter {
  type?: Conversation['type'];
  isArchived?: boolean;
  isMuted?: boolean;
  isPinned?: boolean;
  hasUnreadMessages?: boolean;
  participantId?: string;
  projectId?: string;
  serviceId?: string;
  lastActivityAfter?: Date;
  lastActivityBefore?: Date;
  sortBy?: 'last_activity' | 'created_at' | 'title' | 'unread_count';
  sortOrder?: 'asc' | 'desc';
}

export interface MessageAnalytics {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  totalMessagesSent: number;
  totalMessagesReceived: number;
  averageResponseTime: number; // بالدقائق
  mostActiveConversations: {
    conversationId: string;
    messageCount: number;
    lastActivity: Date;
  }[];
  messageTypeBreakdown: {
    type: Message['type'];
    count: number;
    percentage: number;
  }[];
  attachmentStats: {
    totalFiles: number;
    totalSize: number; // بالبايت
    typeBreakdown: {
      type: MessageAttachment['type'];
      count: number;
      size: number;
    }[];
  };
  responseTimeStats: {
    average: number;
    median: number;
    fastest: number;
    slowest: number;
  };
}

export interface MessageStatus {
  messageId: string;
  userId: string;
  status: 'delivered' | 'read';
  timestamp: Date;
}

export interface ConversationSummary {
  conversationId: string;
  totalMessages: number;
  unreadCount: number;
  lastMessage?: Pick<Message, 'id' | 'content' | 'senderId' | 'createdAt' | 'type'>;
  participants: Pick<User, 'id' | 'name' | 'avatar' | 'isOnline'>[];
  hasActiveTyping: boolean;
  typingUsers: Pick<User, 'id' | 'name'>[];
}

export interface MessageEncryption {
  messageId: string;
  encryptionKey: string;
  algorithm: 'AES-256' | 'RSA-2048';
  isEncrypted: boolean;
  encryptedAt?: Date;
}

export interface MessageBackup {
  id: string;
  userId: string;
  conversationIds: string[];
  format: 'json' | 'pdf' | 'html';
  includeAttachments: boolean;
  dateRange: {
    from: Date;
    to: Date;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: Date;
  createdAt: Date;
  completedAt?: Date;
}

