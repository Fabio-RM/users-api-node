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


export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization');

        if (!token) return res.status(401).send({ message: 'Access denied' });

        const decoded = jwt.verify(token, secret);
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).send({ message: 'Invalid token' });
    }
}