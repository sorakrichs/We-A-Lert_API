

const user = require('./userController')
const geo = {};

const getDistanceFromLatLon = (lat1,lon1,lat2,lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
const deg2rad = (deg) => {
    return deg * (Math.PI/180)
}

geo.getDistance = (clat,clon) => {
  return new Promise((resolve, reject) => {
    
    if(typeof clat != 'number'){ reject(new Error ('geo.searchUserinRange: clat mustbe Number')) }
    else if(typeof clon != 'number'){ reject(new Error ('geo.searchUserinRange: clon mustbe Number')) }
    else
    {
        let tokenArray = [];
        user.locationList.forEach((value,key) => {

          tokenArray.push({key:key,lat:value.lat,lon:value.lon,range:getDistanceFromLatLon(clat,clon,value.lat,value.lon)})
              

        })

        resolve (tokenArray);

    }
  });

}

geo.setUserLocation = (data) => {
  return new Promise((resolve, reject) => {
    if(typeof data != "object"){ reject(new Error ('geo.setUserLocation: data must be object')) }
    else
    {
      user.locationList.set(data.userid,data.location);
      console.log(user.locationList);
    }
  });

}

geo.searchUserinRange = (range,clat,clon,role,searcherId) => {
  return new Promise((resolve, reject) => {
    if(typeof range != 'number'){ reject(new Error ('geo.searchUserinRange: range mustbe Number')) }
    else if(typeof clat != 'number'){ reject(new Error ('geo.searchUserinRange: clat mustbe Number')) }
    else if(typeof clon != 'number'){ reject(new Error ('geo.searchUserinRange: clon mustbe Number')) }
    else
    {
        let tokenArray = [];
        user.locationList.forEach((value,key) => {

            if((getDistanceFromLatLon(clat,clon,value.lat,value.lon) * 1000) < range && key != searcherId)
              user.getToken(key).then( result => {
                if(result.role == role || role == 'all') 
                  tokenArray.push(result.token)

              });
              

        })

        resolve (tokenArray);

    }
  });

}


module.exports = geo;