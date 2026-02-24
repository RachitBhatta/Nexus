import {Schema,model} from "mongoose"
export interface IAchievement{
    name:string,
    description:string,
    imageUrl:string,
    points:number,
    category:"milestone"|"collaboration"|"AI"|"leadership",
    rarity:"common"|"rare"|"epic"|"legendary",
    createdAt?: Date,
    updatedAt?: Date
}

export const AchievementSchema:Schema<IAchievement>=new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:["milestone","collaboration","AI","leadership"],
        required:true,
        index:true
    },
    points:{
        type:Number,
        required:true,
        min:0
    },
    rarity:{
        type:String,
        enum:["common","rare","epic","legendary"],
        required:true
    }
},{timestamps:true});

export const AchievementsModel=model<IAchievement>("Achievement",AchievementSchema)
