const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        // If headers have been sent, delegate to the default Express error handler
        return next(err);
    }

    const statusCode = res.statusCode ? res.statusCode : 500 
    res.status(statusCode); 
    res.json({ message: err.message })
}

module.exports = { errorHandler } 
