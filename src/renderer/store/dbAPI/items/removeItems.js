const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/items.db`})

export const removeItemsFromBase = function(items) {
    return new Promise(function(resolve, reject){
        db.loadDatabase(function (err) { 
            items.forEach(function(item, i, arr) {
                db.remove({ _id: item._id }, {}, function (err, numRemoved) {
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
