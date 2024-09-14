const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { initialblogs } = require('./helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Promise.all(initialblogs.map(blog => new Blog(blog).save()))
})

test('correct number of blog entries is returned', async () => {
    const result = await api.get('/api/blogs')
    assert.strictEqual(result.body.length, initialblogs.length)
})

test('unique identifier property of the blog posts is named id', async () => {
    const result = await api.get('/api/blogs')
    assert(result.body[0].id)
})

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

    const destructureModel = ({ title, author, url, likes }) => ({ title, author, url, likes })

    const addedBlogId = response.body.id
    const blogs = await Blog.find({})
    assert.strictEqual(blogs.length, initialblogs.length + 1)
    assert.deepStrictEqual(destructureModel(blogs.find(blog => blog.id === addedBlogId)), newBlog)
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


after(async () => {
    await mongoose.connection.close()
})