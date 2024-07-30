import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import { User } from "../database/models/User";

class UserController {

    public async create(req: Request, res: Response): Promise<Response> {
        const { name, email, password } = req.body;
                
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Missing required field(s)" });
        }

        try {
            const duplicate = await User.findOne({where: { email: email }});
            
            if (duplicate) {
                return res.status(409).json({ error: "Email already in use" });
            }
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: "Error looking for duplicate entries"});
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ name, email, password: hashedPassword });
            return res.status(201).json(newUser);
        } catch (error) {
            return res.status(500).json({ error: "Error creating user"});
        }
    }
}

export default new UserController;