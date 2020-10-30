<template>
    
</template>
<script>
const express = require('express');
const app = express();

const server = app.listen(3001, function() {
    console.log('server running on port 3001');
});
const ioServer = require('socket.io')(server);

ioServer.on('connection', function(socket) {
    console.log(socket.id)
    socket.on('SEND_MESSAGE', function(data) {
       ioServer.emit('MESSAGE', data)
         console.log('!!!',data)
    });
});


const SerialPort = require('serialport')
//import { getEquipmentFromBase } from '../../store/dbAPI/equipment/getEquipment'
//this.scanners.find(equipment => equipment.active == true).settings.port
const port = new SerialPort('COM6', {
  baudRate: 115200
})

ioClient('localhost:3001').emit('SEND_MESSAGE', 'сообщени');

port.on('data', function(data) {
  let string = ""
  data.forEach(element => {
    if (String.fromCharCode(element) == '') console.log('oooooooooooo')
    string = string + String.fromCharCode(element)
  });
  console.log(string)
  
import ioClient from 'socket.io-client';
  ioClient('localhost:3001').emit('SEND_MESSAGE', string);
});



export default {
    name: 'scanner-com-port',
    data() {
        return {
            socket : ioClient('localhost:3001')
        }
    },
    created() {
       
        this.socket.on('MESSAGE', (data) => {
            console.log(data)
            // you can also do this.messages.push(data)
       });
  
    },
    mounted() {
       // this.socket.emit('SEND_MESSAGE', 'сообщ');
    },
    methods: {
    }
    

}
</script>