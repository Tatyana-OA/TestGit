const express = require('express')
const cookieParser = require('cookie-parser')
const hbs = require('express-handlebars')

const authMiddleware = require('../middlewares/auth');
const storageMiddleware = require('../middlewares/storage');



module.exports = (app) => {
    //handlebars
    app.engine('hbs',hbs({
        extname: '.hbs'
    }))
    app.set('view engine', 'hbs')
    //static files path, body-parser and cookie parser
    app.use('/static',express.static('static'))
    app.use(express.urlencoded({extended:true}))
    app.use(cookieParser())
    app.use(authMiddleware())
	app.use(storageMiddleware())

    //LOGGER

    app.use((req,res,next) => {
        console.log('>>>', req.method,req.url);
        if (req.user) {
            console.log(`Known user ${req.user.username}`)
        }
        next()
    })
}