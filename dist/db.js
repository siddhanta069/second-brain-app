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
exports.LinkModel = exports.ContentModel = exports.TagModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Schema = mongoose_1.default.Schema;
const Types = mongoose_1.default.Types;
dotenv_1.default.config();
const connectToDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield mongoose_1.default.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit process with failure
    }
});
exports.default = connectToDb;
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});
const TagSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    }
});
const contentTypes = ["text", "image", "video", "audio"];
const ContentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, required: true, enum: contentTypes },
    tags: [{ type: Types.ObjectId, ref: "Tag" }],
    title: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
});
const LinkSchema = new Schema({
    hash: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
});
exports.UserModel = mongoose_1.default.model("User", UserSchema);
exports.TagModel = mongoose_1.default.model("Tag", TagSchema);
exports.ContentModel = mongoose_1.default.model("Content", ContentSchema);
exports.LinkModel = mongoose_1.default.model("Link", LinkSchema);
