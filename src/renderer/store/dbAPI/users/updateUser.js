const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/users.db`})

export const updateUserInBase = function(user) {  
  return new Promise(function(resolve, reject){
    db.loadDatabase(function (err) { 
      console.log(user)
      db.update({ _id: user._id }, { $set: { 
            name: user.name,
            password: user.password,
            vatin: user.vatin,
            role: user.role,
          } }, { multi: true }, function (err, numReplaced) {
          if (err) {
              reject(false)
          }
          resolve(numReplaced)  
      });
    });    
  })
}
  
