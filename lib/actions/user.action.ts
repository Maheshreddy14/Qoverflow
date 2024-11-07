"use server"

import User from "@/database/user.model"
import { connectToDB } from "../mongodb"
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "./shared.types"
import { revalidatePath } from "next/cache"
import Question from "@/database/question.model"

export async function getUserById(params:any) {
    try {
        await connectToDB()
        const {userId}=params
        const user=User.findOne({clerkId:userId})
        return user
    } catch (error) {
        console.log(error)
        throw error
    }
    
}

export async function createUser(userData:CreateUserParams) {
    try {
        await connectToDB()
        const newUser=await User.create(userData)
        
        return newUser
    } catch (error) {
        console.log(error)
        throw error
    }
    
}

export async function updateUser(params:UpdateUserParams) {
    try {
        await connectToDB()
        const {clerkId,updateData,path}=params
        await User.findOneAndUpdate({clerkId},updateData,{
            new:true
        })
        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
    
}

export async function deleteUser(params:DeleteUserParams) {
    try {
        await connectToDB()
        const {clerkId}=params
        const user=await User.findOneAndDelete({clerkId})
        if(!user){
            throw new Error("user not found"); 
        }
        const userQuestionIds=await Question.find({author:user._id}).distinct('_id')
        await Question.deleteMany({author:user._id})
        const deletedUser=await User.findByIdAndDelete(user._id)
    } catch (error) {
        console.log(error)
        throw error
    }
    
}

