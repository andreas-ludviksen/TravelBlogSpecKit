/**
 * Unit tests for login endpoint
 * These tests should FAIL until the endpoint is implemented
 */

import { handleLogin } from '../../workers/auth/login';

// Mock environment
const mockEnv = {
  JWT_SECRET: 'test-jwt-secret',
  RATE_LIMIT_KV: null as any, // Will use mock KV when implementing rate limiting
  NODE_ENV: 'test',
};

describe('POST /api/auth/login', () => {
  describe('Valid credentials', () => {
    it('should return 200 and JWT cookie for valid reader credentials', async () => {
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          password: 'testpassword123',
          rememberMe: true,
        }),
      });
      
      const response = await handleLogin(request, mockEnv);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.user.username).toBe('testuser');
      expect(data.user.role).toBe('reader');
      expect(data.expiresAt).toBeDefined();
      
      // Check cookie is set
      const setCookie = response.headers.get('Set-Cookie');
      expect(setCookie).toContain('session=');
      expect(setCookie).toContain('HttpOnly');
      expect(setCookie).toContain('Secure');
      expect(setCookie).toContain('SameSite=Strict');
    });
    
    it('should return 200 for valid contributor credentials', async () => {
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testcontributor',
          password: 'testpassword123',
          rememberMe: false,
        }),
      });
      
      const response = await handleLogin(request, mockEnv);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.user.role).toBe('contributor');
    });
    
    it('should set 7-day cookie expiry with rememberMe true', async () => {
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          password: 'testpassword123',
          rememberMe: true,
        }),
      });
      
      const response = await handleLogin(request, mockEnv);
      const setCookie = response.headers.get('Set-Cookie');
      
      expect(setCookie).toContain('Max-Age=604800'); // 7 days in seconds
    });
    
    it('should set 24-hour cookie expiry with rememberMe false', async () => {
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          password: 'testpassword123',
          rememberMe: false,
        }),
      });
      
      const response = await handleLogin(request, mockEnv);
      const setCookie = response.headers.get('Set-Cookie');
      
      expect(setCookie).toContain('Max-Age=86400'); // 24 hours in seconds
    });
  });
  
  describe('Invalid credentials', () => {
    it('should return 401 for non-existent username', async () => {
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'nonexistentuser',
          password: 'anypassword',
          rememberMe: false,
        }),
      });
      
      const response = await handleLogin(request, mockEnv);
      
      expect(response.status).toBe(401);
      
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('INVALID_CREDENTIALS');
      expect(data.message).toBe('Invalid username or password'); // Generic error
    });
    
    it('should return 401 for wrong password', async () => {
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          password: 'wrongpassword',
          rememberMe: false,
        }),
      });
      
      const response = await handleLogin(request, mockEnv);
      
      expect(response.status).toBe(401);
      
      const data = await response.json();
      expect(data.error).toBe('INVALID_CREDENTIALS');
      expect(data.message).toBe('Invalid username or password'); // Same message as non-existent user
    });
    
    it('should not reveal if username exists in error message', async () => {
      const nonExistentRequest = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'nonexistent',
          password: 'anypassword',
        }),
      });
      
      const wrongPasswordRequest = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          password: 'wrongpassword',
        }),
      });
      
      const response1 = await handleLogin(nonExistentRequest, mockEnv);
      const response2 = await handleLogin(wrongPasswordRequest, mockEnv);
      
      const data1 = await response1.json();
      const data2 = await response2.json();
      
      // Both should have identical error messages
      expect(data1.message).toBe(data2.message);
      expect(data1.error).toBe(data2.error);
    });
  });
  
  describe('Validation errors', () => {
    it('should return 400 for missing username', async () => {
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: 'testpassword123',
        }),
      });
      
      const response = await handleLogin(request, mockEnv);
      
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('INVALID_INPUT');
    });
    
    it('should return 400 for missing password', async () => {
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
        }),
      });
      
      const response = await handleLogin(request, mockEnv);
      
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('INVALID_INPUT');
    });
    
    it('should return 400 for empty request body', async () => {
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      
      const response = await handleLogin(request, mockEnv);
      
      expect(response.status).toBe(400);
    });
  });
});
