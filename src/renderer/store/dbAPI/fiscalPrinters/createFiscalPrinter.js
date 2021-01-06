const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/fiscalPrinters.db`})

export const createFiscalPrinterInBase = function(fiscalPrinter) {    
  return new Promise(function(resolve, reject){
    db.loadDatabase(function (err) { 
        db.insert(fiscalPrinter, function (err, newDoc) { 
          if (err) {
              reject(false)
          }
          resolve(newDoc)  
        });
    });  
  })
}
