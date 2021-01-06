const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/equipment.db`})

export const createEquipmentItemInBase = function(equipment) {    
  return new Promise(function(resolve, reject){
    db.loadDatabase(function (err) { 
        db.insert(equipment, function (err, newDoc) { 
          if (err) {
              reject(false)
          }
          resolve(newDoc)  
        });
    });  
  })
}
