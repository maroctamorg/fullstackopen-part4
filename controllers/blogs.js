const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { validate_user, validate_authorization } = require('./validation/blogs_validation')

blogsRouter.get('/', async (request, response) =>
    response.json(await Blog.find({}).populate('user', { username: 1, name: 1 })))

blogsRouter.post('/', async (request, response) => {
    await validate_user(request)

    const user = await User.findById(request.user)
    const blog = await (new Blog({
        ...request.body,
        user: user.id
    })).save()

    user.blogs = user.blogs.concat(blog.id)
    await user.save()

    response.status(201).json(blog)
})

blogsRouter.put('/:id', async (req, res) => {
    await validate_authorization(req)

    res.json(await Blog.findByIdAndUpdate(
        req.params.id, {
            title: req.body.title,
            author: req.body.author,
            url: req.body.url,
            likes: req.body.likes,
            user: req.body.user.id
        },
        { new: true, runValidators: true, context: 'query' }).populate('user', { username: 1, name: 1 }))
})

blogsRouter.delete('/:id', async (req, res) => {
    await validate_authorization(req)

    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

module.exports = blogsRouter