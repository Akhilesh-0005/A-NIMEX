import { User } from '../types';

// This is a mock database for demonstration purposes.
// In a real application, this would be a secure backend service.
export const MOCK_USERS: User[] = [
  { id: '1', email: 'admin@example.com', password: 'adminpassword', favorites: [] },
  { id: '2', email: 'user@example.com', password: 'userpassword', favorites: [] },
];