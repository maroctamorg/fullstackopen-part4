require('express-async-errors')

const config = require('./config/env')
const { returnInternalError } = require('./config/errors')
const logger = require('./utils/logger')

const express = require('express')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const cors = require('cors')
const mongoose = require('mongoose')
const tokenParser = require('./middleware/tokenParser')
const userParser = require('./middleware/userParser')

mongoose.connect(config.MONGODB_CONNECTION_STRING)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

const app = express()
app.use(cors())
app.use(express.json())

// custom parser middleware
app.use(tokenParser)
app.use('/api/blogs', userParser)

// routers
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    if (error.name === 'MongoServerError' && returnInternalError) {
        return res.status(500).json(error)
    }

    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'invalid token' })
    }

    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    if (error.type === 'custom') {
        return res.status(error.statusCode).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

module.exports = app