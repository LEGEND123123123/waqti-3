// أنواع البيانات لنظام الدعم والأسئلة الشائعة

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: SupportCategory;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';
  assignedTo?: string; // معرف موظف الدعم
  tags: string[];
  attachments: SupportAttachment[];
  messages: SupportMessage[];
  resolution?: SupportResolution;
  satisfaction?: SupportSatisfaction;
  metadata: {
    source: 'web' | 'mobile' | 'email' | 'chat' | 'phone';
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
    sessionId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  firstResponseAt?: Date;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'user' | 'agent' | 'system';
  content: string;
  type: 'text' | 'image' | 'file' | 'system_note' | 'status_change';
  attachments: SupportAttachment[];
  isInternal: boolean; // ملاحظة داخلية للموظفين فقط
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  thumbnail?: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface SupportResolution {
  resolvedBy: string;
  solution: string;
  resolutionType: 'solved' | 'workaround' | 'duplicate' | 'not_reproducible' | 'wont_fix';
  timeToResolve: number; // بالدقائق
  followUpRequired: boolean;
  followUpDate?: Date;
  resolvedAt: Date;
}

export interface SupportSatisfaction {
  rating: 1 | 2 | 3 | 4 | 5;
  feedback?: string;
  wouldRecommend: boolean;
  improvementSuggestions?: string;
  submittedAt: Date;
}

export interface SupportCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  parentId?: string;
  children?: SupportCategory[];
  isActive: boolean;
  sortOrder: number;
  autoAssignTo?: string; // معرف موظف الدعم المختص
  expectedResponseTime: number; // بالساعات
  escalationTime: number; // بالساعات
  templates: SupportTemplate[];
}

