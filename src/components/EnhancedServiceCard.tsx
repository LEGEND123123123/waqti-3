import React, { useState } from 'react';
import { Clock, Star, MapPin, Heart, Share2, Eye, TrendingUp } from 'lucide-react';
import { Service } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';

interface EnhancedServiceCardProps {
  service: Service;
  onClick?: () => void;
  isPromoted?: boolean;
  promotionLevel?: number;
  showStats?: boolean;
}

const EnhancedServiceCard: React.FC<EnhancedServiceCardProps> = ({ 
  service, 
  onClick, 
  isPromoted = false,
  promotionLevel = 0,
  showStats = false
}) => {
  const { isRTL } = useLanguage();
  const [isFavorited, setIsFavorited] = useState(false);
  const [viewCount, setViewCount] = useState(service.metadata?.view_count || 0);
  
  // Icons mapping for service categories
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'design':
        return <i className="fas fa-palette"></i>;
      case 'teaching':
        return <i className="fas fa-chalkboard-teacher"></i>;
      case 'programming':
        return <i className="fas fa-code"></i>;
      case 'translation':
        return <i className="fas fa-language"></i>;
      case 'writing':
        return <i className="fas fa-pen-fancy"></i>;
      case 'music':
        return <i className="fas fa-music"></i>;
      case 'cooking':
        return <i className="fas fa-utensils"></i>;
      default:
        return <i className="fas fa-briefcase"></i>;
    }
  };

  const getPromotionBadge = () => {
    if (!isPromoted) return null;
    
    const badges = {
      1: { text: 'مُروج', color: 'bg-blue-500' },
      2: { text: 'مميز', color: 'bg-purple-500' },
      3: { text: 'الأفضل', color: 'bg-gold-500' }
    };
    
    const badge = badges[promotionLevel as keyof typeof badges] || badges[1];
    
    return (
      <div className={`absolute top-2 right-2 ${badge.color} text-white px-2 py-1 rounded-full text-xs font-bold`}>
        {badge.text}
      </div>
    );
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user?.id)
          .eq('service_id', service.id);
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user?.id,
            service_id: service.id
          });
      }
      
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareData = {
      title: service.title,
      text: service.description,
      url: `${window.location.origin}/services/${service.id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('تم نسخ الرابط!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCardClick = async () => {
    // Track view
    try {
      await supabase.rpc('increment_service_views', { service_id: service.id });
      setViewCount(prev => prev + 1);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
    
    onClick?.();
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border overflow-hidden cursor-pointer group relative ${
        isPromoted ? 'border-[#F18F01] border-2' : 'border-gray-100'
      }`}
      onClick={handleCardClick}
    >
      {getPromotionBadge()}
      
      <div className="h-40 md:h-48 overflow-hidden relative">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Overlay Actions */}
        <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isFavorited 
                ? 'bg-red-500 text-white' 
                : 'bg-white bg-opacity-80 text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white bg-opacity-80 text-gray-600 hover:text-blue-500 backdrop-blur-sm transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-white bg-opacity-90 text-[#2E86AB] text-xs font-medium rounded-full">
            {service.category}
          </span>
        </div>

        {/* Stats Overlay */}
        {showStats && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
            <Eye className="h-3 w-3" />
            {viewCount}
          </div>
        )}
      </div>
      
      <div className="p-4 md:p-6">
        <div className={`flex items-start mb-3 md:mb-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#2E86AB] bg-opacity-10 flex items-center justify-center text-[#2E86AB] text-lg md:text-xl flex-shrink-0">
            {getCategoryIcon(service.category)}
          </div>
          <div className={`${isRTL ? 'mr-3' : 'ml-3'} min-w-0 flex-1`}>
            <h3 className="text-base md:text-lg font-semibold text-[#2E86AB] line-clamp-2 leading-tight">
              {service.title}
            </h3>
          </div>
        </div>
        
        <p className="text-gray-600 mb-3 md:mb-4 line-clamp-2 text-sm md:text-base leading-relaxed">
          {service.description}
        </p>
        
        <div className={`flex items-center justify-between mt-4 md:mt-5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <img 
              src={service.provider.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} 
              alt={service.provider.name} 
              className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
              loading="lazy"
            />
            <span className={`text-xs md:text-sm text-gray-700 font-medium ${isRTL ? 'ml-2' : 'ml-2'} truncate`}>
              {service.provider.name}
            </span>
          </div>
          
          <div className="px-2 md:px-3 py-1 bg-gray-100 rounded-full text-xs md:text-sm font-semibold text-[#2E86AB] flex items-center flex-shrink-0">
            <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            {service.hourlyRate} {service.hourlyRate === 1 ? 'Hour' : 'Hours'}
          </div>
        </div>
        
        <div className={`flex items-center justify-between mt-3 md:mt-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-3 h-3 md:w-4 md:h-4 ${
                    index < service.rating
                      ? 'text-[#F18F01] fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className={`text-xs md:text-sm text-gray-500 ${isRTL ? 'ml-2' : 'ml-2'}`}>
              ({service.reviews})
            </span>
          </div>
          
          <div className={`flex items-center text-xs md:text-sm text-gray-500 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            <span className="truncate">{service.location}</span>
          </div>
        </div>

        {/* Trending Indicator */}
        {isPromoted && promotionLevel >= 2 && (
          <div className="mt-3 flex items-center gap-1 text-xs text-[#F18F01]">
            <TrendingUp className="h-3 w-3" />
            <span>رائج الآن</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedServiceCard;