const Blog = require('../../models/blog')
const User = require('../../models/user')
const { ValidationError, AuthenticationError, AuthorizationError } = require('../../utils/errors')

const validate_token = (request) => {
    if (request.user === undefined) {
        throw AuthenticationError('token missing or invalid')
    }
}

const validate_user = async (request) => {
    validate_token(request)

    const user = await User.findById(request.user)
    if (!user) {
        throw AuthorizationError(`invalid user ${request.user} provided in jwt`)
    }
}

const validate_authorization = async (request) => {
    validate_token(request)
    validate_user(request)

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        throw ValidationError('blog not found')
    }

    if(blog.user.toString() !== request.user.toString()) {
        throw AuthorizationError(`user ${request.user} is not authorized to delete blog ${request.params.id}`)
    }
}

module.exports = { validate_token, validate_user, validate_authorization }