"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.ContentModel = exports.TagModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const Types = mongoose_1.default.Types;
mongoose_1.default.connect("mongodb://localhost:27017/");
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        reqiured: true,
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
const linkSchema = new Schema({
    hash: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
});
exports.UserModel = mongoose_1.default.model("User", UserSchema);
exports.TagModel = mongoose_1.default.model("Tag", TagSchema);
exports.ContentModel = mongoose_1.default.model("Content", ContentSchema);
exports.LinkModel = mongoose_1.default.model("Link", linkSchema);
