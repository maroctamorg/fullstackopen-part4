const Blog = require('../models/blog')

const initialblogs = [
    {
        title: 'McLovin',
        author: 'Seth Rogen',
        url: 'https://www.imdb.com/title/tt0829482/',
        likes: 10
    },
    {
        title: 'On the Geometric Algebra of the Space of Light Rays',
        author: 'David Hestenes',
        url: 'https://geocalc.clas.asu.edu/html/GAinSR.html',
        likes: 5
    },
    {
        title: 'The Hitchhiker\'s Guide to the Galaxy',
        author: 'Douglas Adams',
        url: 'https://en.wikipedia.org/wiki/The_Hitchhiker%27s_Guide_to_the_Galaxy',
        likes: 42
    }
]

const nonExistingId = async () => {
    const blog = new Blog({ content: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = { initialblogs, nonExistingId, blogsInDb }