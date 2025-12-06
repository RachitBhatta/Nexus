import mongoose,{Schema,Document} from "mongoose"
import { userAgent } from "next/server"

export interface Sessions extends Document{
    userId:mongoose.Types.ObjectId,
    token:string,
    deviceInfo:{
        //User agent is just id for you browser of computer
        userAgent:string
        os?:string,
        browser?:string,
        ip:string,

    },
    isActive:boolean,
    expiresAt:Date,
    lastAccessedAt:Date,
    createdAt:Date
}

export const SessionSchema:Schema<Sessions>=new Schema(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true,
            index:true
        },
        token:{
            type:String,
            required:true,
            unique:true,
            index:true
        },
        deviceInfo:{
            userAgent:{
                type:String,
                required:true
            },
            ip:{
                type:String,
                required:true
            },
            os:{
                type:String
            },
            browser:{
                type:String
            }
        },
        isActive:{
            type:Boolean,
            default:true
        },
        expiresAt:{
            type:Date,
            required:true,
            index:true
        },
        lastAccessedAt:{
            type:Date,
            default:Date.now
        }
    },{
        timestamps:true
    }
)


SessionSchema.index({userId:1,isActive:1});
SessionSchema.index({expiresAt:1},{expireAfterSeconds:0});//Auto delete

//Methods
SessionSchema.methods.updateAccess=async function():Promise<void>{
    this.lastAccessedAt=new Date();
    await this.save();
}

SessionSchema.methods.deactivate=async function():Promise<void>{
    this.isActive=false;
    await this.save();
}
//Static Methods
SessionSchema.statics.getAccessToken=async function(userId:string){
    return this.find({
        userId,
        isActive:true,
        expiresAt:{$gt:new Date()}
    }).sort({lastAccessedAt:-1})
};

SessionSchema.statics.deactivateAllSessions=async function(userId:string){
    return this.updateMany(
        {userId,isActive:true},
        {$set:{isActive:false}}
    )
}

SessionSchema.statics.deleteExpiredSessions=async function(){
    return this.deleteMany({
        expiresAt:{$lt:new Date()}
    })
}

const SessionModel=mongoose.models.Sessions as mongoose.Model<Sessions>||mongoose.model<Sessions>("Session",SessionSchema);

export default SessionModel;