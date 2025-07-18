const isAdmin = (req, res, next) => {
    if (req.session && req.session.token) {
        next()
    } else {
        res.redirect('/')
    }
}

module.exports = { isAdmin };