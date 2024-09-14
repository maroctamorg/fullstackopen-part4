require('express-async-errors')

const config = require('./utils/config')
const logger = require('./utils/logger')

const express = require('express')
const blogsRouter = require('./controllers/blogs')

const cors = require('cors')
const mongoose = require('mongoose')

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
app.use('/api/blogs', blogsRouter)

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

module.exports = app