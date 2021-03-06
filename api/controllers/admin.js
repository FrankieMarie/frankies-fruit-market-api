const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')
const expireAmt = 60*60*24*7; //60 seconds * 60 minutes * 24 hours * 7 days = 1 week expire amt

exports.admin_signup = (req, res, next) => {
  Admin.find({email: req.body.email})
    .exec()
    .then(admin => {
      if(admin.length >= 1){
        return res.status(422).json({
          message: 'Email already exists'
        })
      }else{
        bcrypt.hash(req.body.password, 10, (err, hash)=>{
          if(err){
            return res.status(500).json({
              error: err
            })
          }else{
            const admin = new Admin({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            })
            admin.save()
              .then(result => {
                console.log(result)
                res.status(201).json({
                  message: 'Admin created'
                })
              }).catch(err => {
                console.log(err)
                res.status(500).json({
                  error: err
                })
              })
          }
        })
      }
    })
}

exports.admin_login = (req, res, next) => {
  console.log('req.body', req.body)
  Admin.find({email: req.body.email})
    .exec()
    .then(admin => {
      if(admin.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
        if(err){
          return res.status(401).json({
            message: 'Auth failed'
          })
        }
        if(result){
          const token = jwt.sign({
            email: admin[0].email,
            adminId: admin[0]._id
          }, 'secret',
          {
            expiresIn: expireAmt
          }
        )
          return res.status(200).json({
            message: 'Auth successful',
            token: { token: token, expires: Math.floor(Date.now() / 1000) + expireAmt}
          })
        }
        res.status(401).json({
          message: 'Auth failed'
        })
      })
    }).catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.admin_delete = (req, res, next) => {
  Admin.remove({_id: req.params.adminId})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Admin deleted'
      })
    }).catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}