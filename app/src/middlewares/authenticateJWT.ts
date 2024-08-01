import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config';

const secret = process.env.JWT_SECRET as string;

interface AuthRequest extends Request {
    user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).send({ message: 'Access denied, no token provided' });
    
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).send({ message: 'Invalid token' });
    }
}