<template>
<div>
  LiteRetail <br>
  Версия : {{version}} 

  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-hover v-slot="{ hover }" >
          <div @click="$router.push('/dashboard/registration?folder=root')">
            <v-card :elevation="hover ? 16 : 2">
              <v-img
                src="static/imgs/landing/registration.jpg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="170px"
              >
                <v-card-title>РЕГИСТРАЦИЯ <br> ПРОДАЖ</v-card-title>
              </v-img>
            </v-card>         
          </div>
        </v-hover>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-hover v-slot="{ hover }" >
          <div @click="$router.push('/dashboard/reports')">
            <v-card :elevation="hover ? 16 : 2">
              <v-img
                src="static/imgs/landing/reports.jpg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="170px"
              >
                <v-card-title>ОТЧЕТЫ</v-card-title>
              </v-img>
            </v-card>         
          </div>
        </v-hover>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-hover v-slot="{ hover }" >
          <div @click="$router.push('/dashboard/items?folder=root')">
            <v-card :elevation="hover ? 16 : 2">
              <v-img
                src="static/imgs/landing/items.jpg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="170px"
              >
                <v-card-title>ТОВАРЫ <br> И УСЛУГИ</v-card-title>
              </v-img>
            </v-card>         
          </div>
        </v-hover>
      </v-col>
      <v-col cols="3">
        <v-hover v-slot="{ hover }" >
          <div @click="$router.push('/dashboard/customers')">
            <v-card :elevation="hover ? 16 : 2">
              <v-img
                src="static/imgs/landing/customers.jpg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="170px"
              >
                <v-card-title>КЛИЕНТЫ</v-card-title>
              </v-img>
            </v-card>         
          </div>
        </v-hover>
      </v-col>
      <v-col cols="3">
        <v-hover v-slot="{ hover }" >
          <div @click="$router.push('/dashboard/suppliers')">
            <v-card :elevation="hover ? 16 : 2">
              <v-img
                src="static/imgs/landing/suppliers.jpg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="170px"
              >
                <v-card-title>ПОСТАВЩИКИ</v-card-title>
              </v-img>
            </v-card>         
          </div>
        </v-hover>
      </v-col>
    </v-row>
     <v-row>
      <v-col cols="3">
        <v-hover v-slot="{ hover }" >
          <div @click="$router.push('/dashboard/settings')">
            <v-card :elevation="hover ? 16 : 2">
              <v-img
                src="static/imgs/landing/settings.jpg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="170px"
              >
                <v-card-title>НАСТРОЙКИ</v-card-title>
              </v-img>
            </v-card>         
          </div>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>

          
</div>
</template>

<script>

/*
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
    */
  export default {
    name: 'landing',
    
    data() {
      return {
        version: require('../../../package.json').version
      }
    },
    methods: {
     /* getList() {
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
      }*/
      } 
    
    
  }
</script>

<style>
  
</style>
