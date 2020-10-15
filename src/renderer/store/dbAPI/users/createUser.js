const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/users.db`})

export const createUserInBase = function(user) {    
  return new Promise(function(resolve, reject){
    db.loadDatabase(function (err) { 
        db.insert(user, function (err, newDoc) { 
          if (err) {
              reject(false)
          }
          resolve(newDoc)  
        });
    });  
  })
}
