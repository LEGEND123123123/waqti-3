import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Archive,
  Pin,
  VolumeX,
  Star,
  Filter,
  Settings,
  Image,
  File,
  Mic,
  Reply,
  Forward,
  Trash2,
  Edit,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Plus,
  X,
  Download,
  Eye,
  Users,
  MessageSquare,
  Bookmark,
  Tag,
  Calendar,
  MapPin,
  Camera,
  VideoIcon,
  FileText,
  Headphones
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Conversation, 
  Message, 
  MessageAttachment, 
  MessageTemplate,
  ConversationFilter,
  TypingIndicator 
} from '../types';

interface MessagesPageProps {
  setActivePage: (page: string) => void;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ setActivePage }) => {
  const { user } = useAuth();
  const { isRTL } = useLanguage();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [conversationFilter, setConversationFilter] = useState<ConversationFilter>({});
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived' | 'starred'>('all');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // بيانات وهمية محسنة
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      type: 'direct',
      participants: [
        {
          userId: '101',
          role: 'member',
          joinedAt: new Date(),
          lastReadAt: new Date(),
          isActive: true,
          permissions: {
            canSendMessages: true,
            canSendMedia: true,
            canAddParticipants: false,
            canRemoveParticipants: false,
            canEditConversation: false,
            canDeleteMessages: false
          }
        },
        {
          userId: user?.id || '',
          role: 'member',
          joinedAt: new Date(),
          lastReadAt: new Date(),
          isActive: true,
          permissions: {
            canSendMessages: true,
            canSendMedia: true,
            canAddParticipants: false,
            canRemoveParticipants: false,
            canEditConversation: false,
            canDeleteMessages: true
          }
        }
      ],
      lastActivity: new Date(Date.now() - 1000 * 60 * 5),
      isArchived: false,
      isMuted: false,
      isPinned: true,
      settings: {
        allowFileSharing: true,
        allowMediaSharing: true,
        allowVoiceMessages: true,
        allowVideoMessages: true,
        autoDeleteMessages: false,
        requireApprovalForNewMembers: false,
        allowGuestAccess: false
      },
      metadata: {
        projectId: 'proj1',
        tags: ['urgent', 'web-development'],
        priority: 'high'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      updatedAt: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      id: '2',
      type: 'direct',
      participants: [
        {
          userId: '102',
          role: 'member',
          joinedAt: new Date(),
          lastReadAt: new Date(Date.now() - 1000 * 60 * 60),
          isActive: true,
          permissions: {
            canSendMessages: true,
            canSendMedia: true,
            canAddParticipants: false,
            canRemoveParticipants: false,
            canEditConversation: false,
            canDeleteMessages: false
          }
        },
        {
          userId: user?.id || '',
          role: 'member',
          joinedAt: new Date(),
          lastReadAt: new Date(),
          isActive: true,
          permissions: {
            canSendMessages: true,
            canSendMedia: true,
            canAddParticipants: false,
            canRemoveParticipants: false,
            canEditConversation: false,
            canDeleteMessages: true
          }
        }
      ],
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isArchived: false,
      isMuted: false,
      isPinned: false,
      settings: {
        allowFileSharing: true,
        allowMediaSharing: true,
        allowVoiceMessages: true,
        allowVideoMessages: true,
        autoDeleteMessages: false,
        requireApprovalForNewMembers: false,
        allowGuestAccess: false
      },
      metadata: {
        serviceId: 'serv1',
        tags: ['translation'],
        priority: 'medium'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: '3',
      type: 'support',
      title: 'دعم فني - مشكلة في الدفع',
      participants: [
        {
          userId: 'support1',
          role: 'admin',
          joinedAt: new Date(),
          lastReadAt: new Date(),
          isActive: true,
          permissions: {
            canSendMessages: true,
            canSendMedia: true,
            canAddParticipants: true,
            canRemoveParticipants: true,
            canEditConversation: true,
            canDeleteMessages: true
          }
        },
        {
          userId: user?.id || '',
          role: 'member',
          joinedAt: new Date(),
          lastReadAt: new Date(Date.now() - 1000 * 60 * 30),
          isActive: true,
          permissions: {
            canSendMessages: true,
            canSendMedia: true,
            canAddParticipants: false,
            canRemoveParticipants: false,
            canEditConversation: false,
            canDeleteMessages: false
          }
        }
      ],
      lastActivity: new Date(Date.now() - 1000 * 60 * 30),
      isArchived: false,
      isMuted: false,
      isPinned: false,
      settings: {
        allowFileSharing: true,
        allowMediaSharing: true,
        allowVoiceMessages: true,
        allowVideoMessages: false,
        autoDeleteMessages: false,
        requireApprovalForNewMembers: true,
        allowGuestAccess: false
      },
      metadata: {
        supportTicketId: 'ticket123',
        tags: ['payment', 'technical-support'],
        priority: 'urgent'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30)
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      conversationId: '1',
      senderId: '101',
      content: 'مرحباً! رأيت طلبك لخدمات تطوير المواقع.',
      type: 'text',
      attachments: [],
      status: 'read',
      isEdited: false,
      reactions: [
        { id: 'r1', userId: user?.id || '', emoji: '👍', createdAt: new Date() }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30),
      isDeleted: false
    },
    {
      id: '2',
      conversationId: '1',
      senderId: user?.id || '',
      content: 'نعم، أحتاج موقع حديث لعملي. هل يمكنك المساعدة؟',
      type: 'text',
      attachments: [],
      status: 'read',
      isEdited: false,
      reactions: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 25),
      updatedAt: new Date(Date.now() - 1000 * 60 * 25),
      isDeleted: false
    },
    {
      id: '3',
      conversationId: '1',
      senderId: '101',
      content: 'بالطبع! أتخصص في React والتقنيات الحديثة.',
      type: 'text',
      attachments: [],
      status: 'read',
      isEdited: false,
      reactions: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 20),
      updatedAt: new Date(Date.now() - 1000 * 60 * 20),
      isDeleted: false
    },
    {
      id: '4',
      conversationId: '1',
      senderId: '101',
      content: 'إليك بعض الأمثلة على أعمالي السابقة',
      type: 'image',
      attachments: [
        {
          id: 'att1',
          type: 'image',
          name: 'portfolio-example.jpg',
          url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
          size: 245760,
          mimeType: 'image/jpeg',
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200',
          uploadedAt: new Date()
        }
      ],
      status: 'delivered',
      isEdited: false,
      reactions: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
      updatedAt: new Date(Date.now() - 1000 * 60 * 5),
      isDeleted: false
    }
  ]);

  const [messageTemplates] = useState<MessageTemplate[]>([
    {
      id: 'temp1',
      userId: user?.id || '',
      title: 'ترحيب بالعميل الجديد',
      content: 'مرحباً! شكراً لاهتمامك بخدماتي. سأكون سعيداً للعمل معك على مشروعك.',
      category: 'greeting',
      isPublic: false,
      usageCount: 15,
      tags: ['ترحيب', 'عملاء'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'temp2',
      userId: user?.id || '',
      title: 'طلب تفاصيل إضافية',
      content: 'هل يمكنك تزويدي بمزيد من التفاصيل حول المشروع؟ هذا سيساعدني في تقديم عرض أفضل.',
      category: 'follow_up',
      isPublic: false,
      usageCount: 8,
      tags: ['تفاصيل', 'مشروع'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'temp3',
      userId: user?.id || '',
      title: 'تأكيد إنجاز المهمة',
      content: 'تم إنجاز المهمة بنجاح! يرجى مراجعة العمل وإعلامي برأيك.',
      category: 'closing',
      isPublic: false,
      usageCount: 12,
      tags: ['إنجاز', 'مراجعة'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [typingUsers] = useState<TypingIndicator[]>([]);

  // Mock user data
  const mockUsers = {
    '101': { id: '101', name: 'أحمد حسن', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', isOnline: true },
    '102': { id: '102', name: 'ليلى محمد', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', isOnline: false },
    'support1': { id: 'support1', name: 'فريق الدعم', avatar: 'https://randomuser.me/api/portraits/men/50.jpg', isOnline: true }
  };

  const getUser = (userId: string) => mockUsers[userId as keyof typeof mockUsers] || { id: userId, name: 'مستخدم', avatar: '', isOnline: false };

  const filteredConversations = conversations.filter(conv => {
    // تطبيق فلاتر التبويب
    if (activeTab === 'unread' && !hasUnreadMessages(conv.id)) return false;
    if (activeTab === 'archived' && !conv.isArchived) return false;
    if (activeTab === 'starred' && !conv.isPinned) return false;
    if (activeTab === 'all' && conv.isArchived) return false;

    // تطبيق البحث
    if (searchTerm) {
      const otherParticipants = conv.participants.filter(p => p.userId !== user?.id);
      const hasMatchingParticipant = otherParticipants.some(p => {
        const userData = getUser(p.userId);
        return userData.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      
      const hasMatchingTitle = conv.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const hasMatchingLastMessage = conv.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!hasMatchingParticipant && !hasMatchingTitle && !hasMatchingLastMessage) return false;
    }

    return true;
  });

  const hasUnreadMessages = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return false;
    
    const userParticipant = conversation.participants.find(p => p.userId === user?.id);
    if (!userParticipant?.lastReadAt) return true;
    
    return conversation.lastActivity > userParticipant.lastReadAt;
  };

  const getUnreadCount = (conversationId: string) => {
    const conversationMessages = messages.filter(m => m.conversationId === conversationId);
    const conversation = conversations.find(c => c.id === conversationId);
    const userParticipant = conversation?.participants.find(p => p.userId === user?.id);
    
    if (!userParticipant?.lastReadAt) return conversationMessages.length;
    
    return conversationMessages.filter(m => 
      m.senderId !== user?.id && m.createdAt > userParticipant.lastReadAt!
    ).length;
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const conversationMessages = messages.filter(m => m.conversationId === selectedConversation);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation,
      senderId: user?.id || '',
      content: messageText.trim(),
      type: 'text',
      attachments: [],
      status: 'sending',
      isEdited: false,
      reactions: [],
      replyToId: replyToMessage?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    setReplyToMessage(null);

    // محاكاة إرسال الرسالة
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === newMessage.id ? { ...m, status: 'delivered' } : m
      ));
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image' | 'audio' | 'video') => {
    const file = event.target.files?.[0];
    if (!file || !selectedConversation) return;

    const attachment: MessageAttachment = {
      id: Date.now().toString(),
      type: type === 'file' ? 'document' : type,
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      mimeType: file.type,
      uploadedAt: new Date()
    };

    if (type === 'image' || type === 'video') {
      attachment.thumbnail = attachment.url;
    }

    if (type === 'audio' || type === 'video') {
      // محاكاة مدة الملف
      attachment.duration = 120; // ثانية
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation,
      senderId: user?.id || '',
      content: type === 'image' ? 'صورة' : 
               type === 'audio' ? 'رسالة صوتية' :
               type === 'video' ? 'فيديو' : `ملف: ${file.name}`,
      type: type,
      attachments: [attachment],
      status: 'sending',
      isEdited: false,
      reactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleUseTemplate = (template: MessageTemplate) => {
    setMessageText(template.content);
    setShowTemplates(false);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        const existingReaction = message.reactions.find(r => r.userId === user?.id && r.emoji === emoji);
        if (existingReaction) {
          // إزالة التفاعل
          return {
            ...message,
            reactions: message.reactions.filter(r => r.id !== existingReaction.id)
          };
        } else {
          // إضافة تفاعل جديد
          return {
            ...message,
            reactions: [...message.reactions, {
              id: Date.now().toString(),
              userId: user?.id || '',
              emoji,
              createdAt: new Date()
            }]
          };
        }
      }
      return message;
    }));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ar-AE', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `${minutes} د`;
    if (hours < 24) return `${hours} س`;
    if (days < 7) return `${days} ي`;
    return new Intl.DateTimeFormat('ar-AE', { month: 'short', day: 'numeric' }).format(date);
  };

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const renderAttachment = (attachment: MessageAttachment) => {
    switch (attachment.type) {
      case 'image':
        return (
          <div className="mt-2 max-w-xs">
            <img 
              src={attachment.url} 
              alt={attachment.name}
              className="rounded-lg max-h-48 object-cover cursor-pointer hover:opacity-90"
              onClick={() => window.open(attachment.url, '_blank')}
            />
          </div>
        );
      case 'video':
        return (
          <div className="mt-2 max-w-xs">
            <video 
              src={attachment.url}
              controls
              className="rounded-lg max-h-48 w-full"
            />
          </div>
        );
      case 'audio':
        return (
          <div className="mt-2 flex items-center gap-3 p-3 bg-white bg-opacity-20 rounded-lg">
            <Headphones className="h-5 w-5" />
            <div className="flex-1">
              <p className="text-sm font-medium">{attachment.name}</p>
              {attachment.duration && (
                <p className="text-xs opacity-75">
                  {Math.floor(attachment.duration / 60)}:{(attachment.duration % 60).toString().padStart(2, '0')}
                </p>
              )}
            </div>
            <audio src={attachment.url} controls className="h-8" />
          </div>
        );
      default:
        return (
          <div className="mt-2 flex items-center gap-3 p-3 bg-white bg-opacity-20 rounded-lg">
            <FileText className="h-5 w-5" />
            <div className="flex-1">
              <p className="text-sm font-medium">{attachment.name}</p>
              <p className="text-xs opacity-75">
                {(attachment.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
            <button 
              onClick={() => window.open(attachment.url, '_blank')}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        );
    }
  };

  if (!user) {
    setActivePage('login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden h-[700px] flex">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">الرسائل</h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <Filter className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="البحث في المحادثات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                />
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                {[
                  { id: 'all', name: 'الكل', count: conversations.filter(c => !c.isArchived).length },
                  { id: 'unread', name: 'غير مقروءة', count: conversations.filter(c => hasUnreadMessages(c.id)).length },
                  { id: 'starred', name: 'مثبتة', count: conversations.filter(c => c.isPinned).length },
                  { id: 'archived', name: 'أرشيف', count: conversations.filter(c => c.isArchived).length }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-[#2E86AB] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.name}
                    {tab.count > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-gray-200 text-xs rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map(conversation => {
                const otherParticipants = conversation.participants.filter(p => p.userId !== user.id);
                const otherUser = otherParticipants[0] ? getUser(otherParticipants[0].userId) : null;
                const unreadCount = getUnreadCount(conversation.id);
                
                return (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-[#2E86AB]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        {conversation.type === 'group' ? (
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-gray-500" />
                          </div>
                        ) : conversation.type === 'support' ? (
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-blue-600" />
                          </div>
                        ) : (
                          <img
                            src={otherUser?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                            alt={otherUser?.name || conversation.title}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        {otherUser?.isOnline && conversation.type === 'direct' && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900 truncate">
                              {conversation.title || otherUser?.name || 'محادثة'}
                            </h3>
                            {conversation.isPinned && <Pin className="h-3 w-3 text-gray-400" />}
                            {conversation.isMuted && <VolumeX className="h-3 w-3 text-gray-400" />}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">
                              {formatLastMessageTime(conversation.lastActivity)}
                            </span>
                            {unreadCount > 0 && (
                              <div className="bg-[#F18F01] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount > 99 ? '99+' : unreadCount}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-600 truncate flex-1">
                            {conversation.lastMessage?.content || 'لا توجد رسائل'}
                          </p>
                          {conversation.metadata?.priority === 'urgent' && (
                            <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                        
                        {conversation.metadata?.tags && conversation.metadata.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {conversation.metadata.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-xs text-gray-600 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {selectedConv?.type === 'group' ? (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-500" />
                        </div>
                      ) : selectedConv?.type === 'support' ? (
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                      ) : (
                        <img
                          src={getUser(selectedConv?.participants.find(p => p.userId !== user?.id)?.userId || '').avatar}
                          alt="User"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      {selectedConv?.type === 'direct' && getUser(selectedConv?.participants.find(p => p.userId !== user?.id)?.userId || '').isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {selectedConv?.title || getUser(selectedConv?.participants.find(p => p.userId !== user?.id)?.userId || '').name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedConv?.type === 'support' ? 'دعم فني' :
                         selectedConv?.type === 'group' ? `${selectedConv.participants.length} أعضاء` :
                         getUser(selectedConv?.participants.find(p => p.userId !== user?.id)?.userId || '').isOnline ? 'متصل' : 'غير متصل'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Search className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversationMessages.map(message => {
                    const isOwn = message.senderId === user.id;
                    const sender = getUser(message.senderId);
                    const replyToMsg = message.replyToId ? conversationMessages.find(m => m.id === message.replyToId) : null;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                          {!isOwn && (
                            <div className="flex items-center gap-2 mb-1">
                              <img
                                src={sender.avatar}
                                alt={sender.name}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-xs text-gray-600">{sender.name}</span>
                            </div>
                          )}
                          
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              isOwn
                                ? 'bg-[#2E86AB] text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {replyToMsg && (
                              <div className={`p-2 mb-2 rounded border-l-2 ${
                                isOwn ? 'bg-white bg-opacity-20 border-white' : 'bg-gray-200 border-gray-400'
                              }`}>
                                <p className="text-xs opacity-75">
                                  رد على: {getUser(replyToMsg.senderId).name}
                                </p>
                                <p className="text-sm truncate">{replyToMsg.content}</p>
                              </div>
                            )}
                            
                            <p className="text-sm">{message.content}</p>
                            
                            {message.attachments.map(attachment => (
                              <div key={attachment.id}>
                                {renderAttachment(attachment)}
                              </div>
                            ))}
                            
                            {message.reactions.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {message.reactions.map(reaction => (
                                  <span
                                    key={reaction.id}
                                    className="px-1.5 py-0.5 bg-white bg-opacity-20 rounded-full text-xs cursor-pointer"
                                    onClick={() => handleReaction(message.id, reaction.emoji)}
                                  >
                                    {reaction.emoji}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className={`flex items-center justify-between mt-1 ${
                              isOwn ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              <span className="text-xs">{formatTime(message.createdAt)}</span>
                              {isOwn && (
                                <div className="flex items-center gap-1">
                                  {message.isEdited && <span className="text-xs">معدل</span>}
                                  {getMessageStatusIcon(message.status)}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Message Actions */}
                          <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleReaction(message.id, '👍')}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                              <Smile className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => setReplyToMessage(message)}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                              <Reply className="h-3 w-3" />
                            </button>
                            {isOwn && (
                              <>
                                <button
                                  onClick={() => setEditingMessage(message.id)}
                                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Typing Indicator */}
                {typingUsers.length > 0 && (
                  <div className="px-4 py-2">
                    <div className="flex items-center text-gray-500 text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="ml-2">
                        {typingUsers.map(t => getUser(t.userId).name).join(', ')} يكتب...
                      </span>
                    </div>
                  </div>
                )}

                {/* Reply Preview */}
                {replyToMessage && (
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Reply className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          رد على {getUser(replyToMessage.senderId).name}
                        </span>
                      </div>
                      <button
                        onClick={() => setReplyToMessage(null)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 truncate mt-1">{replyToMessage.content}</p>
                  </div>
                )}

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-end gap-2">
                    {/* File Upload Options */}
                    <div className="flex flex-col gap-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleFileUpload(e, 'file')}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                      />
                      <input
                        type="file"
                        ref={audioInputRef}
                        onChange={(e) => handleFileUpload(e, 'audio')}
                        className="hidden"
                        accept="audio/*"
                      />
                      <input
                        type="file"
                        ref={videoInputRef}
                        onChange={(e) => handleFileUpload(e, 'video')}
                        className="hidden"
                        accept="video/*"
                      />
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          title="إرفاق ملف"
                        >
                          <Paperclip className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => handleFileUpload(e as any, 'image');
                            input.click();
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          title="إرفاق صورة"
                        >
                          <Image className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => audioInputRef.current?.click()}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          title="إرفاق صوت"
                        >
                          <Mic className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => videoInputRef.current?.click()}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          title="إرفاق فيديو"
                        >
                          <VideoIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="flex-1 relative">
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="اكتب رسالة..."
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent resize-none"
                        rows={1}
                        style={{ minHeight: '40px', maxHeight: '120px' }}
                      />
                      <button
                        onClick={() => setShowTemplates(!showTemplates)}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                        title="القوالب"
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="p-2 bg-[#2E86AB] text-white rounded-lg hover:bg-[#1e5f7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Templates Dropdown */}
                  {showTemplates && (
                    <div className="absolute bottom-16 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                      <div className="p-3 border-b border-gray-200">
                        <h4 className="font-medium text-gray-900">القوالب المحفوظة</h4>
                      </div>
                      {messageTemplates.map(template => (
                        <button
                          key={template.id}
                          onClick={() => handleUseTemplate(template)}
                          className="w-full p-3 text-right hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <p className="font-medium text-gray-900 text-sm">{template.title}</p>
                          <p className="text-gray-600 text-xs mt-1 truncate">{template.content}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">اختر محادثة</h3>
                  <p>اختر محادثة من القائمة لبدء المراسلة</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;

