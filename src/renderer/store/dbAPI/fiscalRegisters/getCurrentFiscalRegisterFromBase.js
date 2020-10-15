
export const getCurrentFiscalRegisterFromBase = function(db) {
    return new Promise(function(resolve, reject){
        db.find({}, function (err, docs) {
            if (err) {
              reject(err)
            } 
            if (docs.length) {
              resolve(docs[0])
            } else {
              resolve([])
            }   
          });
    })
  }

  