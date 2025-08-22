import { test, expect } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { faker } from '@faker-js/faker'
import { makeCourse } from './factories/make-course.ts'

//Supertest faz as requests http

test("Get Course By Id", async () => {
    await server.ready()

    const course = await makeCourse()

    const response = await request(server.server)
    .get(`/courses/${course.id}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
        course: {
            id: expect.any(String),
            title: expect.any(String),
            description: null,
        }
    })
})

// test('return 404', async() => {
//     await server.ready()

//     const response = await request(server.server)
//     .get('/courses/testeteste')

//     expect(response.status).toEqual(404)
// })