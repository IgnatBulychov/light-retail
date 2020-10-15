export const deleteFiscalRegisterFromBase = function(db,id) {
    return new Promise(function(resolve, reject){
        db.remove({ _id: id }, {}, function (err, numRemoved) {
            if (err) {
                reject(err)
            } 
            console.log(id)
            db.persistence.compactDatafile();
            resolve(numRemoved)
        });
    })
}
