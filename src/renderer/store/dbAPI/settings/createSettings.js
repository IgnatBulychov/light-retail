const remote = require('electron').remote
const application = remote.app

var Datastore = require('nedb')
var db = new Datastore({ filename: `${application.getPath('userData')}/settings.db`})

export const createSettingsInBase = function() {    
    return new Promise(function(resolve, reject){
        db.loadDatabase(function (err) { 
            db.insert({
                oneNote: "constant", // просто заметка для поиска этого поля
                taxationTypeDefault: null,
                fiscalPrinter: {
                    model: '', 
                    serial: "", 
                    settings: {
                        model:"LIBFPTR_MODEL_ATOL_AUTO",
                        connection:"LIBFPTR_PORT_TCPIP",
                        comFile:"COM1",
                        baudRate:"LIBFPTR_PORT_BR_115200",
                        IPAddress:"192.168.0.13",
                        IPPort:5555
                    }                    
                }
            }, function (err, newDoc) { 
                if (err) {
                    reject(false)
                }
                resolve(newDoc)  
            });
        });  
    })
}
