const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/items.db`})

import { getFolderByID } from './getFolderByID';

export const getItemFromBaseByBarcode = function(inputCode) {
  return new Promise(function(resolve, reject){  
    db.loadDatabase(function (err) {       
      db.findOne({ barcode: Number(inputCode) }, function (err, item) {
        if (err) {
          reject(err) 
        }      
        if (item) {
          getFolderByID(item).then((parent) => {
            item.taxationType = parent.taxationType
            resolve(item)
          })          
        } else {
          resolve(null)
        }   
      });
    }); 
  })
}
  