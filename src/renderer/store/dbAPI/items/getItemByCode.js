const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/items.db`})

export const getItemFromBaseByCode = function(inputCode) {
  return new Promise(function(resolve, reject){  
    db.loadDatabase(function (err) {       
      db.findOne({ code: Number(inputCode) }, function (err, item) {
        if (err) {
          reject(err) 
        }      
        if (item) {     
          resolve(item)
        } else {
          resolve(null)
        }   
      });
    }); 
  })
}
  