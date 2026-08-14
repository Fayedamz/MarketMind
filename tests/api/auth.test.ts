import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import request from 'supertest'
import app from '../../apps/api/src/index'

describe('Auth API', () => {
  let authToken: string

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test${Date.now()}@example.com`,
          password: 'password123',
          name: 'Test User',
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('token')
      expect(response.body.user).toHaveProperty('email')
      expect(response.body.user).toHaveProperty('name')
    })

    it('should return error for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User',
        })

      expect(response.status).toBe(400)
    })

    it('should return error for short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          name: 'Test User',
        })

      expect(response.status).toBe(400)
    })
  })

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      // Register a user first
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'logintest@example.com',
          password: 'password123',
          name: 'Login Test',
        })
    })

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'password123',
        })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      authToken = response.body.token
    })

    it('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'wrongpassword',
        })

      expect(response.status).toBe(401)
    })
  })

  describe('GET /api/auth/me', () => {
    it('should return user info with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.user).toHaveProperty('email')
    })

    it('should return error without token', async () => {
      const response = await request(app).get('/api/auth/me')

      expect(response.status).toBe(401)
    })
  })
})
