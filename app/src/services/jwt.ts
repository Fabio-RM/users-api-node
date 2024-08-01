import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const secret = process.env.JWT_SECRET as string;

interface jwtPayload {
    id: number;
    email: string;
}

interface AuthRequest extends Request {
    user?: any;
}

export const sign = (payload: jwtPayload) => {
    return jwt.sign(payload, secret, { expiresIn: '1d' });
}