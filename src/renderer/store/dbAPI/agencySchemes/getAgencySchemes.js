const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/base/agencySchemes.db`})

import { getSupplierFromBase } from '../suppliers/getSupplier'

export const getAgencySchemesFromBase = function() {  
  return new Promise(function(resolve, reject){
    db.loadDatabase(function (err) { 
      db.find({}, function (err, agencySchemes) {
        if (err) {
          reject(err) 
        } 
        if (agencySchemes.length) {
          for (let index = 0; index < agencySchemes.length; index++) {
            if (agencySchemes[index].supplier) {
              getSupplierFromBase(agencySchemes[index].supplier).then(supplier => {
                agencySchemes[index].supplier = supplier
              }) 
            }
            if (index == agencySchemes.length - 1) {
              resolve(agencySchemes)
            }
          }
          
        } else {
          resolve([])
        }   
      });
    });    
  })
}
  