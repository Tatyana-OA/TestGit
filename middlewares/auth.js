// Middleware that uses user.js SERVICE to perform app operations
    //Register,login, logout (incl cookies/tokens/sessions/validations)

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//To have access to db (save user) + check if user already exists etc.
const userService = require('../services/user')
const {TOKEN_SECRET,COOKIE_NAME} = require('../config')

// Middleware is a factory function that returns another with (req,res,next)
// it can be created via module.exports + empty function to use in other files
module.exports = () => (req,res,next) => {
        // TODO parse jwt
        //attach functions to context

        if (parseToken(req,res)) {
            req.auth = {
                async register(email,password,gender) {
                    // calls below-created function register
                    const token = await register(email,password,gender);
                    res.cookie(COOKIE_NAME, token)
                },
                async login(email,password) {
                    // calls below-created function login
                    const token = await login(email,password);
                    res.cookie(COOKIE_NAME, token)
                },
                logout() {
                    res.clearCookie(COOKIE_NAME)
                }
            }
    
            
            next()
        }
       
    }




async function register(email,password,gender) {
    //TODO adapt parameters to project requirements
    //TODO extra validations
    const existing = await userService.getUserByEmail(email)
    if (existing) {
        throw new Error('email is taken.')
    }

    const hashedPassword = await bcrypt.hash(password,10);
    const user = await userService.createUser(email,hashedPassword, gender)

    //TODO log in user
    return generateToken(user)

}

async function login(email,password) {
    const user = await userService.getUserByEmail(email)
	if (!user) {
        const err = new Error('No such user')
        err.type = 'credential';
        throw err;
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword)

    if (!hasMatch) {
        const err = new Error('Wrong password')
        err.type = 'credential';
        throw err;
    }

    return generateToken(user)

}


//function that creates token (logs in the user)
function generateToken(userData) {
    return jwt.sign({
        _id: userData._id,
        email: userData.email
    }, TOKEN_SECRET)
}

//read token
function parseToken(req,res) {
    const token = req.cookies[COOKIE_NAME]
    if (token) {
        try {
            const userData = jwt.verify(token,TOKEN_SECRET)
            req.user = userData
            return true;
        } catch(err) {
            res.clearCookie(COOKIE_NAME)
            res.redirect('/auth/login')
            return false;
        }
    }
    return true;
   

}