const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/dbMain.db`})

export const createSettingsInBase = function() {    
    return new Promise(function(resolve, reject){
        db.loadDatabase(function (err) { 
            db.insert({
                oneNote: "constant", // просто заметка для поиска этого поля
                defaultTaxSystem: null,
            }, function (err, newDoc) { 
                if (err) {
                    reject(false)
                }
                resolve(newDoc)  
            });
        });  
    })
}
