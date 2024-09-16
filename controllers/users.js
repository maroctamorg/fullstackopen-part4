const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { saltRounds } = require('../config/crypto')
const { validate } = require('./validation/users_validation')

usersRouter.get('/', async (request, response) =>
    response.json(await User.find({})))

usersRouter.post('/', async (request, response) => {
    await validate(request.body)
    const user = new User( {
        ...request.body,
        passwordHash: await bcrypt.hash(request.body.password, saltRounds)
    } )
    response.status(201).json(await user.save())
})

module.exports = usersRouter