export interface SupportTemplate {
  id: string;
  categoryId: string;
  name: string;
  subject: string;
  content: string;
  variables: SupportTemplateVariable[];
  isActive: boolean;
  usageCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportTemplateVariable {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  required: boolean;
  defaultValue?: any;
  options?: string[];
}

export interface SupportAgent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'agent' | 'supervisor' | 'admin';
  specializations: string[]; // فئات التخصص
  languages: string[];
  isOnline: boolean;
  isAvailable: boolean;
  currentTickets: number;
  maxTickets: number;
  rating: number;
  totalTicketsResolved: number;
  avgResponseTime: number; // بالدقائق
  avgResolutionTime: number; // بالساعات
  satisfactionScore: number;
  workingHours: {
    timezone: string;
    schedule: {
      [key: string]: { start: string; end: string; }; // 'monday': { start: '09:00', end: '17:00' }
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  tags: string[];
  isPublished: boolean;
  isPinned: boolean;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  relatedFAQs: string[]; // معرفات الأسئلة ذات الصلة
  attachments: SupportAttachment[];
  metadata: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedReadTime: number; // بالدقائق
    lastReviewed: Date;
    reviewedBy: string;
  };
  searchKeywords: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface FAQCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  parentId?: string;
  children?: FAQCategory[];
  isActive: boolean;
  sortOrder: number;
  faqCount: number;
}

export interface FAQFeedback {
  id: string;
  faqId: string;
  userId?: string;
  isHelpful: boolean;
  feedback?: string;
  suggestions?: string;
  createdAt: Date;
}

export interface SupportKnowledgeBase {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'article' | 'tutorial' | 'guide' | 'troubleshooting' | 'video' | 'download';
  status: 'draft' | 'review' | 'published' | 'archived';
  isPublic: boolean;
  viewCount: number;
  rating: number;
  ratingCount: number;
  estimatedReadTime: number;
  attachments: SupportAttachment[];
  relatedArticles: string[];
  prerequisites: string[];
  lastReviewed: Date;
  reviewedBy: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface SupportAnalytics {
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  tickets: {
    total: number;
    opened: number;
    resolved: number;
    closed: number;
    avgResponseTime: number;
    avgResolutionTime: number;
    satisfactionScore: number;
    byCategory: {
      category: string;
      count: number;
      avgResolutionTime: number;
    }[];
    byPriority: {
      priority: string;
      count: number;
      percentage: number;
    }[];
    byStatus: {
      status: string;
      count: number;
      percentage: number;
    }[];
  };
  agents: {
    totalAgents: number;
    activeAgents: number;
    avgTicketsPerAgent: number;
    topPerformers: {
      agentId: string;
      name: string;
      ticketsResolved: number;
      satisfactionScore: number;
      avgResponseTime: number;
    }[];
  };
  faq: {
    totalViews: number;
    topFAQs: {
      faqId: string;
      question: string;
      views: number;
      helpfulRatio: number;
    }[];
    searchQueries: {
      query: string;
      count: number;
      hasResults: boolean;
    }[];
  };
  knowledgeBase: {
    totalArticles: number;
    totalViews: number;
    avgRating: number;
    topArticles: {
      articleId: string;
      title: string;
      views: number;
      rating: number;
    }[];
  };
}

export interface SupportNotification {
  id: string;
  userId: string;
  ticketId?: string;
  type: 'ticket_created' | 'ticket_updated' | 'ticket_resolved' | 'agent_assigned' | 'response_received';
  title: string;
  message: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface SupportSettings {
  businessHours: {
    timezone: string;
    schedule: {
      [key: string]: { start: string; end: string; isOpen: boolean; };
    };
    holidays: {
      date: Date;
      name: string;
      isRecurring: boolean;
    }[];
  };
  autoResponse: {
    enabled: boolean;
    message: string;
    delay: number; // بالدقائق
  };
  escalation: {
    enabled: boolean;
    rules: {
      priority: string;
      timeLimit: number; // بالساعات
      escalateTo: string; // معرف المشرف
    }[];
  };
  satisfaction: {
    enabled: boolean;
    sendAfterResolution: boolean;
    reminderAfterDays: number;
  };
  notifications: {
    email: {
      newTicket: boolean;
      ticketUpdate: boolean;
      ticketResolved: boolean;
    };
    sms: {
      urgentTickets: boolean;
      escalations: boolean;
    };
    push: {
      newMessages: boolean;
      statusChanges: boolean;
    };
  };
}

export interface SupportChatSession {
  id: string;
  userId: string;
  agentId?: string;
  status: 'waiting' | 'active' | 'ended';
  messages: SupportMessage[];
  startedAt: Date;
  endedAt?: Date;
  waitTime: number; // بالثواني
  duration: number; // بالثواني
  satisfaction?: SupportSatisfaction;
  transcript?: string;
}

export interface SupportSearch {
  query: string;
  category?: string;
  type?: 'faq' | 'knowledge_base' | 'tickets' | 'all';
  filters?: {
    difficulty?: string;
    tags?: string[];
    dateRange?: {
      from: Date;
      to: Date;
    };
  };
  sortBy?: 'relevance' | 'date' | 'popularity' | 'rating';
  limit?: number;
  offset?: number;
}

export interface SupportSearchResult {
  type: 'faq' | 'knowledge_base' | 'ticket';
  id: string;
  title: string;
  content: string;
  category: string;
  relevanceScore: number;
  highlights: string[];
  url: string;
  metadata: Record<string, any>;
}

export interface SupportWidget {
  id: string;
  name: string;
  type: 'chat' | 'contact_form' | 'faq_search' | 'knowledge_base';
  position: 'bottom_right' | 'bottom_left' | 'top_right' | 'top_left' | 'center';
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    borderRadius: number;
    showAvatar: boolean;
    showAgentName: boolean;
  };
  behavior: {
    autoOpen: boolean;
    autoOpenDelay: number;
    showOnPages: string[];
    hideOnPages: string[];
    triggerOnScroll: boolean;
    triggerOnExit: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

