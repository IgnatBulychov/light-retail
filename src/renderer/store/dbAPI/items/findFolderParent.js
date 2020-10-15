const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/folders.db`})

export const findFolderParent = function(folder) {
  return new Promise(function(resolve, reject){  
    db.loadDatabase(function (err) { 
      db.findOne({ _id: folder }, function (err, doc) {
        if (err) {
          reject(err) 
        }      
        if (doc) {
          resolve(doc.parent)
        } else {
          resolve(null)
        }   
      });
    }); 
  })
}
  