// أنواع البيانات لنظام البحث والتصفية المتقدم

export interface SearchFilter {
  id: string;
  name: string;
  type: 'text' | 'select' | 'multiselect' | 'range' | 'date' | 'boolean' | 'rating' | 'location';
  placeholder?: string;
  options?: SearchFilterOption[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  defaultValue?: any;
  validation?: SearchFilterValidation;
}

export interface SearchFilterOption {
  value: string | number;
  label: string;
  count?: number;
  icon?: string;
  color?: string;
  description?: string;
}

export interface SearchFilterValidation {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  custom?: (value: any) => boolean | string;
}

export interface SearchQuery {
  text?: string;
  filters: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  facets?: string[];
}

export interface SearchResult<T = any> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  facets?: SearchFacet[];
  suggestions?: string[];
  searchTime: number;
  query: SearchQuery;
}

export interface SearchFacet {
  field: string;
  name: string;
  values: SearchFacetValue[];
}

export interface SearchFacetValue {
  value: string;
  label: string;
  count: number;
  selected: boolean;
}

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'category' | 'user' | 'service' | 'project';
  count?: number;
  icon?: string;
}

export interface SearchHistory {
  id: string;
  userId: string;
  query: string;
  filters: Record<string, any>;
  resultCount: number;
  searchedAt: Date;
  category: 'services' | 'projects' | 'freelancers' | 'messages' | 'general';
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  description?: string;
  query: SearchQuery;
  category: 'services' | 'projects' | 'freelancers' | 'messages' | 'general';
  isPublic: boolean;
  notifications: boolean; // إشعارات عند وجود نتائج جديدة
  lastRun?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchAnalytics {
  userId?: string;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  totalSearches: number;
  uniqueQueries: number;
  topQueries: {
    query: string;
    count: number;
    avgResultCount: number;
  }[];
  topFilters: {
    filter: string;
    value: string;
    count: number;
  }[];
  categoryBreakdown: {
    category: string;
    count: number;
    percentage: number;
  }[];
  noResultQueries: {
    query: string;
    count: number;
    filters: Record<string, any>;
  }[];
  avgSearchTime: number;
  avgResultsPerSearch: number;
}

export interface SearchConfiguration {
  category: 'services' | 'projects' | 'freelancers' | 'messages' | 'general';
  searchableFields: SearchableField[];
  filters: SearchFilter[];
  sortOptions: SortOption[];
  defaultSort: string;
  resultsPerPage: number;
  maxResults: number;
  enableFacets: boolean;
  enableSuggestions: boolean;
  enableAutoComplete: boolean;
  enableSearchHistory: boolean;
  enableSavedSearches: boolean;
}

export interface SearchableField {
  field: string;
  weight: number; // وزن الحقل في النتائج
  boost?: number; // تعزيز النتائج
  analyzer?: 'standard' | 'arabic' | 'keyword';
  searchType?: 'exact' | 'fuzzy' | 'prefix' | 'wildcard';
}

export interface SortOption {
  value: string;
  label: string;
  field: string;
  order: 'asc' | 'desc';
  icon?: string;
  description?: string;
}

export interface SearchHighlight {
  field: string;
  fragments: string[];
  maxFragments: number;
  fragmentSize: number;
}

export interface SearchContext {
  userId?: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
  preferences?: {
    language: string;
    currency: string;
    timezone: string;
  };
  history?: SearchHistory[];
  savedSearches?: SavedSearch[];
}

export interface AutoCompleteResult {
  suggestions: AutoCompleteSuggestion[];
  categories: AutoCompleteCategory[];
  recentSearches: string[];
  popularSearches: string[];
}

export interface AutoCompleteSuggestion {
  text: string;
  type: 'query' | 'service' | 'project' | 'freelancer' | 'category' | 'skill';
  category?: string;
  icon?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface AutoCompleteCategory {
  name: string;
  label: string;
  count: number;
  icon?: string;
}

export interface SearchIndex {
  id: string;
  type: 'service' | 'project' | 'freelancer' | 'message';
  title: string;
  description: string;
  content: string;
  tags: string[];
  categories: string[];
  skills: string[];
  location?: {
    city: string;
    country: string;
    coordinates?: [number, number];
  };
  price?: {
    min: number;
    max: number;
    currency: string;
    type: 'fixed' | 'hourly' | 'time';
  };
  rating?: number;
  reviewCount?: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  metadata: Record<string, any>;
}

export interface SearchResultItem<T = any> {
  item: T;
  score: number;
  highlights?: SearchHighlight[];
  explanation?: string;
  distance?: number; // للبحث الجغرافي
}

export interface SearchError {
  code: string;
  message: string;
  details?: Record<string, any>;
  suggestions?: string[];
}

export interface SearchPerformance {
  queryTime: number;
  indexTime: number;
  totalTime: number;
  cacheHit: boolean;
  resultsFromCache: boolean;
  indexSize: number;
  memoryUsage: number;
}

export interface SearchExport {
  id: string;
  userId: string;
  query: SearchQuery;
  format: 'csv' | 'excel' | 'pdf' | 'json';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: Date;
  createdAt: Date;
  completedAt?: Date;
}

export interface SearchNotification {
  id: string;
  userId: string;
  savedSearchId: string;
  type: 'new_results' | 'price_drop' | 'new_freelancer' | 'project_update';
  title: string;
  message: string;
  resultCount: number;
  isRead: boolean;
  createdAt: Date;
}

export interface SearchWidget {
  id: string;
  name: string;
  type: 'quick_search' | 'category_filter' | 'location_filter' | 'price_filter' | 'rating_filter';
  configuration: Record<string, any>;
  position: {
    page: string;
    section: string;
    order: number;
  };
  isActive: boolean;
  permissions: string[];
}

export interface SearchTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  query: SearchQuery;
  isPublic: boolean;
  usageCount: number;
  rating: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

