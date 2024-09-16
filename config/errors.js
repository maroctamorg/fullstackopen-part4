const returnInternalError = ['test', 'development'].includes(process.env.NODE_ENV)

module.exports = { returnInternalError }