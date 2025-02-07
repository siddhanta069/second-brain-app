import {Request, Response, NextFunction} from 'express';
import dotnet from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';

dotnet.config();
const JWT_SECRET = process.env.JWT_SECRET;

export interface RequestWithUserId extends Request {
    userId?: string;
}
export const userMiddleware = (req: RequestWithUserId, res:Response, next: NextFunction) => {
    const header = req.headers['Authorization'];
    const decoded = jwt.verify(header as string, JWT_SECRET as string) as JwtPayload;

    if(decoded) {
        req.userId = decoded.id;
        next();
    } else {
        res.json({
            message: "Unauthorized",
            status: 401
        })
    }
}