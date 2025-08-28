import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'
import z from 'zod'
import { title } from 'process'
import { checkRequestJWT } from './hooks/check-request-jwt.ts'
import { checkUserRole } from './hooks/check-user-role.ts'

export const createCourse: FastifyPluginAsyncZod = async (server) => {
    server.post('/courses', {
        preHandler:[
            checkRequestJWT,
            checkUserRole('manager'),
        ],
        schema: {
            //swagger documentation
            tags: ['courses'],
            summary: 'Create a course',
            description: 'This route receive a title and create a course in the db',
            body: z.object({
                title: z.string().min(5, "Title needs 5 chars at least")
            }),
            response: {
                201: z.object({ courseId: z.uuid() }).describe('Success') 
            }
        }
        }, 
        async (request, reply) => {

        const courseTitle = request.body.title

        const result = await db
            .insert(courses)
            .values({ title: courseTitle })
            .returning()

        return reply.status(201).send({ courseId: result[0].id })
    })
}