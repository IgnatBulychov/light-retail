
export const getCurrentFRSettings = function(db, id) {
    return new Promise(function(resolve, reject){
        db.find({ _id: id }, function (err, docs) {
            if (err) {
              reject(err)
            } 
            resolve(docs[0])
        });
    })
  }

  