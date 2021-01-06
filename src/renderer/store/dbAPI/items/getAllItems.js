const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/items.db`})

export const getAllItemsFromBase = function() {  
  return new Promise(function(resolve, reject){
    db.loadDatabase(function (err) { 
      db.find({}, function (err, docs) {
        if (err) {
          reject(err) 
        } 
        if (docs.length) {
          resolve(docs)
        } else {
          resolve([])
        }   
      });
    });    
  })
}
  