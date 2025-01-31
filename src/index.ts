import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import z from 'zod';

const app = express();
app.use(express.json());

app.post("api/v1/signup", (req, res) => {
    const userSchema = z.object({
        username: z.string().min(3).max(10),
        email: z.string().email(),
        password: z.string().min(6).max(20)
        .regex(/[A-Z]/, "at least one uppercase letter")
        .regex(/[a-z]/, "at least one lowercase letter")
        .regex(/[0-9]/, "at least one number"),
    })

    const userData = userSchema.safeParse(req.body);

    if(!userData.success) {
        return res.status(400).json(userData.error);
    }

    try {
        const userDetail = 
    }

})

app.post("api/v1/signin", (req, res) => {

})

app.post("api/v1/content", (req, res) => {

}) 

app.get("api/v1/content", (req, res) => {

})

app.delete("api/v1/content", (req, res) => {

}) 

app.post("api/v1/brain/share", (req, res) => {

})

app.get("api/v1/brain/:shareLink", (req, res) => {

})

app.listen(3000);