import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts'
import { courses, users } from '../database/schema.ts'
import z from 'zod'
import jwt from 'jsonwebtoken'
import { title } from 'process'
import { eq } from 'drizzle-orm'
import { verify } from 'argon2'

export const loginRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/login', {
        schema: {
            //swagger documentation
            tags: ['auth'],
            summary: 'Create a Login',
            body: z.object({
                email: z.email(),
                password: z.string(),
            }),
            response: {
                200: z.object({ token: z.string() }),
                400: z.object({ message: z.string() }),
            }
        }
        }, 
        async (request, reply) => {

        const {email, password} = request.body

        const result = await db
            .select()
            .from(users)
            .where(eq(users.email, email))

        if(result.length === 0){
            return reply.status(400).send({message: 'Login Inválido'})
        }

        const user = result[0]

        const isPasswordCorrect = await verify(user.password, password)

        if(!isPasswordCorrect){
            return reply.status(400).send({message: 'Login Inválido'})
        }

        
        if(!process.env.JWT_SECRET){
            throw new Error('JWT_SECRET must be set')
        }

        const token = jwt.sign({ sub: user.id, role: user.role}, process.env.JWT_SECRET)

        return reply.status(200).send({ token })
    })
}