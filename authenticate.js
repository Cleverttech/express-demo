function auth(req, res, next) {
    console.log('Authentificating ...')
     next()
};
module.exports = auth;