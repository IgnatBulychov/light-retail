const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/agencySchemes.db`})

export const createAgencySchemeInBase = function(agencyScheme) {    
  return new Promise(function(resolve, reject){
    db.loadDatabase(function (err) { 
        agencyScheme.supplier = agencyScheme.supplier._id
        db.insert(agencyScheme, function (err, newDoc) { 
          if (err) {
              reject(false)
          }
          resolve(newDoc)  
        });
    });  
  })
}
