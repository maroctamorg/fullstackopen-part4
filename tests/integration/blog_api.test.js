const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../../app')
const Blog = require('../../models/blog')
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const { initialblogs } = require('../helper')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    const savedUser = await user.save()

    await Blog.deleteMany({})
    await Promise.all(initialblogs.map(blog => new Blog({
        ...blog,
        user: savedUser.id
    }).save()))
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

        const loginResponse = await api
            .post('/api/login')
            .send({ username: 'root', password: 'sekret' })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogs = await Blog.find({})
        assert.strictEqual(blogs.length, initialblogs.length + 1)
    })

    test('likes property defaults to 0', async () => {
        const newBlog = { title: 'Bitcoin', author: 'Satoshi Nakamoto', url: 'https://bitcoin.org/en/' }

        const loginResponse = await api
            .post('/api/login')
            .send({ username: 'root', password: 'sekret' })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send(newBlog)

        assert.strictEqual(response.body.likes, 0)
    })

    test('title and url properties are required', async () => {
        const newBlog = { author: 'Satoshi Nakamoto' }

        const loginResponse = await api
            .post('/api/login')
            .send({ username: 'root', password: 'sekret' })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send(newBlog)
            .expect(400)

        console.log(response.body.error)
        assert.strictEqual(response.body.error, 'Blog validation failed: url: URL required, title: Title required')
    })

    test('a blog cannot be added without a valid token', async () => {
        const newBlog = {
            title: 'Bitcoin',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })
})

describe('when updating resources', () => {
    test('a blog can be deleted', async () => {
        const blogs = await Blog.find({})

        const loginResponse = await api
            .post('/api/login')
            .send({ username: 'root', password: 'sekret' })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        await api
            .delete(`/api/blogs/${blogs[0].id}`)
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .expect(204)

        const remainingBlogs = await Blog.find({})
        assert.strictEqual(remainingBlogs.length, initialblogs.length - 1)
    })

    test('a blog can be updated', async () => {
        const blogs = await Blog.find({})
        const blogToUpdate = blogs[0].toJSON()
        const updatedBlog = { ...blogToUpdate, url: 'https://new.url.com', likes: blogToUpdate.likes + 1 }

        const loginResponse = await api
            .post('/api/login')
            .send({ username: 'root', password: 'sekret' })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send(updatedBlog)
            .expect(200)

        assert.strictEqual(response.body.author, updatedBlog.author)
        assert.strictEqual(response.body.title, updatedBlog.title)
        assert.strictEqual(response.body.url, updatedBlog.url)
        assert.strictEqual(response.body.likes, updatedBlog.likes)
    })
})

after(async () => {
    await mongoose.connection.close()
})