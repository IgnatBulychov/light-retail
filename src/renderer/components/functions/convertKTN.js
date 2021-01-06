export const convertKTN = async function (code) {
    let promise = new Promise((resolve, reject) => {
        // example 
        // 010290001900263821DrdLwa!?8HaP9
        //  44 4d 02 a3 36 9a 3d 0e 44 72 64 4c 77 61 21 3f 38 48 61 50 39
        console.log(code)
        if (code[0] == 0 && code[1] == 1 && code[16] == 2 && code[17] == 1) {
          // если GS1 Dat matrix
          let gtin = code.slice(2, 16)
          let ean13 = Number(gtin.slice(1, 14))
            console.log("gtin",gtin)

          let serialEnd = code.indexOf('')

          let serial = code.slice(18, serialEnd) 
            console.log("serial",serial)
          gtin = Number(gtin).toString(16);
          gtin = gtin.length%2 ? "0" + gtin : gtin
          let ascii = []
          for (let i = 0; i < serial.length; i++) {
            ascii.push(serial.charCodeAt(i).toString(16))          
          }
          serial = ascii.join('')

          let nomenclatureCode = "444d" + gtin.toString() + serial.toString()

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
            let nomenclatureCode = "444d" + gtin + serial

            resolve({gtin,serial,nomenclatureCode, ean13})

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