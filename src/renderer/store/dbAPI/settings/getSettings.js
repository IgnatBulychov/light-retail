const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/settings.db`})

export const getSettingsFromBase = function() {  
  return new Promise(function(resolve, reject){
    db.loadDatabase(function (err) { 
      db.find({}, function (err, docs) {
        if (err) {
          reject(err) 
        } 
        if (docs.length) {
          resolve(docs[0])
        } else {
          resolve(null)
        }   
      });
    });    
  })
}
  