<template>
<div>
  LiteRetail <br>
  Версия : {{version}} 
</div>
</template>

<script>

const SerialPort = require('serialport')
const port = new SerialPort('COM5', {
  baudRate: 115200
})

 port.on('data', function(data) {
   console.log(data)
   let string = ""
   data.forEach(element => {
     if (String.fromCharCode(element) == '') console.log('oooooooooooo')
     string = string + String.fromCharCode(element)
   });
   
      console.log(string)
      
    });
    
  export default {
    name: 'landing',
    
    data() {
      return {
        version: require('../../../package.json').version
      }
    },
    methods: {
      getList() {
        SerialPort.list().then(
         
  ports => {
    ports.forEach(console.log);
    console.log(ports);
     console.log('111');
    },
  err =>  {
    console.log('err');
    console.error(err)
    }
)
      }
      } 
    
    
  }
</script>

<style>
  
</style>
