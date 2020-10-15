const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/items.db`})

export const findFolderItems = function(folders) {
  return new Promise(function(resolve, reject){
    let queryData = []
    folders.forEach(folder => {
      queryData.push(
        {
          parent: folder
        }
      )
    });  
    db.loadDatabase(function (err) {    
       
      db.find({ $or: queryData }, function (err, docs) {
        if (err) {
          reject(err)
        } 
        if (docs.length) {  
          resolve(docs)
        } else {
          resolve([])
        }   
      });
    }); 
  })
}
  