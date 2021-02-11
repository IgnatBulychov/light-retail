const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/items.db`})

import { getFolderByID } from './getFolderByID';
import { getSettingsFromBase } from '../settings/getSettings'

export const getItemFromBaseByBarcode = function(inputCode) {
  return new Promise(function(resolve, reject){  
    db.loadDatabase(function (err) { 
      db.findOne({ barcodes: Number(inputCode) }, function (err, item) { 
        if (err) {
          reject(err) 
        }   
        if (item) {
          console.log('!44!!',item)
        resolve(item)   
      /*  
          if (item.parent == "root") {
            getSettingsFromBase().then((settings) => {
              item.taxationType = settings.taxationTypeDefault
              resolve(item)
            })
          } else {
            getFolderByID(item).then((parent) => {
              //если в папке не задана СНО
              if (parent.taxationType) {
                item.taxationType = parent.taxationType
                resolve(item)
              } else {
                getSettingsFromBase().then((settings) => {
                  item.taxationType = settings.taxationTypeDefault
                 
                })
              }              
            }) 
          }   */                
        } else {
          resolve(null)
        }   
      });
    }); 
  })
}
  