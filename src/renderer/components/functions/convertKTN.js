export const convertKTN = async function (code) {
    let promise = new Promise((resolve, reject) => {
        
        
        if (code[0] == 0 && code[1] == 1 && code[16] == 2 && code[17] == 1) {
          // если GS1 Dat matrix
          let gtin = code.slice(2, 16)
          console.log("gtin",gtin)
          let serial = code.slice(18, 31) 
          console.log("serial",serial)
          gtin = Number(gtin).toString(16);
          gtin = gtin.length%2 ? "0" + gtin : gtin
          let ascii = []
          for (let i = 0; i < serial.length; i++) {
            ascii.push(serial.charCodeAt(i).toString(16))          
          }
          serial = ascii.join('')

          let nomenclatureCode = "444d" + gtin.toString() + serial.toString()

          resolve({gtin,serial,nomenclatureCode})

        } else if (code.length == 29) {
            // если обычный DataMatrix
            let gtin = code.slice(0, 14)
            gtin = Number(gtin).toString(16);
            gtin = gtin.length%2 ? "0" + gtin : gtin
            gtin = gtin.padStart(12, "0");

            let serial = code.slice(14, 25) 
            let ascii = []
            for (let i = 0; i < 11; i++) {
                ascii.push(serial.charCodeAt(i).toString(16))          
            }
            serial = ascii.join('') + "2020" 
            let nomenclatureCode = "444d" + gtin + serial

            resolve({gtin,serial,nomenclatureCode})

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