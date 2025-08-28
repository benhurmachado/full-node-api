import type { FastifyRequest } from "fastify";

export function getAuthenticatedUserFromRequest(request: FastifyRequest){
    const user = request.user

    if(!user){
        //evitar com que o user seja undefined
        throw new Error('Invalid Authentication')
    }

    return user
}