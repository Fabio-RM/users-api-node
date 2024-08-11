import { Request, Response } from "express";
import bcrypt, { compare } from 'bcryptjs';
import { sign } from '../services/jwt';
import { User } from "../database/models/User";
import jwt from "jsonwebtoken";

class UserController {

    public async create(req: Request, res: Response): Promise<Response> {
        const { name, email, password } = req.body;

        // Checks required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Missing required field(s)" });
        }

        // Checks if a duplicate email has been entered
        try {
            const duplicate = await User.findOne({where: { email: email }});
            
            if (duplicate) {
                return res.status(409).json({ error: "Email already in use" });
            }
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: "Error looking for duplicate entries"});
        }

        // Creates user
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ name, email, password: hashedPassword });
            return res.status(201).json({ success: true, message: "User created successfully" });
        } catch (error) {
            return res.status(500).json({ error: "Error creating user"});
        }
    }

    
    public async login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        
        // Checks required fields
        if (!email || !password) 
            return res.status(400).json({ error: "Missing required field(s)" });

        // Checks if the email and password are valid
        try {
            const user = await User.findOne({ where: { email } });
            
            if (!user) 
                return res.status(404).json({ error: "User not found" });
            
            const passwordMatches = await bcrypt.compare(password, user.password);
            if (!passwordMatches) 
                return res.status(401).json({ error: "Invalid email or password" });
        
            const token = sign({ id: user.id, email: user.email });

            return res.status(200).json({ success: true, token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error logging in user" });
        }
    }


    public async verifyToken(req: Request, res: Response): Promise<Response> {
        const token = req.header('Authorization');

        // Checks if token was send
        if (!token) return res.status(401).json({ error: "Missing token" });

        // Checks if the token is valid
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, email: string };
            const user = await User.findByPk(decoded.id, { attributes: ['id', 'name', 'email'] });

            if (!user) return res.status(404).json({ error: "User not found" });
            
            return res.status(200).json({ success: true, message: "Token is valid" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error verifying token" });
        }
    }
}

export default new UserController;