const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/items.db`})

export const getItemsBySearchFromBase = function(searchQuery) {
  return new Promise(function(resolve, reject){  
    db.loadDatabase(function (err) { 
      console.log('query', searchQuery)
      let regex = new RegExp(searchQuery, 'i');
      db.find({ $or: [{ title: { $regex: regex } }, { vendorCode: Number(searchQuery)  }] }, function (err, items) { 
        if (err) {
          reject(err) 
        }   
        if (items.length) {    
          resolve(items)
        } else {
          resolve(null)
        } 
      });
    }); 
  })
}
  