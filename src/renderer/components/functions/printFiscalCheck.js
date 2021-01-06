
let {PythonShell} = require('python-shell')

export const printFiscalCheck = async function (options) {
    let promise = new Promise((resolve, reject) => {

      console.log(options)
        
        PythonShell.run('json_task.py', options, function (err, results) {
          if (err) throw err;
    
          console.log(results)

          if (results[0] == 'connectionFailed') {
            resolve({
              show: true,
              timeout: 3000,
              type: "error",
              text: 'Нет связи с кассой'
            })
          } else if (results[0] == 'error') {
            resolve({
              show: true,
              timeout: 3000,
              type: "error",
              text: 'Неверная команда'
            })
          } else if (results[0] == '""') {
            resolve({
              show: true,
              timeout: 3000,
              type: "success",
              text: 'Операция выполнена'
            })
            app.stopLoading()
          } else {
            resolve({
              show: true,
              timeout: 3000,
              type: "success",
              text: 'Операция выполнена'
            })
          }
        });    
      })
    let result = await promise; // будет ждать, пока промис не выполнится 

    return result; 

}