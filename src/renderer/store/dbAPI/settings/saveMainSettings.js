const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/settings.db`})

export const saveMainSettingsInBase = function(settings) {  
  return new Promise(function(resolve, reject){
    db.loadDatabase(function (err) { 
        db.update({  oneNote: "constant" }, { $set: { 
              taxationTypeDefault: settings.taxationTypeDefault
            } }, { multi: true }, function (err, numReplaced) {
            if (err) {
                reject(false)
            }
            resolve(numReplaced)  
        });
    });    
  })
}
  
