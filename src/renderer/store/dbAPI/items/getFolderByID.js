const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/folders.db`})

export const getFolderByID = function(item) {  
  return new Promise(function(resolve, reject){
    db.loadDatabase(function (err) { 
      db.findOne({ _id: item.parent}, function (err, doc) {
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
  