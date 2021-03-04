const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/agencySchemes.db`})

export const updateAgencySchemeInBase = function(customer) {  
  return new Promise(function(resolve, reject){
    db.loadDatabase(function (err) { 
      db.update({ _id: customer._id }, { $set: { 
            name: customer.name,
            vatin: customer.vatin,
            email: customer.email,
            phone: customer.phone,
            status: customer.status
          } }, { multi: true }, function (err, numReplaced) {
          if (err) {
              reject(false)
          }
          resolve(numReplaced)  
      });
    });    
  })
}
  
