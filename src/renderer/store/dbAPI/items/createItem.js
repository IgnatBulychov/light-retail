const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/items.db`})

export const createItemInBase = function(item) {    
    return new Promise(function(resolve, reject){
        db.loadDatabase(function (err) { 
            db.find({}, function (err, docs) {
                if (err) {
                  reject(err) 
                } 
                if (docs.length) {

                    async function findMax(item) {
                        let max = 1;
                        docs.forEach(item => {
                            
                            if (item.code > max) {
                                max = item.code
                            }
                        });
                        return { item: item, max: max};
                    }
                      
                    findMax(item).then(result => {
                        result.item.code = result.max + 1
                        db.insert(result.item , function (err, newDoc) { 
                            if (err) {
                                reject(false)
                            }
                            resolve(newDoc)  
                        });
                    }); 
                } else {
                    item.code = 1;
                    db.insert(item , function (err, newDoc) { 
                        if (err) {
                            reject(false)
                        }
                        resolve(newDoc)  
                    });                  
                }   
              });            
        });  
    })
}
