const dummy = () => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
    let favorite = blogs[0]
    blogs.forEach(blog => {
        favorite = blog.likes > favorite.likes ? blog : favorite
    })
    return favorite
}

const mostBlogs = (blogs) => {
    let authors = []
    blogs.forEach(blog => {
        if (authors.find(author => author.author === blog.author)) {
            authors.find(author => author.author === blog.author).blogs += 1
        } else {
            authors.push({ author: blog.author, blogs: 1 })
        }
    })
    let mostBlogs = authors[0]
    authors.forEach(author => {
        mostBlogs = author.blogs > mostBlogs.blogs ? author : mostBlogs
    })
    return mostBlogs
}

const mostLikes = (blogs) => {
    let authors = []
    blogs.forEach(blog => {
        if (authors.find(author => author.author === blog.author)) {
            authors.find(author => author.author === blog.author).likes += blog.likes
        } else {
            authors.push({ author: blog.author, likes: blog.likes })
        }
    })
    let mostLikes = authors[0]
    authors.forEach(author => {
        mostLikes = author.likes > mostLikes.likes ? author : mostLikes
    })
    return mostLikes
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }