const jwt = require('jsonwebtoken')

const userParser = async (request, response, next) => {
    const decodedToken = request.token === undefined
        ? undefined
        : jwt.verify(request.token, process.env.SECRET)

    request.user = decodedToken?.id
    next()
}

module.exports = userParser