import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const accessTokenSecret = process.env.JWT_SECRET_ACCESS_TOKEN as string;
const refreshTokenSecret = process.env.JWT_SECRET_REFRESH_TOKEN as string;

interface jwtPayload {
    id: number;
    email: string;
}

// interface AuthRequest extends Request {
//     user?: any;
// }

// export const sign = (payload: jwtPayload) => {
//     return jwt.sign(payload, accessTokenSecret, { expiresIn: '15m' });
// }

export const generateAccessToken = (user: any) => {
    return jwt.sign({ id: user.id, email: user.email }, accessTokenSecret!, { expiresIn: '15m' });
};

export const generateRefreshToken = (user: any) => {
    return jwt.sign({ id: user.id, email: user.email }, refreshTokenSecret!, { expiresIn: '1d' });
};