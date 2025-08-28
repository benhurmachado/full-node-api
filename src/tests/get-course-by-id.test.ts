import { test, expect } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { faker } from '@faker-js/faker'
import { makeCourse } from './factories/make-course.ts'
import { makeLogin } from './factories/make-login.ts'

//Supertest faz as requests http

test("Get Course By Id", async () => {
    await server.ready()

    const { token } = await makeLogin('student')

    const course = await makeCourse()

    const response = await request(server.server)
    .get(`/courses/${course.id}`)
    .set('Authorization', token)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
        course: {
            id: expect.any(String),
            title: expect.any(String),
            description: null,
        }
    })
})

test('return 404', async() => {
    await server.ready()

    const { token } = await makeLogin('student')

    const response = await request(server.server)
    .get(`/courses/a7c38d83-f843-4e2a-aae3-3be46d398945`)
    .set('Authorization', token)

    expect(response.status).toEqual(404)
})