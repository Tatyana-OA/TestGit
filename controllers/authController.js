// Actions, modular router, what each request renders
// Validation via express-validator or if-else construction

const router = require('express').Router()
const {body,validationResult} = require('express-validator')
const {isGuest, isUser} = require('../middlewares/guards')

router.get('/register', isGuest(), (req,res) => {
    res.render('register')
})

//validation and errors. If no errors, register with data taken from request
router.post('/register', isGuest(),
    body('email').isEmail().withMessage('Email must be valid.').bail(),
	body('password').matches(/[a-zA-Z0-9]/).withMessage('Password must contain only letter and numbers'),
    body('rePass').custom((value, {req}) => {
        if (value !=req.body.password) {
            throw new Error('Passwords do not match')
        }
        return true;
    }),
    async (req,res) => {
    const {errors }= validationResult(req)
    try {
        if (errors.length>0) {
            //IMPROVE MESSAGES
			throw new Error (Object.values(errors).map(e =>e.msg).join('\n'))
        }
		console.log(req.body)
		console.log(req.body.gender)
        await req.auth.register(req.body.email,req.body.password, req.body.gender)
        res.redirect('/') // change location if needed
    }
    catch (err) {
        // ctx that template will receive
        console.log(err)
        const ctx = {
            errors: err.message.split('\n'),
            userData: {
                email:req.body.email
            }
        }
        res.render('register', ctx)
    }
   
   
})
router.get('/login', isGuest(), (req,res) => {
    res.render('login')
})
router.post('/login', isGuest(), async (req,res) => {
    try {
        await req.auth.login(req.body.email,req.body.password)
        res.redirect('/')

    } catch(err) {
        const ctx = {
            errors: err.message.split('\n'),
            userData: {
                email:req.body.email
            }
        }
        res.render('login', ctx)
    }
    
})

router.get('/logout', (req,res) => {
    req.auth.logout()
    res.redirect('/')
})
module.exports = router;