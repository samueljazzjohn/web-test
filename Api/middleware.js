const jwt = require('jsonwebtoken');
const dotenv=require('dotenv')
dotenv.config()

function authenticateToken(req, res, next) {
    // console.log(req.headers)
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET_KEY , (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

module.exports = {'athenticateToken':authenticateToken}