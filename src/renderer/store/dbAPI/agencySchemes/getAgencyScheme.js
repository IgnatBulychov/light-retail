const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/agencySchemes.db`})

export const getAgencySchemeFromBase = function(id) {
    return new Promise(function(resolve, reject){
        db.loadDatabase(function (err) { 
            db.findOne({ _id: id }, {}, function (err, doc) {
              console.log('найдена агентская схема', doc)
                if (err) {
                    reject(err) 
                  }      
                  if (doc) {
                    resolve(doc)
                  } else {
                    resolve(null)
                  }       
            });
        });
    })
}
