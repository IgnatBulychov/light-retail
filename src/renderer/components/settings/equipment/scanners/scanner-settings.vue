<template>
  <v-card>
    <v-card-title>
      Добавление нового сканера
      <v-spacer></v-spacer>
      <v-btn @click="updatePorts()"
              icon
              color="green"
            >
              <v-icon>mdi-cached</v-icon>
        </v-btn>
    </v-card-title>
   <v-card-text>
      
      <div v-if="ports.length">
        <v-select
          :items="ports"
          label="COM-порт"
          v-model="scanner.settings.port"
        ></v-select> 
      </div>
      <div v-else>
        Устройства не обнаружены. Проверьте подключение, наличие драйвера USB-COM и нажмите "Обновить".
      </div>
    </v-card-text>
      <v-card-text> 
      <!--   <v-select
          :items="ports"
          label="COM-порт"
          v-model="scanner.settings.port"
        ></v-select> -->
 </v-card-text>
        <v-card-actions>
          
      <v-spacer></v-spacer>     
      <v-btn color="green darken-5" class="text-center" text  @click.stop="createScanner()">Добавить сканер</v-btn>
    </v-card-actions>

<alert :alert="alert"/>
          
  </v-card>
</template>

<script>
import Alert from '../../../alerts/alert'
import comPorts from '../resources/comPorts.js'
const SerialPort = require('serialport')
export default {
    name: 'scanner-settings',
    components: {
      Alert
    },
    data() {
        return {
            scanner: {
                model: '',
                serial: '',
                active: true,
                type: 'Сканер',
                settings: {
                    port: 'COM1'
                }
            },
             alert: {
            show: false,
            timeout: 2000,
            type: "success",
            text: ''
          },
            
      ports: []
        }
    },
    mounted() {
     this.updatePorts()   
    },
    methods: {
      updatePorts() {
         let app = this
        SerialPort.list().then(  portsFromSerial => {
          console.log(portsFromSerial)
            let list = []
            portsFromSerial.forEach(port => {
              list.push({
                text: port.path + " " + port.manufacturer,
                value: port.path
              })
            })
            if (list.length) {
              app.ports = list
            } 
          },
          err =>  {
            
          } )
      },
        createScanner() {
           // this.scanner.settings.port = this.port
            this.$emit('save-scanner', this.scanner)
            this.alert = {
            show: true,
            timeout: 4000,
            type: "Чтобы изменения вступили в силу, перезагрузите программу",
            text: ''
          }
        }
    }
}
</script>