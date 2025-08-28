import { test, expect } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { faker } from '@faker-js/faker'
import { makeUser } from './factories/make-user.ts'

//Supertest faz as requests http

test("login", async () => {
    await server.ready()

    const { user, passwordWithoutHash } = await makeUser()

    const response = await request(server.server)
    .post('/login')
    .set('Content-Type', 'application/json')
    .send(
        {
            email: user.email,
            password: passwordWithoutHash 
        }
    )

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
       token: expect.any(String),
    })
})