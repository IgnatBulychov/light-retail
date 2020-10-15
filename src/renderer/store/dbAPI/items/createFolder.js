const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/folders.db`})

export const createFolderInBase = function(folder) {    
    return new Promise(function(resolve, reject){
        db.loadDatabase(function (err) { 
            db.insert(folder , function (err, newDoc) { 
                if (err) {
                    reject(false)
                }
                resolve(newDoc)  
            });
        });  
    })
}
