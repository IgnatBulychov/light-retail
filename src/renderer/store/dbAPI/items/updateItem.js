const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/items.db`})

export const updateItemInBase = function(item) {  
  return new Promise(function(resolve, reject){
    db.loadDatabase(function (err) { 
      db.update({ _id: item._id }, { $set: { 
            title: item.title,
            price: item.price,
            costPrice: item.costPrice,
            barcodes: item.barcodes,
            mark: item.mark,
            measureName: item.measureName,
            measureType: item.measureType,
            tax: item.tax,
          } }, { multi: true }, function (err, numReplaced) {
          if (err) {
              reject(false)
          }
          resolve(numReplaced)  
      });
    });    
  })
}
  
