import express from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import z from 'zod';
import bcrypt from 'bcrypt';
import { UserModel } from "./db";
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file
const JWT_SECRET = process.env.JWT_SECRET as string;

const app = express();
app.use(express.json());

const userEntrySchema = z.object({
    username: z.string().min(3).max(10),
    email: z.string().email(),
    password: z.string().min(6).max(20)
    .regex(/[A-Z]/, "at least one uppercase letter")
    .regex(/[a-z]/, "at least one lowercase letter")
    .regex(/[0-9]/, "at least one number"),
});


app.post("/api/v1/signup", async (req:Request, res: Response) => {
    const userEntry = userEntrySchema.safeParse(req.body);

    if(!userEntry.success) {
        return res.status(400).json({error: userEntry.error});
    }
     
    try { 
        const {username, email, password} = userEntry.data;

        const existingUser = await UserModel.findOne({username});
        if(existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 5);

        await UserModel.create( {
            username,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            message: "User Created Successfully",
            status: 201
        });

    } catch (error) {
        res.json({
            error,
            message:"Internal Server Error",
            status: 500
        })

    }
})

app.post("/api/v1/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await UserModel.findOne({username});
        if(!existingUser) { 
            return res.status(400).json({
                message: "Invalid Username or Password"
            })

        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid Username or Password"
            })
        }

        const token = jwt.sign({
            userId: existingUser._id,
        }, JWT_SECRET,)

        res.json({
            message: "User Signed In Successfully",
            token
        })

    } catch (e) {
        res.status(500).json({
            message:"Internal Server Error",
            error:e
            
        })

    }
    
})

app.post("/api/v1/content", (req, res) => {

}) 

app.get("/api/v1/content", (req, res) => {

})

app.delete("/api/v1/content", (req, res) => {

}) 

app.post("/api/v1/brain/share", (req, res) => {

})

app.get("/api/v1/brain/:shareLink", (req, res) => {

})

app.listen(3000);