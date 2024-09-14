const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../../app')
const Blog = require('../../models/blog')
const { initialblogs } = require('../helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Promise.all(initialblogs.map(blog => new Blog(blog).save()))
})

describe('when fetching resources', () => {
    test('correct number of blog entries is returned', async () => {
        const result = await api.get('/api/blogs')
        assert.strictEqual(result.body.length, initialblogs.length)
    })

    test('unique identifier property of the blog posts is named id', async () => {
        const result = await api.get('/api/blogs')
        assert(result.body[0].id)
    })
})

describe('when adding resources', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Bitcoin',
            author: 'Satoshi Nakamoto',
            url: 'https://bitcoin.org/en/',
            likes: 1000000
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const addedBlogId = response.body.id
        const blogs = await Blog.find({})
        assert.strictEqual(blogs.length, initialblogs.length + 1)
        assert.deepStrictEqual(blogs.find(blog => blog.id === addedBlogId).toJSON(), { id: addedBlogId, ...newBlog })
    })

    test('likes property defaults to 0', async () => {
        const newBlog = { title: 'Bitcoin', author: 'Satoshi Nakamoto', url: 'https://bitcoin.org/en/' }
        const response = await api
            .post('/api/blogs')
            .send(newBlog)

        assert.strictEqual(response.body.likes, 0)
    })

    test('title and url properties are required', async () => {
        const newBlog = { author: 'Satoshi Nakamoto' }
        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        console.log(response.body.error)
        assert.strictEqual(response.body.error, 'Blog validation failed: url: URL required, title: Title required')
    })
})

describe('when updating resources', () => {
    test('a blog can be deleted', async () => {
        const blogs = await Blog.find({})
        await api.delete(`/api/blogs/${blogs[0].id}`).expect(204)

        const remainingBlogs = await Blog.find({})
        assert.strictEqual(remainingBlogs.length, initialblogs.length - 1)
    })

    test('a blog can be updated', async () => {
        const blogs = await Blog.find({})
        const blogToUpdate = blogs[0].toJSON()
        const updatedBlog = { ...blogToUpdate, url: 'https://new.url.com', likes: blogToUpdate.likes + 1 }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)

        assert.deepStrictEqual(response.body, updatedBlog)
    })
})

after(async () => {
    await mongoose.connection.close()
})