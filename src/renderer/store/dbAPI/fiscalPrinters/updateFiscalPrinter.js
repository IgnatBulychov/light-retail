const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/fiscalPrinters.db`})

export const updateFiscalPrinterInBase = function(fiscalPrinter) {  
  return new Promise(function(resolve, reject){
    let active = fiscalPrinter.active ? false : true
    db.loadDatabase(function (err) { 
      db.update({ _id: fiscalPrinter._id }, { $set: { 
        active: active,
      } }, { multi: true }, function (err, numReplaced) {
      if (err) {
          reject(false)
      }             
      resolve()
      });
    });    
  })
}
  
