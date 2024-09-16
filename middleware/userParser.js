const jwt = require('jsonwebtoken')

const userParser = async (request, response, next) => {
    console.log('request.token:', request.token)
    const decodedToken = request.token === undefined
        ? undefined
        : jwt.verify(request.token, process.env.SECRET)

    console.log('decodedToken:', decodedToken)
    request.user = decodedToken?.id
    next()
}

module.exports = userParser