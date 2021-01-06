<template>
  <v-card>
    <v-card-title>
      Добавление нового сканера
    </v-card-title>
    <v-card-text>
      <!--
      <div v-if="ports.length">
        <v-select
          :items="ports"
          label="COM-порт"
          v-model="port"
        ></v-select> 
      </div>
      <div v-else>
        Устройства не обнаружены. Проверьте установлен ли драйвер USB-COM для сканера.
      </div>-->
    </v-card-text>
      <v-card-actions>
         <v-text-field v-model="scanner.settings.port"></v-text-field>
            <v-tooltip bottom>
             
        <template v-slot:activator="{ on, attrs }">
        <v-btn
            v-bind="attrs" v-on="on"
            color="success"
            dark
            icon
            @click.stop="createScanner()"
        >
            <v-icon>mdi-content-save-outline</v-icon> 
        </v-btn>
        </template>
        <span>Добавить сканер</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script>

const SerialPort = require('serialport')
export default {
    name: 'scanner-settings',
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
            
      ports: [],
      port: "COM1",
        }
    },
    mounted() {
    /*    let ports = []
    SerialPort.list().then(  portsFromSerial => {
        let list = []
        portsFromSerial.forEach(port => {
          list.push({
            text: port.path + " " + port.locationId,
            value: port.path
          })
        })
        if (list.length) {
          this.ports = list
        } else {
          this.ports = list
        }
      },
      err =>  {
        this.ports = list
      }
    )*/
    },
    methods: {
        createScanner() {
           // this.scanner.settings.port = this.port
            this.$emit('save-scanner', this.scanner)
        }
    }
}
</script>