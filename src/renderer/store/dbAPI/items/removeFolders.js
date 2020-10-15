const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/folders.db`})

export const removeFoldersFromBase = function(folders) {
    return new Promise(function(resolve, reject){
        db.loadDatabase(function (err) { 
            folders.forEach(function(folder, i, arr) {
                db.remove({ _id: folder }, {}, function (err, numRemoved) {
                    if (err) {
                        reject(err)
                    } 
                    console.log(i == arr.length-1)
                    if (i == arr.length-1) {
                        resolve(numRemoved)
                    }                
                });
            });
        });
    })
}
