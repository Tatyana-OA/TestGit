// Guards check if token was parsed and user was put into request
function isUser() {
   return (req,res,next) => {
    if (req.user) {
        next()
    } else {
        res.redirect('/auth/login')
    }
   }
   
}

function isGuest() {
    return(req,res,next) => {
        if (!req.user) {
            next()
        } else {
            res.redirect('/')
        }
    }
} 

module.exports = {
    isUser,
    isGuest
}