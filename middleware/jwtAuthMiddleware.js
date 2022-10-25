const passport = require('../controllers/jwtController');

const jwtAuthMiddleware = passport.authenticate("jwt", { session: false });


module.exports = jwtAuthMiddleware;

