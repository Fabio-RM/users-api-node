import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config';

const secret = process.env.JWT_SECRET_ACCESS_TOKEN as string;

interface AuthRequest extends Request {
    user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) return res.status(401).send({ message: 'Access denied, no token provided' });
    
    try {
        req.user = jwt.verify(token, secret);

        next();
    } catch (error) {
        return res.status(401).send({ message: 'Invalid token' });
    }
}