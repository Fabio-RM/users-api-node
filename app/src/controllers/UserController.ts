import { Request, Response } from "express";
import bcrypt, { compare } from 'bcryptjs';
import dotenv from 'dotenv/config'
import { generateAccessToken, generateRefreshToken } from '../services/jwt';
import { User } from "../database/models/User";
import jwt from "jsonwebtoken";
import s3 from "../config/s3-bucket";
import { PutObjectCommand } from "@aws-sdk/client-s3";


class UserController {

    public async create(req: Request, res: Response): Promise<Response> {
        const { name, email, password } = req.body;
        let avatarFileName = null;

        // Checks required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing required field(s)" });
        }

        // Checks if a duplicate email has been entered
        try {
            const duplicate = await User.findOne({where: { email: email }});
            
            if (duplicate) {
                return res.status(409).json({ message: "Email already in use" });
            }
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: "Error looking for duplicate entries"});
        }

        // Creates user
        try {
            // If user uploads an avatar image, then uploads to S3 bucket
            if (req.file) {
                const fileExtension = req.file.originalname.split('.').pop();
                avatarFileName = crypto.randomUUID() + '.' + fileExtension;

                const command = new PutObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: String(avatarFileName),
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype,
                });

                try {
                    await s3.send(command);
                } catch (error) {
                    console.error("Error uploading file:", error);
                    throw new Error("Error uploading file to S3");
                }
            }

            // Add new user to database
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ name, email, password: hashedPassword, avatar: avatarFileName });

            return res.status(201).json({ success: true, message: "User created successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error creating user"});
        }
    }


    public async login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        
        // Checks required fields
        if (!email || !password) 
            return res.status(400).json({ message: "Missing required field(s)" });

        // Checks if the email and password are valid
        try {
            const user = await User.findOne({ where: { email } });
            
            if (!user) 
                return res.status(404).json({ message: "User not found" });
            
            const passwordMatches = await bcrypt.compare(password, user.password);
            if (!passwordMatches) 
                return res.status(401).json({ message: "Invalid email or password" });
        
            // Generates JWT Tokens, stores into DB and creates an HTTP-Only cookie
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            await User.update({ token: refreshToken },
                              { where: { email: user.email } });

            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: false, maxAge: 24*60*60*1000 });

            return res.status(200).json({ success: true, accessToken });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error logging in user" });
        }
    }


    public async logout(req: Request, res: Response): Promise<Response> {
        const { refreshToken } = req.cookies;

        if (!refreshToken) return res.status(400).json({ error: 'No refresh token provided' });
        
        try {
            await User.update({ token: null }, { where: { token: refreshToken } });
    
            res.clearCookie('refreshToken', { httpOnly: true, secure: false, maxAge: 24*60*60*1000 });
        } catch {
            return res.status(500).json({ message: "Error logging out user" });
        }

        return res.status(200).json({ message: "Logged out" });
    }


    public async refreshToken(req: Request, res: Response): Promise<Response> {
        const { refreshToken } = req.cookies;

        if (!refreshToken) return res.status(401).json({ message: "Missing token" });

        try {
            // Checks if token exists on DB
            const user = await User.findOne({ where: { token: refreshToken} });
        
            if (!user || user.token != refreshToken) return res.status(403).json({ message: "Forbidden"});

            // Generates a new access token
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN!);
            const accessToken = generateAccessToken(decoded);

            return res.status(200).json({ accessToken });
        } catch (error) {
            return res.status(403).json({ error: "Invalid or expired refresh token" });
        }
    }


    public async verifyToken(req: Request, res: Response): Promise<Response> {
        const token = req.header('Authorization');

        // Checks if token was send
        if (!token) return res.status(401).json({ message: "Missing token" });

        // Checks if the token is valid
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, email: string };
            const user = await User.findByPk(decoded.id, { attributes: ['id', 'name', 'email'] });

            if (!user) return res.status(404).json({ message: "User not found" });
            
            return res.status(200).json({ success: true, message: "Token is valid" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error verifying token" });
        }
    }
}

export default new UserController;