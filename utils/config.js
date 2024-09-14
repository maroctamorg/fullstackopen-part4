require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_CONNECTION_STRING = process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_CONNECTION_STRING
    : process.env.TEST_MONGODB_CONNECTION_STRING

module.exports = {
    MONGODB_CONNECTION_STRING,
    PORT
}