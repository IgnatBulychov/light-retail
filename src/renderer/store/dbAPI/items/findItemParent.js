const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/items.db`})

export const findItemParent = function(parent) {
  return new Promise(function(resolve, reject){  
    db.loadDatabase(function (err) { 
      db.findOne({ parent: parent }, function (err, doc) {
        if (err) {
          reject(err) 
        }      
        if (doc) {
          resolve(doc)
        } else {
          resolve(null)
        }   
      });
    }); 
  })
}
  