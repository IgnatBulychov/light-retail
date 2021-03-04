var hex64 = require('hex64');

export const createTag1162 = async function (code) {
    let promise = new Promise((resolve, reject) => {
        // example 
        // 010290001900263821DrdLwa!?8HaP9
        //  44 4d 02 a3 36 9a 3d 0e 44 72 64 4c 77 61 21 3f 38 48 61 50 39


        // exapmle 2 atol onedrive
        // 010290000047583021MdEfx:Xp6YFd791802992aQIQkI7oHXmzG/mdKxzCUCKTJHXoBODdmCdM5k8Qj7gaZV2xbn66xBXGIKrtfvqPINA2jkbjyj3/O+ky6ou1NA== 
        // 44 4d 02 a3 35 7f 8a b6 4d 64 45 66 78 3a 58 70 36 59 46 64 37
        // to base64 RE0CozV/irZNZEVmeDpYcDZZRmQ3
        let raw = code
        console.log(code)
        if (code[0] == 0 && code[1] == 1 && code[16] == 2 && code[17] == 1) {
          // если GS1 Dat matrix
          let gtin = code.slice(2, 16)
          let ean13 = Number(gtin.slice(1, 14))
            console.log("gtin",gtin)

          let serialEnd = 0
          if (code.includes('')) {
            serialEnd = code.indexOf('')
          } else if (code.includes(' ')) {
            serialEnd = code.indexOf(' ')
          } else {
            serialEnd = 31
          }
          
          let serial = code.slice(18, serialEnd) 
            console.log("serial",serial)
          gtin = Number(gtin).toString(16);
          gtin = gtin.length%2 ? "0" + gtin : gtin
          let ascii = []
          for (let i = 0; i < serial.length; i++) {
            ascii.push(serial.charCodeAt(i).toString(16))          
          }
          serial = ascii.join('')

          let nomenclatureCode = hex64.toBase64("444d" + gtin.toString() + serial.toString()); 
          console.log(gtin,serial,nomenclatureCode, ean13)
          resolve({gtin,serial,nomenclatureCode, ean13})

        } else if (code.length == 29) {
            // если обычный DataMatrix
            let gtin = code.slice(0, 14)
            let ean13 = Number(gtin.slice(1, 14))
            gtin = Number(gtin).toString(16);
            gtin = gtin.length%2 ? "0" + gtin : gtin
            gtin = gtin.padStart(12, "0");

            let serialEnd = code.indexOf('')
            let serial = code.slice(14, serialEnd) 
            let ascii = []
            for (let i = 0; i < 11; i++) {
                ascii.push(serial.charCodeAt(i).toString(16))          
            }
            serial = ascii.join('') + "2020" 
            let nomenclatureCode =  hex64.toBase64("444d" + gtin.toString() + serial.toString()); 

            resolve({gtin,serial,nomenclatureCode, ean13, raw})

        } else {
          reject({
            show: true,
            type: "error",
            timeout: 1000,
            text: 'Некорректный код маркировки'
          })
          
        }
      });

    let result = await promise; // будет ждать, пока промис не выполнится 

    return result; 
  }