import { Schema, Document } from "mongoose";
import { Message,MessageSchema } from "./Message.model";
import mongoose from "mongoose";
import { IAchievement,AchievementsModel } from "./Achievement.model";
export interface User extends Document{   
    username:string,
    password:string,
    email:string,
    avatar:string,
    coverPicture:string

    //Followers
    followers:mongoose.Types.ObjectId,
    following:mongoose.Types.ObjectId,
    //Projects
    projects:string[],

    //Email verification
    VerifyOTP?:string,
    OTPexpiry?:Date,
    isVerified:boolean,

    //2FA
    twoFactorEnabled:boolean,
    twoFactorSecret?:string,
    backupCodes?:string[],

    //Messages
    isMessageAccepted:boolean,
    message:Message[],

    //AchieveMents
    achievements:IAchievement[],

    //Security Tracking
    lastLogin?:Date,  
    accountLockedUntil?:Date,
    failedLoginAttempts:number
    //Password reset
    passwordResetExpiry?:Date,
    resetPasswordToken?:string

    //OAuth
    googleId?:string,
    githubId?:string

    createdAt:Date,
    updatedAt:Date,

    isAccountLocked(): boolean;
    incrementFailedLoginAttempts(): Promise<void>;
    resetLoginAttempts(): Promise<void>;
}


export const UserSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must be no more than 30 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please use a valid email address"
      ]
    },
    password: {
      type: String,
      required: function():boolean {
        return !this.googleId && !this.githubId;
      }
    },
    following:{
      type:Schema.Types.ObjectId,
      ref:"User"
    },
    followers:{
      type:Schema.Types.ObjectId,
      ref:"User"
    },
    //Users Avatar
    avatar:{
      type:String,
      default:() => "/defaultAvatar.svg"
    }
    , 
    // Email verification
    VerifyOTP: {
      type: String ,
      required: function():boolean {
        return !this.googleId && !this.githubId;
      }
    },
    OTPexpiry: {
      type: Date ,
      required: function():boolean {
        return !this.googleId && !this.githubId;
      }
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    
    // 2FA
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String
    },
    backupCodes: [{
      type: String
    }],
    
    // Messages
    isMessageAccepted: {
      type: Boolean,
      default: true
    },
    message: [MessageSchema],
    achievements:[{
      achievementId:{
        type:Schema.Types.ObjectId,
        ref:"Achievement",
      },
      earnedAt:{
        type:Date,
        default:Date.now
      }
    }],
    // Security tracking
    lastLogin: {
      type: Date
    },
    
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    accountLockedUntil: {
      type: Date
    },
    
    // Password reset
    resetPasswordToken: {
      type: String
    },
    passwordResetExpiry: {
      type: Date
    },
    
    // OAuth IDs
    googleId: {
      type: String,
      unique: true,
      sparse: true // Allows multiple null values
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

UserSchema.index({email:1});
UserSchema.index({username:1});
UserSchema.index({googleId:1});
UserSchema.index({githubId:1});
UserSchema.index({VerifyOTP:1});
UserSchema.index({resetPasswordToken:1})


//Methods
//To check if account is locked
 UserSchema.methods.isAccountLocked=function():boolean{
    return !!(this.accountLockedUntil && this.accountLockedUntil>new Date());
}
//Locking the account for 30 min
UserSchema.methods.incrementFailedLoginAttempts=async function():Promise<void>{
    this.failedLoginAttempts+=1;

    if(this.failedLoginAttempts>=5){
        this.accountLockedUntil=new Date(Date.now()+30*60*1000);
    }
    await this.save();
}
//Reset Login Attemps
UserSchema.methods.resetLoginAttempts=async function(){
    if(!this.isAccountLocked()){
        this.failedLoginAttempts=0;
        this.accountLockedUntil=undefined;
        await this.save();
    }
}


const UserModel=(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema);
export default UserModel;