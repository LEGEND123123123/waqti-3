import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Tag,
  User,
  Briefcase,
  Settings,
  Save,
  History,
  TrendingUp,
  SlidersHorizontal,
  Grid,
  List,
  ArrowUpDown,
  Download,
  Bookmark,
  Bell
} from 'lucide-react';
import {
  SearchQuery,
  SearchFilter,
  SearchResult,
  SearchSuggestion,
  SavedSearch,
  SearchHistory as SearchHistoryType
} from '../types';

interface AdvancedSearchProps {
  category: 'services' | 'projects' | 'freelancers' | 'messages' | 'general';
  onSearch: (query: SearchQuery) => void;
  onResultsChange?: (results: SearchResult) => void;
  placeholder?: string;
  filters?: SearchFilter[];
  initialQuery?: SearchQuery;
  showSavedSearches?: boolean;
  showHistory?: boolean;
  showSuggestions?: boolean;
  className?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  category,
  onSearch,
  onResultsChange,
  placeholder = 'البحث...',
  filters = [],
  initialQuery,
  showSavedSearches = true,
  showHistory = true,
  showSuggestions = true,
  className = ''
}) => {
  const [searchText, setSearchText] = useState(initialQuery?.text || '');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(initialQuery?.filters || {});
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestionsState] = useState(false);
  const [sortBy, setSortBy] = useState(initialQuery?.sortBy || 'relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialQuery?.sortOrder || 'desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // بيانات وهمية للاقتراحات والتاريخ
  const [suggestions] = useState<SearchSuggestion[]>([
    { text: 'تطوير مواقع', type: 'query', count: 1250, icon: '💻' },
    { text: 'تصميم جرافيك', type: 'query', count: 890, icon: '🎨' },
    { text: 'ترجمة', type: 'query', count: 650, icon: '🌐' },
    { text: 'كتابة محتوى', type: 'query', count: 420, icon: '✍️' },
    { text: 'تسويق رقمي', type: 'query', count: 380, icon: '📱' }
  ]);

  const [searchHistory] = useState<SearchHistoryType[]>([
    {
      id: '1',
      userId: 'user1',
      query: 'تطوير تطبيقات موبايل',
      filters: { category: 'programming', budget: '1000-5000' },
      resultCount: 45,
      searchedAt: new Date(Date.now() - 1000 * 60 * 30),
      category: 'services'
    },
    {
      id: '2',
      userId: 'user1',
      query: 'مصمم UI/UX',
      filters: { rating: '4+', location: 'الإمارات' },
      resultCount: 23,
      searchedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      category: 'freelancers'
    }
  ]);

  const [savedSearches] = useState<SavedSearch[]>([
    {
      id: '1',
      userId: 'user1',
      name: 'مشاريع تطوير ويب',
      description: 'مشاريع تطوير المواقع بميزانية متوسطة',
      query: {
        text: 'تطوير موقع',
        filters: { category: 'web-development', budget: '2000-10000' },
        sortBy: 'date',
        sortOrder: 'desc'
      },
      category: 'projects',
      isPublic: false,
      notifications: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  // فلاتر افتراضية حسب الفئة
  const getDefaultFilters = (): SearchFilter[] => {
    const commonFilters: SearchFilter[] = [
      {
        id: 'category',
        name: 'الفئة',
        type: 'select',
        options: [
          { value: 'programming', label: 'البرمجة والتطوير', count: 1250 },
          { value: 'design', label: 'التصميم والإبداع', count: 890 },
          { value: 'writing', label: 'الكتابة والترجمة', count: 650 },
          { value: 'marketing', label: 'التسويق والمبيعات', count: 420 },
          { value: 'business', label: 'الأعمال والإدارة', count: 380 }
        ]
      },
      {
        id: 'rating',
        name: 'التقييم',
        type: 'select',
        options: [
          { value: '5', label: '⭐⭐⭐⭐⭐ (5 نجوم)', count: 150 },
          { value: '4+', label: '⭐⭐⭐⭐ (4+ نجوم)', count: 450 },
          { value: '3+', label: '⭐⭐⭐ (3+ نجوم)', count: 750 },
          { value: '2+', label: '⭐⭐ (2+ نجوم)', count: 950 }
        ]
      },
      {
        id: 'location',
        name: 'الموقع',
        type: 'select',
        options: [
          { value: 'uae', label: 'الإمارات العربية المتحدة', count: 320 },
          { value: 'saudi', label: 'المملكة العربية السعودية', count: 280 },
          { value: 'egypt', label: 'مصر', count: 450 },
          { value: 'jordan', label: 'الأردن', count: 180 },
          { value: 'remote', label: 'عمل عن بُعد', count: 890 }
        ]
      }
    ];

    switch (category) {
      case 'services':
        return [
          ...commonFilters,
          {
            id: 'price',
            name: 'السعر',
            type: 'range',
            min: 0,
            max: 10000,
            step: 100
          },
          {
            id: 'delivery_time',
            name: 'مدة التسليم',
            type: 'select',
            options: [
              { value: '1', label: 'يوم واحد', count: 45 },
              { value: '3', label: '3 أيام', count: 120 },
              { value: '7', label: 'أسبوع', count: 280 },
              { value: '14', label: 'أسبوعين', count: 350 },
              { value: '30', label: 'شهر', count: 180 }
            ]
          }
        ];
      
      case 'projects':
        return [
          ...commonFilters,
          {
            id: 'budget',
            name: 'الميزانية',
            type: 'select',
            options: [
              { value: '0-500', label: 'أقل من 500 درهم', count: 120 },
              { value: '500-2000', label: '500 - 2000 درهم', count: 280 },
              { value: '2000-5000', label: '2000 - 5000 درهم', count: 350 },
              { value: '5000-10000', label: '5000 - 10000 درهم', count: 180 },
              { value: '10000+', label: 'أكثر من 10000 درهم', count: 90 }
            ]
          },
          {
            id: 'payment_type',
            name: 'نوع الدفع',
            type: 'select',
            options: [
              { value: 'money', label: 'مال', count: 850 },
              { value: 'time', label: 'وقت', count: 170 }
            ]
          },
          {
            id: 'status',
            name: 'حالة المشروع',
            type: 'select',
            options: [
              { value: 'open', label: 'مفتوح للعروض', count: 320 },
              { value: 'in_progress', label: 'قيد التنفيذ', count: 180 },
              { value: 'completed', label: 'مكتمل', count: 520 }
            ]
          }
        ];
      
      case 'freelancers':
        return [
          ...commonFilters,
          {
            id: 'experience',
            name: 'سنوات الخبرة',
            type: 'select',
            options: [
              { value: '0-1', label: 'أقل من سنة', count: 120 },
              { value: '1-3', label: '1-3 سنوات', count: 280 },
              { value: '3-5', label: '3-5 سنوات', count: 350 },
              { value: '5-10', label: '5-10 سنوات', count: 180 },
              { value: '10+', label: 'أكثر من 10 سنوات', count: 90 }
            ]
          },
          {
            id: 'hourly_rate',
            name: 'السعر بالساعة',
            type: 'range',
            min: 10,
            max: 500,
            step: 10
          },
          {
            id: 'availability',
            name: 'التوفر',
            type: 'select',
            options: [
              { value: 'available', label: 'متاح الآن', count: 450 },
              { value: 'busy', label: 'مشغول', count: 280 },
              { value: 'part_time', label: 'دوام جزئي', count: 320 }
            ]
          }
        ];
      
      default:
        return commonFilters;
    }
  };

  const allFilters = [...getDefaultFilters(), ...filters];

  const sortOptions = [
    { value: 'relevance', label: 'الأكثر صلة', icon: '🎯' },
    { value: 'date', label: 'الأحدث', icon: '📅' },
    { value: 'rating', label: 'الأعلى تقييماً', icon: '⭐' },
    { value: 'price_low', label: 'السعر: من الأقل للأعلى', icon: '💰' },
    { value: 'price_high', label: 'السعر: من الأعلى للأقل', icon: '💎' },
    { value: 'popularity', label: 'الأكثر شعبية', icon: '🔥' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestionsState(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    const query: SearchQuery = {
      text: searchText,
      filters: activeFilters,
      sortBy,
      sortOrder,
      page: 1,
      limit: 20
    };

    onSearch(query);
    setShowSuggestionsState(false);
    
    // Log search activity
    if (searchText.trim()) {
      supabase.from('activity_log').insert({
        user_id: user?.id,
        activity_type: 'search',
        title: 'بحث في الخدمات',
        description: `بحث عن: ${searchText}`,
        metadata: { query, category }
      });
    }
  };

  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...activeFilters };
    if (value === null || value === undefined || value === '') {
      delete newFilters[filterId];
    } else {
      newFilters[filterId] = value;
    }
    setActiveFilters(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchText('');
  };

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).length + (searchText ? 1 : 0);
  };

  const handleSaveSearch = () => {
    if (!saveSearchName.trim()) return;
    
    const savedSearch: SavedSearch = {
      id: Date.now().toString(),
      userId: 'current-user',
      name: saveSearchName,
      query: {
        text: searchText,
        filters: activeFilters,
        sortBy,
        sortOrder
      },
      category,
      isPublic: false,
      notifications: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // هنا يمكن حفظ البحث في قاعدة البيانات
    console.log('Saving search:', savedSearch);
    
    setShowSaveDialog(false);
    setSaveSearchName('');
  };

  const renderFilter = (filter: SearchFilter) => {
    const value = activeFilters[filter.id];

    switch (filter.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={filter.placeholder}
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
          >
            <option value="">جميع {filter.name}</option>
            {filter.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
                {option.count && ` (${option.count})`}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        const selectedValues = value || [];
        return (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filter.options?.map(option => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((v: any) => v !== option.value);
                    handleFilterChange(filter.id, newValues.length > 0 ? newValues : null);
                  }}
                  className="rounded border-gray-300 text-[#2E86AB] focus:ring-[#2E86AB]"
                />
                <span className="text-sm">{option.label}</span>
                {option.count && (
                  <span className="text-xs text-gray-500">({option.count})</span>
                )}
              </label>
            ))}
          </div>
        );

      case 'range':
        const rangeValue = value || { min: filter.min, max: filter.max };
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="من"
                value={rangeValue.min || ''}
                onChange={(e) => handleFilterChange(filter.id, {
                  ...rangeValue,
                  min: e.target.value ? Number(e.target.value) : filter.min
                })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="إلى"
                value={rangeValue.max || ''}
                onChange={(e) => handleFilterChange(filter.id, {
                  ...rangeValue,
                  max: e.target.value ? Number(e.target.value) : filter.max
                })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
              />
            </div>
            <input
              type="range"
              min={filter.min}
              max={filter.max}
              step={filter.step}
              value={rangeValue.max || filter.max}
              onChange={(e) => handleFilterChange(filter.id, {
                ...rangeValue,
                max: Number(e.target.value)
              })}
              className="w-full"
            />
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleFilterChange(filter.id, e.target.checked)}
              className="rounded border-gray-300 text-[#2E86AB] focus:ring-[#2E86AB]"
            />
            <span>{filter.name}</span>
          </label>
        );

      case 'rating':
        return (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                onClick={() => handleFilterChange(filter.id, rating)}
                className={`p-1 ${value >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                <Star className="h-5 w-5 fill-current" />
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Main Search Bar */}
      <div className="p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={placeholder}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => showSuggestions && setShowSuggestionsState(true)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent text-lg"
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && showSuggestionsState && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
              >
                {/* Recent Searches */}
                {showHistory && searchHistory.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <History className="h-4 w-4" />
                      عمليات البحث الأخيرة
                    </h4>
                    {searchHistory.slice(0, 3).map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSearchText(item.query);
                          setActiveFilters(item.filters);
                          setShowSuggestionsState(false);
                        }}
                        className="w-full text-right p-2 hover:bg-gray-50 rounded text-sm text-gray-600"
                      >
                        {item.query}
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    اقتراحات شائعة
                  </h4>
                  {suggestions.slice(0, 5).map(suggestion => (
                    <button
                      key={suggestion.text}
                      onClick={() => {
                        setSearchText(suggestion.text);
                        setShowSuggestionsState(false);
                      }}
                      className="w-full text-right p-2 hover:bg-gray-50 rounded flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-700">{suggestion.text}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{suggestion.count}</span>
                        <span>{suggestion.icon}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Saved Searches */}
                {showSavedSearches && savedSearches.length > 0 && (
                  <div className="p-3 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Bookmark className="h-4 w-4" />
                      البحوث المحفوظة
                    </h4>
                    {savedSearches.slice(0, 3).map(saved => (
                      <button
                        key={saved.id}
                        onClick={() => {
                          setSearchText(saved.query.text || '');
                          setActiveFilters(saved.query.filters);
                          setSortBy(saved.query.sortBy || 'relevance');
                          setSortOrder(saved.query.sortOrder || 'desc');
                          setShowSuggestionsState(false);
                        }}
                        className="w-full text-right p-2 hover:bg-gray-50 rounded"
                      >
                        <div className="text-sm font-medium text-gray-700">{saved.name}</div>
                        {saved.description && (
                          <div className="text-xs text-gray-500">{saved.description}</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 ${
              getActiveFilterCount() > 0 ? 'bg-[#2E86AB] text-white border-[#2E86AB]' : ''
            }`}
          >
            <Filter className="h-5 w-5" />
            <span>فلاتر</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-white text-[#2E86AB] px-2 py-1 rounded-full text-xs font-medium">
                {getActiveFilterCount()}
              </span>
            )}
          </button>

          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-[#2E86AB] text-white rounded-lg hover:bg-[#1e5f7a] transition-colors font-medium"
          >
            بحث
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">فلاتر البحث</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSaveDialog(true)}
                className="px-3 py-1 text-sm text-[#2E86AB] hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                حفظ البحث
              </button>
              <button
                onClick={clearAllFilters}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                مسح الكل
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allFilters.map(filter => (
              <div key={filter.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {filter.name}
                  {filter.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderFilter(filter)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sort and View Options */}
      <div className="border-t border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1 text-gray-500 hover:text-gray-700 rounded"
            title={sortOrder === 'asc' ? 'تصاعدي' : 'تنازلي'}
          >
            {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-[#2E86AB] text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-[#2E86AB] text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4" />
          </button>

          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">حفظ البحث</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم البحث
                </label>
                <input
                  type="text"
                  value={saveSearchName}
                  onChange={(e) => setSaveSearchName(e.target.value)}
                  placeholder="أدخل اسم البحث..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notifications"
                  className="rounded border-gray-300 text-[#2E86AB] focus:ring-[#2E86AB]"
                />
                <label htmlFor="notifications" className="text-sm text-gray-700">
                  إرسال إشعارات عند وجود نتائج جديدة
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveSearch}
                disabled={!saveSearchName.trim()}
                className="flex-1 px-4 py-2 bg-[#2E86AB] text-white rounded-lg hover:bg-[#1e5f7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                حفظ
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;

