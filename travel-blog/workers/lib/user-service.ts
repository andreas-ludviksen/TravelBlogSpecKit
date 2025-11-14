/**
 * User lookup and management service
 * Loads users from static JSON file
 */

import usersData from '../users.json';

export interface User {
  username: string;
  passwordHash: string;
  role: 'reader' | 'contributor';
  createdAt?: string;
  displayName?: string;
}

interface UsersFile {
  users: User[];
}

// Type-safe access to users data
const users: User[] = (usersData as UsersFile).users;

/**
 * Find a user by username (case-insensitive)
 * @param username - Username to search for
 * @returns User object if found, null otherwise
 */
export function findUserByUsername(username: string): User | null {
  const normalizedUsername = username.toLowerCase();
  
  const user = users.find(
    u => u.username.toLowerCase() === normalizedUsername
  );
  
  return user || null;
}

/**
 * Get all users (for admin purposes - not exposed via API)
 * @returns Array of all users
 */
export function getAllUsers(): User[] {
  return users;
}

/**
 * Check if a user exists
 * @param username - Username to check
 * @returns True if user exists, false otherwise
 */
export function userExists(username: string): boolean {
  return findUserByUsername(username) !== null;
}

/**
 * Get user count
 * @returns Total number of users
 */
export function getUserCount(): number {
  return users.length;
}
