const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) =>
    response.json(await Blog.find({})))

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    response.status(201).json(await blog.save())
})

blogsRouter.put('/:id', async (req, res) => {
    const blog = {
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes
    }

    res.json(await Blog.findByIdAndUpdate(req.params.id, blog, { new: true, runValidators: true, context: 'query' }))
})

blogsRouter.delete('/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

module.exports = blogsRouter