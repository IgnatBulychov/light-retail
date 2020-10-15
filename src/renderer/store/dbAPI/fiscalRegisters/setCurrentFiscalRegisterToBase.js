export const setCurrentFiscalRegisterToBase = function(db, id) {
    return new Promise(function(resolve, reject){

        db.find({}, function (err, docs) {
            if (err) {
              reject(err)
            } 
            if (docs.length) {
                db.update({ _id: docs[0]._id }, { $set: { currentFR: id } }, { multi: true }, function (err, numReplaced) {
                    if (err) {
                        reject(false)
                    }
                    db.persistence.compactDatafile();
                    resolve(numReplaced)  
                });
            } else {
                db.insert({ currentFR: id } , function (err, newDoc) {
                    if (err) {
                        reject(false)
                    }
                    db.persistence.compactDatafile();
                    resolve(newDoc)  
                });
            }   
          });

        
    })
}
