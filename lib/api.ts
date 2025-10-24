// lib/api.ts
import { API_BASE_URL } from "./config";
import { useAuthStore } from "./authStore";
import { 
  LoginResponse, 
  ApiError, 
  NewsApiResponse,
  SummarizeResponse,
  BackendUser
} from "@/types";

// Helper function for all API calls
async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const { token } = useAuthStore.getState(); // Get token from Zustand

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.error || 'An unknown error occurred');
  }

  return response.json();
}

// ==================== AUTH API ====================

export const loginUser = (email: string, password: string): Promise<LoginResponse> => {
  return apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const signupUser = (name: string, email: string, password: string, location: string): Promise<{ message: string, redirect: string }> => {
  return apiFetch('/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, location }),
  });
};

// ==================== PREFERENCES API ====================

export const getPreferences = (email: string): Promise<{ preferred_domains: string[] }> => {
  return apiFetch('/get_preferences', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const updatePreferences = (email: string, preferred_domains: string[]): Promise<{ message: string }> => {
  return apiFetch('/update_preferences', {
    method: 'POST',
    body: JSON.stringify({ email, preferred_domains }),
  });
};

// ==================== NEWS API ====================

export const fetchNews = (email: string, category: string | null, page: number): Promise<NewsApiResponse> => {
  return apiFetch('/news', {
    method: 'POST',
    body: JSON.stringify({ email, category, page }),
  });
};

export const searchNews = (query: string, page: number): Promise<NewsApiResponse> => {
  return apiFetch('/search', {
    method: 'POST',
    body: JSON.stringify({ query, page }),
  });
};

// ==================== SUMMARIZE API ====================

export const fetchSummary = (article_url: string): Promise<SummarizeResponse> => {
  return apiFetch('/summarize', {
    method: 'POST',
    body: JSON.stringify({ article_url }),
  });
};

export function fetchTopHeadlines(page: number): any {
  throw new Error("Function not implemented.");
}
