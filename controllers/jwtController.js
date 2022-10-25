const jwt = require("jwt-simple");
const passport = require("passport");
const {userModel,ObjectId} = require('./mongodbController')
const {encryptPassword} = require("./miscController")

//ใช้ในการ decode jwt ออกมา
const ExtractJwt = require("passport-jwt").ExtractJwt;
//ใช้ในการประกาศ Strategy
const JwtStrategy = require("passport-jwt").Strategy;

const JWT_SECRET = require("../configs/cfg_key").JWT_SECRET;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
};

const jwtAuth = new JwtStrategy(jwtOptions, async (payload, done) => {
    if(payload.role){

        userModel.findOne({_id: ObjectId(payload._id)}, (err,result) => {

            if(err)
                done(err, false);

            if(result.status == 'ban')
                done(null,false)

            if(result.role == payload.role)
                done(null,result)
            else 
                done(null,false)

        })
    }
    else {
    
        if(payload.type) {
            switch(payload.type) {
                case 'forgot':
                    if(payload.access == encryptPassword(payload.iat + payload.phone + payload.exp)) {
                        done(null, true);
                    } else 
                        done(null, false);
                break;
                default:
                    done(null, false);
            }
        } else {

            done(null, false);

        }
    }
});

//เสียบ Strategy เข้า Passport
passport.use(jwtAuth);

module.exports = passport;