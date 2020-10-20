const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/settings.db`})

export const updateSettingsInBase = function(settings) {  
  return new Promise(function(resolve, reject){
    db.loadDatabase(function (err) { 
        db.update({  oneNote: "constant" }, { $set: { 
              taxationTypeDefault: settings.taxationTypeDefault,
              selectedFR: settings.selectedFR,
            } }, { multi: true }, function (err, numReplaced) {
            if (err) {
                reject(false)
            }
            resolve(numReplaced)  
        });
    });    
  })
}
  
