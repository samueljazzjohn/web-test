var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors=require('cors')
var connectDB=require('./config/dbconnection')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt=require('jsonwebtoken')
const userModel = require('./models/userModel');
dotenv.config();

var app = express();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

connectDB

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Endpoint for login action
app.get('/login', function(req, res, next) {
    console.log(req.query.email)
    userModel.findOne({email:req.query.email}).then((doc)=>{
        console.log(doc)
        if(doc==null) return res.status(401).json({'message':"please enter currect data"})
        if(req.query.password !== doc.password) return res.status(403).json({"message":"incorrect password"})

        let data = {
            userId: doc._id,
            email: doc.email
          }

        const token = jwt.sign(data, process.env.JWT_SECRET_KEY,{ expiresIn: '20s' });

        doc={...doc,token:token}
        console.log("data",data)
        res.status(200).json({doc})
    }).catch((err)=>{
        res.status(400).json({"message":err})
    })
  });


//   Endpoint for verifiying if session expired or not
  app.get('/check-session',(req,res,next)=>{
    console.log("second:",req.headers.authorization.split(' ')[1])
    const Bearer = req.headers.authorization.split(' ')[1]
    try {
        const decoded = jwt.verify(Bearer, process.env.JWT_SECRET_KEY);
        const isExpired = Date.now() >= decoded.exp * 1000; // check if current time is after expiration time
        if (isExpired) {
          console.log('JWT has expired');
          return res.status(401).json({"message":"Expired"})
        } 
        return res.status(200).json({"message":"successfull"})
      } catch (err) {
        console.error('Failed to verify JWT:', err.message);
        return res.status(401).json({"message":"failed to validate"})
      }
  })


module.exports = app;