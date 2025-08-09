import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  DollarSign, 
  Star, 
  MessageSquare, 
  FileText, 
  Users, 
  Award,
  TrendingUp,
  Calendar,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface Activity {
  id: string;
  activity_type: string;
  title: string;
  description?: string;
  created_at: Date;
  metadata: any;
}

interface ActivityTimelinePageProps {
  setActivePage: (page: string) => void;
}

const ActivityTimelinePage: React.FC<ActivityTimelinePageProps> = ({ setActivePage }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user, filter, dateRange]);

  const fetchActivities = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .rpc('get_user_activity_timeline', { target_user_id: user?.id });

      if (error) throw error;

      let filteredData = data || [];

      // Apply filters
      if (filter !== 'all') {
        filteredData = filteredData.filter(activity => 
          activity.activity_type.includes(filter)
        );
      }

      // Apply date range filter
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      if (dateRange !== 'all') {
        filteredData = filteredData.filter(activity => 
          new Date(activity.created_at) >= filterDate
        );
      }

      setActivities(filteredData.map(activity => ({
        ...activity,
        created_at: new Date(activity.created_at)
      })));
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    if (type.includes('service')) return <FileText className="h-5 w-5" />;
    if (type.includes('order')) return <DollarSign className="h-5 w-5" />;
    if (type.includes('review')) return <Star className="h-5 w-5" />;
    if (type.includes('message')) return <MessageSquare className="h-5 w-5" />;
    if (type.includes('referral')) return <Users className="h-5 w-5" />;
    if (type.includes('milestone')) return <Award className="h-5 w-5" />;
    return <Clock className="h-5 w-5" />;
  };

  const getActivityColor = (type: string) => {
    if (type.includes('service')) return 'text-blue-600 bg-blue-100';
    if (type.includes('order')) return 'text-green-600 bg-green-100';
    if (type.includes('review')) return 'text-yellow-600 bg-yellow-100';
    if (type.includes('message')) return 'text-purple-600 bg-purple-100';
    if (type.includes('referral')) return 'text-pink-600 bg-pink-100';
    if (type.includes('milestone')) return 'text-indigo-600 bg-indigo-100';
    return 'text-gray-600 bg-gray-100';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return date.toLocaleDateString('ar-AE');
  };

  const groupActivitiesByDate = (activities: Activity[]) => {
    const groups: { [key: string]: Activity[] } = {};
    
    activities.forEach(activity => {
      const dateKey = activity.created_at.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(activity);
    });

    return groups;
  };

  if (!user) {
    setActivePage('login');
    return null;
  }

  const groupedActivities = groupActivitiesByDate(activities);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">سجل الأنشطة</h1>
          <p className="text-gray-600">تتبع جميع أنشطتك على المنصة</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
              >
                <option value="all">جميع الأنشطة</option>
                <option value="service">الخدمات</option>
                <option value="order">الطلبات</option>
                <option value="review">التقييمات</option>
                <option value="message">الرسائل</option>
                <option value="referral">الإحالات</option>
                <option value="milestone">المراحل</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
              >
                <option value="today">اليوم</option>
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
                <option value="year">هذا العام</option>
                <option value="all">جميع الأوقات</option>
              </select>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E86AB] mx-auto"></div>
            <p className="text-gray-600 mt-4">جاري التحميل...</p>
          </div>
        ) : Object.keys(groupedActivities).length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أنشطة</h3>
            <p className="text-gray-600">لم يتم العثور على أنشطة في الفترة المحددة</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedActivities).map(([dateKey, dayActivities]) => (
              <div key={dateKey}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {new Date(dateKey).toLocaleDateString('ar-AE', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h2>
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm text-gray-500">
                    {dayActivities.length} نشاط
                  </span>
                </div>

                <div className="space-y-4">
                  {dayActivities.map(activity => (
                    <div
                      key={activity.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${getActivityColor(activity.activity_type)}`}>
                          {getActivityIcon(activity.activity_type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-900">
                              {activity.title}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(activity.created_at)}
                            </span>
                          </div>
                          
                          {activity.description && (
                            <p className="text-gray-600 text-sm mb-2">
                              {activity.description}
                            </p>
                          )}

                          {/* Activity-specific metadata */}
                          {activity.metadata && (
                            <div className="flex flex-wrap gap-2">
                              {activity.metadata.amount && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  {activity.metadata.amount} ساعة
                                </span>
                              )}
                              {activity.metadata.service_title && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {activity.metadata.service_title}
                                </span>
                              )}
                              {activity.metadata.rating && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  {activity.metadata.rating} نجوم
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimelinePage;