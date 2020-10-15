<template>
    
    <v-card>
        <v-card-title>

          
          Добавление позиции по свободной цене
        </v-card-title>
        <v-card-text>
        <v-container>
    <v-row>
      <v-col
          cols="6"
      >
    <v-select
          :items="models"
          v-model="settings.model"
          label="Модель ККТ"
    ></v-select>
    </v-col>
    <v-col
          cols="6"
      >
    <v-select
          :items="connections"
          v-model="settings.connection"
          label="Тип соеединения"
    ></v-select>
    </v-col>
    <v-col
          cols="6"
      >
    <v-select
          :items="comPorts"
          v-model="settings.comFile"
          label="COM-порт"
    ></v-select>
     </v-col>
    <v-col
          cols="6"
      >
    <v-select
          :items="baudrates"
          v-model="settings.baudRate"
          label="Скорость"
    ></v-select>
     </v-col>
    <v-col
          cols="6"
      >
    <v-text-field
        v-model="settings.IPAddress"
        label="IP адрес"
    ></v-text-field>
     </v-col>
    <v-col
          cols="6"
      >
    <v-text-field
        v-model="settings.IPPort"
        label="Порт"
    ></v-text-field>
 </v-col>



    </v-row>
  </v-container>
                
               
              
    
        <v-card-actions>
              

          <v-btn color="blue lighten-1" text @click="connectionTest">Добавить в чек</v-btn>
         
          
        </v-card-actions>



            </v-card-text>
      </v-card>
</template>

<script>

  export default {
    name: 'add-free',

    data() {
      return {
      }
    },
    methods: {
      
    
    }
  }
</script>