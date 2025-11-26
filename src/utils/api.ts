const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiError {
  error: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage on init
    this.token = localStorage.getItem('token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = 'An error occurred';
        try {
          const error: ApiError = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error: any) {
      // Handle network errors (CORS, connection refused, etc.)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to server. Make sure the backend is running on ${this.baseUrl}`);
      }
      throw error;
    }
  }

  // Auth endpoints
  async signup(email: string, password: string, name: string) {
    return this.request<{ token: string; user: User }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request<{ user: User }>('/auth/me');
  }

  async updatePreferences(preferences: Partial<UserPreferences>) {
    return this.request<{ user: User }>('/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Listing endpoints
  async getListings() {
    return this.request<{ listings: Listing[] }>('/listings/browse');
  }

  async getMyListings() {
    return this.request<{ listings: Listing[] }>('/listings/my-listings');
  }

  async createListing(listing: Omit<Listing, '_id' | 'ownerId' | 'createdAt'>) {
    return this.request<{ listing: Listing }>('/listings', {
      method: 'POST',
      body: JSON.stringify(listing),
    });
  }

  async getListing(id: string) {
    return this.request<{ listing: Listing }>(`/listings/${id}`);
  }

  async likeListing(id: string) {
    return this.request<{ like: any; matched: boolean; match?: Match }>(
      `/listings/${id}/like`,
      {
        method: 'POST',
      }
    );
  }

  async unlikeListing(id: string) {
    return this.request<{ message: string }>(`/listings/${id}/like`, {
      method: 'DELETE',
    });
  }

  async getSavedListings() {
    return this.request<{ listings: Listing[] }>('/listings/likes/saved');
  }

  // Match endpoints
  async getMatches() {
    return this.request<{ matches: Match[] }>('/matches');
  }

  async getMatch(id: string) {
    return this.request<{ match: Match }>(`/matches/${id}`);
  }

  async getMatchMessages(matchId: string) {
    return this.request<{ messages: Message[] }>(
      `/matches/${matchId}/messages`
    );
  }

  async sendMessage(matchId: string, content: string) {
    return this.request<{ message: Message }>(`/matches/${matchId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  priceRange: {
    min: number;
    max: number;
  };
  numRoommates: '0' | '1' | '2' | '3+' | 'Any';
  preferredGenders: ('Male' | 'Female' | 'Non-binary' | 'Any')[];
  preferredLocations: ('U-District' | 'Capitol Hill' | 'Northgate' | 'Other')[];
}

export interface Listing {
  _id: string;
  ownerId: string | User;
  title: string;
  price: number;
  neighborhood: 'U-District' | 'Capitol Hill' | 'Northgate' | 'Other';
  startDate: string;
  endDate: string;
  images: string[];
  vibes: string[];
  promptQuestion: string;
  promptAnswer: string;
  preferences?: {
    numRoommates: string;
    preferredGenders: string[];
  };
  createdAt: string;
  isActive: boolean;
}

export interface Match {
  _id: string;
  users: User[];
  listingId: Listing | string;
  matchedAt: string;
  lastMessageAt: string;
}

export interface Message {
  _id: string;
  matchId: string;
  senderId: User | string;
  content: string;
  createdAt: string;
  read: boolean;
}
