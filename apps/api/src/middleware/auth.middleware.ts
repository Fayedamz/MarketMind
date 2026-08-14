import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    name: string
  }
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const token = authHeader.substring(7)
    const user = await authService.verifyToken(token)

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
