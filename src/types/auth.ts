export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'business' | 'trucker';
  avatar?: string;
  location?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, userType: 'business' | 'trucker') => Promise<boolean>;
  register: (name: string, email: string, password: string, userType: 'business' | 'trucker') => Promise<boolean>;
  logout: () => void;
}