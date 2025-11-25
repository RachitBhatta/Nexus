import { Schema } from "mongoose";
import { Message,MessageSchema } from "./Message.model";
import mongoose from "mongoose";
export interface User extends Document{
    username:string,
    email:string,
    password:string,
    VerifyOTP:string,
    OTPExpiry:Date,
    isMessageAccepted:boolean,
    isVerified:boolean,
    messages:Message[]
}

export const UserSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,"Please use a valid email address"]
    },
    VerifyOTP:{
        type:String,
        required:[true,'VerifyCode is required']
    },
    OTPExpiry:{
        type:Date,
        required:[true,'VerifyCodeExpiry is required']
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isMessageAccepted:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
    },{
    timestamps:true
})

const UserModel=(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema);
export default UserModel;