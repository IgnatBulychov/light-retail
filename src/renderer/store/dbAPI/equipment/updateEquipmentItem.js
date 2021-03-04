const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/equipment.db`})

export const updateEquipmentItemInBase = function(equipment) {  
  return new Promise(function(resolve, reject){
    db.loadDatabase(function (err) { 
      db.update({ _id: equipment._id }, { $set: { 
            active: equipment.active,
          } }, { multi: true }, function (err, numReplaced) {
          if (err) {
              reject(false)
          }
          resolve(numReplaced)  
      });
    });    
  })
}
  
