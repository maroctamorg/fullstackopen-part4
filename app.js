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

module.exports = app