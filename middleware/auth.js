const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ error: 'Missing auth token' })
    }

    const token = authHeader.split(' ')[1]


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        console.error(err)
        return res.status(401).send({ error: 'Invalid auth token' })
    }
}

module.exports = authMiddleware