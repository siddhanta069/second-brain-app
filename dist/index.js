"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const dotenv_1 = __importDefault(require("dotenv"));
const middleware_1 = require("./middleware");
dotenv_1.default.config(); // Load environment variables from .env file
const JWT_SECRET = process.env.JWT_SECRET;
const app = (0, express_1.default)();
app.use(express_1.default.json());
const userEntrySchema = zod_1.default.object({
    username: zod_1.default.string().min(3).max(10),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6).max(20)
        .regex(/[A-Z]/, "at least one uppercase letter")
        .regex(/[a-z]/, "at least one lowercase letter")
        .regex(/[0-9]/, "at least one number"),
});
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEntry = userEntrySchema.safeParse(req.body);
    if (!userEntry.success) {
        return res.status(400).json({ error: userEntry.error });
    }
    try {
        const { username, email, password } = userEntry.data;
        const existingUser = yield db_1.UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 5);
        yield db_1.UserModel.create({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).json({
            message: "User Created Successfully",
            status: 201
        });
    }
    catch (error) {
        res.json({
            error,
            message: "Internal Server Error",
            status: 500
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const existingUser = yield db_1.UserModel.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({
                message: "Invalid Username or Password"
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid Username or Password"
            });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: existingUser._id,
        }, JWT_SECRET);
        res.json({
            message: "User Signed In Successfully",
            token
        });
    }
    catch (e) {
        res.status(500).json({
            message: "Internal Server Error",
            error: e
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, tags, title } = req.body;
    yield db_1.ContentModel.create({
        link,
        type,
        tags,
        title,
        userId: req.userId
    });
    return res.json({
        message: "Content Created Successfully",
    });
}));
app.get("/api/v1/content", (req, res) => {
});
app.delete("/api/v1/content", (req, res) => {
});
app.post("/api/v1/brain/share", (req, res) => {
});
app.get("/api/v1/brain/:shareLink", (req, res) => {
});
app.listen(3000);
