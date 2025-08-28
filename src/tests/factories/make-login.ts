import jwt from 'jsonwebtoken'
import { makeUser } from "./make-user.ts";

export async function makeLogin(role: 'student' | 'manager'){
    const { user } = await makeUser(role)

    if(!process.env.JWT_SECRET){
        throw new Error('JWT_SECRET must be set')
    }

    const token = jwt.sign({ sub: user.id, role: user.role}, process.env.JWT_SECRET)
    
    return { user, token }
}