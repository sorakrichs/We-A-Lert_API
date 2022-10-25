

const firebase = require("firebase-admin");
const serviceAccount = require("../firebase-service-account.json");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://wealert-59dcf-default-rtdb.asia-southeast1.firebasedatabase.app'
});



const userTokens = new Map();
const userLocation = new Map();

const user = {};

user.tokenList = userTokens;
user.locationList = userLocation;

user.setToken = (data) => {

    return new Promise((resolve, reject) => {
        if(typeof data != "object"){ reject(new Error ('user.setUserToken: data must be object')) }
        else
        {      
            userTokens.set(data.userid,{role: data.role,token: data.token});
            resolve(true);
            return;
        }
    })
}


user.getToken = (id) => {

    return new Promise((resolve, reject) => {
        if(typeof id != "string"){  reject(new Error ('user.getToken: id must be string')) }
        else
        { 
            let token = userTokens.get(id);
            return token ? resolve(token) : resolve(null)
        }
    })


}

user.removeToken = (id) => {

    return new Promise((resolve, reject) => {
        if(typeof id != "string"){  reject(new Error ('user.getToken: id must be string')) }
        else
        { 
            userTokens.delete(id);
            userLocation.delete(id)
            return resolve(true);
        }
    })

}

user.setLocation = (data) => {

    return new Promise((resolve, reject) => {
        if(typeof data != "object"){ reject(new Error ('user.setLocation: data must be object')) }
        else
        {   
            userLocation.set(data.userid,data.location);
            console.log(user.locationList)
            return resolve(true);
        }
    })
}


user.getLocation = (id) => {

    return new Promise((resolve, reject) => {
        if(typeof id != "string"){  reject(new Error ('user.getToken: id must be string')) }
        else
        { 
            let location = userLocation.get(id);
            return location ? resolve(location) : reject(new Error('user is not found'))
        }
    })

}



user.boardcastNotification = (payload) => {


    try {

        const values = Array.from(userTokens.values());

        const message = {
            notification: {
                title: payload.title,
                body: payload.body
            },
            tokens: values,
            data: payload.data || {},
            android: {
                notification: {
                    sound: 'default'
                },
            },
        };
        return firebase.messaging().sendMulticast(message);

    } catch (err) {
        throw err;
    }


}

user.sendNotification = (payload) => {

    try {

        if(payload.tokens.length < 1)
            return;

        const message = {
            notification: {
                title: payload.title,
                body: payload.body
            },
            tokens: payload.tokens,
            data: payload.data || {},
            android: {
                notification: {
                    sound: 'default'
                },
                priority: payload.priority || "normal"
            },

        };

        return firebase.messaging().sendMulticast(message);

    } catch (err) {

        throw err;
        
    }


}


module.exports = user;