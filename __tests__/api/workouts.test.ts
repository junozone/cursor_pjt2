import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/workouts/route'
import { prisma } from '@/lib/prisma'

// NextAuthのモック
jest.mock('next-auth/providers/credentials', () => ({}))
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

// Prismaのモック
jest.mock('@/lib/prisma', () => ({
  prisma: {
    workout: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

// authOptionsのモック
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: {},
}))

describe('Workouts API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/workouts', () => {
    it('returns 401 when not authenticated', async () => {
      const getServerSession = require('next-auth').getServerSession
      getServerSession.mockResolvedValueOnce(null)

      const response = await GET()
      expect(response.status).toBe(401)
    })

    it('returns workouts when authenticated', async () => {
      const mockWorkouts = [
        {
          id: '1',
          name: 'ランニング',
          description: 'テスト',
          caloriesPerHour: 500,
          type: '有酸素運動',
        },
      ]

      const getServerSession = require('next-auth').getServerSession
      getServerSession.mockResolvedValueOnce({
        user: { email: 'test@example.com' },
      })
      ;(prisma.workout.findMany as jest.Mock).mockResolvedValueOnce(mockWorkouts)

      const response = await GET()
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toEqual(mockWorkouts)
    })
  })

  describe('POST /api/workouts', () => {
    const createMockRequest = (body: any) => {
      return new NextRequest('http://localhost:3000/api/workouts', {
        method: 'POST',
        body: JSON.stringify(body),
      })
    }

    it('returns 401 when not authenticated', async () => {
      const getServerSession = require('next-auth').getServerSession
      getServerSession.mockResolvedValueOnce(null)

      const request = createMockRequest({
        name: 'テスト運動',
        caloriesPerHour: 400,
        type: 'テスト',
      })

      const response = await POST(request)
      expect(response.status).toBe(401)
    })

    it('creates a new workout when authenticated', async () => {
      const mockWorkout = {
        id: '1',
        name: 'テスト運動',
        description: null,
        caloriesPerHour: 400,
        type: 'テスト',
      }

      const getServerSession = require('next-auth').getServerSession
      getServerSession.mockResolvedValueOnce({
        user: { email: 'test@example.com' },
      })
      ;(prisma.workout.create as jest.Mock).mockResolvedValueOnce(mockWorkout)

      const request = createMockRequest({
        name: 'テスト運動',
        caloriesPerHour: 400,
        type: 'テスト',
      })

      const response = await POST(request)
      expect(response.status).toBe(201)

      const data = await response.json()
      expect(data).toEqual(mockWorkout)
    })
  })
}) 