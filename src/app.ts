import fastify from "fastify";
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from "fastify-type-provider-zod";
import { fastifySwagger } from '@fastify/swagger'
import { createCourse } from "./routes/create-course.ts";
import { getCourses } from "./routes/get-courses.ts";
import { getCourseById } from "./routes/get-course-by-id.ts";
import scalarApiReference from '@scalar/fastify-api-reference'

const server = fastify({
    logger: {
            transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    }
}).withTypeProvider<ZodTypeProvider>();

if(process.env.NODE_ENV === 'development'){
    server.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'Api Node',
                version: '1.0.0'
            }
        },
        transform: jsonSchemaTransform,
    })

    server.register(scalarApiReference, {
        routePrefix: '/docs'
    })
}

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(getCourses)
server.register(getCourseById)
server.register(createCourse)


export {server}