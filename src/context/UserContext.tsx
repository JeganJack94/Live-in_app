import { createContext } from 'react';

export interface User {
  name: string;
  img: string;
  uid: string;
  pin: string;
  coupleId?: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  coupleId: string | null;
  setCoupleId: (id: string | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  coupleId: null,
  setCoupleId: () => {}
});
