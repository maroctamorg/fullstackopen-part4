require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING

module.exports = {
    MONGODB_CONNECTION_STRING,
    PORT
}