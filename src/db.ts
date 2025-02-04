import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Types = mongoose.Types;

const connectToDb = process.env.MONGO_URI as string;

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
    link: { type: String, required: true},
    type: {type: String, required: true, enum: contentTypes},
    tags: [{type: Types.ObjectId, ref: "Tag"}],
    title: {type: String, required: true},
    userId: {type: Types.ObjectId, ref: "User", required: true},
});

const linkSchema = new Schema({
    hash: {type: String, required: true},
    userId: {type:Types.ObjectId, ref: "User", required: true},
});

export const UserModel = mongoose.model("User", UserSchema);
export const TagModel = mongoose.model("Tag", TagSchema);
export const ContentModel = mongoose.model("Content", ContentSchema);
export const LinkModel = mongoose.model("Link", linkSchema);

