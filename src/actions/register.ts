"use server";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import bycrypt from "bcrypt";
import * as z from "zod";
import { getUserByEmail } from "../../data/user";
export const register = async (values: z.infer<typeof RegisterSchema>) => {
   
    const validatedFields = RegisterSchema.safeParse(values)
    if (!validatedFields.success) {
        return {error: "Invalid fields!"}
    }

    const { email, password, name } = validatedFields.data
    const hashedPassword = await bycrypt.hash(password, 10)
    
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
        return { error: "Email already in use!" }
        
    }
    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })
// TODO: send varification token email


    return{success:"User Created"}
}