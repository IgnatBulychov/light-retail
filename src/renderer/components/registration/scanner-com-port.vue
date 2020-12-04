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
    });
});

const SerialPort = require('serialport')
import { getEquipmentFromBase } from '../../store/dbAPI/equipment/getEquipment'
let scanners = 
scanners.find(equipment => equipment.active == true).settings.port
const port = new SerialPort('COM6', {
  baudRate: 115200
})

port.on('data', function(data) {
  let string = ""
  data.forEach(element => {
    
    string = string + String.fromCharCode(element)
  });
  var ioClient = require('socket.io-client')('http://localhost:3001');
  ioClient.emit('SEND_MESSAGE', string);
});



import ioClientVue from 'socket.io-client';
export default {
    name: 'scanner-com-port',
    data() {
        return {
            socket : ioClientVue('localhost:3001')
        }
    },
    created() {
       let app = this
        this.socket.on('MESSAGE', (data) => {
            console.log(data)
            app.$emit('scan', data)
       });
  
    },
    mounted() {
       // this.socket.emit('SEND_MESSAGE', 'сообщ');
    },
    methods: {
    }
    

}
</script>