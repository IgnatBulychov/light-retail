export const addFiscalRegisterToBase = function(db, [ settings, serial ]) {
    return new Promise(function(resolve, reject){
        db.insert({ model: 'Атол', serial: serial, settings: settings } , function (err, newDoc) {
            if (err) {
                reject(false)
            }
            db.persistence.compactDatafile();
            resolve(newDoc)  
        });
    })
}
