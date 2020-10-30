const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/suppliers.db`})

export const removeSupplierFromBase = function(id) {
    return new Promise(function(resolve, reject){
        db.loadDatabase(function (err) { 
            db.remove({ _id: id }, {}, function (err, numRemoved) {
                if (err) {
                    reject(err)
                } 
                resolve(numRemoved)           
            });
        });
    })
}
