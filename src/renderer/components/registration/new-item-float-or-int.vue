<template>
  <div>
    <v-dialog eager 
      @keydown.esc="closeDialogSettingFloatMeasure()"
      max-width="50%"
      v-model="dialogSettingFloatMeasure"  
      v-on:click:outside="closeDialogSettingFloatMeasure"
    >
    <div @click.prevent="$refs.itemQuantity.focus()">
    <v-card>
      <v-card-title>
        <span class="text-lg-h6">
          Укажите количество
        </span> 
        <v-spacer></v-spacer>
          <v-btn icon @click="closeDialogSettingFloatMeasure()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
         <v-form @submit.prevent="setFloatMeasure()">
        <v-card-text>          
          <v-text-field
            ref="itemQuantity"
            color="green"
            label="Количество"
            v-model="quantity"
            :rules="quantityRules"
            v-on:keyup.enter="setFloatMeasure()"
          ></v-text-field>   
      
        </v-card-text>
        <v-card-actions>    
           <v-spacer></v-spacer>
      
          <v-btn type="submit" width="40%" height="50px" dark color="green lighten-2">
              <v-chip class="ma-2" color="gray" label dark text-color="white">
                <v-icon> mdi-keyboard </v-icon> Enter
              </v-chip> Ок        
            </v-btn>
             <v-spacer></v-spacer>          
        </v-card-actions>
        </v-form>
      </v-card>
      </div>
    </v-dialog>
  </div>
</template>

<script>

export default {
    name: 'new-item-float-or-int',
    data() {
        return {
          quantity: "",
               dialogSettingFloatMeasure: false
        }
    },
    computed: {
      item() {
        return this.$store.state.itemAdditionManager.item
      },
      quantityRules() {      
        if (isNaN(Number(this.quantity))) {
          return [v => v > 0 || 'Некорректное значение']
        } else {
          if (this.quantity == "") {
            return []  
          } else {
          return [v => v > 0 || 'Некорректное значение']
          }              
        }      
      },
      liveStep() {        
        return this.$store.getters['itemAdditionManager/getLiveStep']
      },      
    },
    watch: {
      "liveStep": function() {    
        if (this.liveStep == 'created') {
          console.log("Item was Created", this.item)
          if (this.item.measureType == "integer") {
            this.$store.commit('itemAdditionManager/setQuantity', 1)
            console.log('setQ', this.item)
          } else if (this.item.measureType == "float") {
            this.dialogSettingFloatMeasure = true
          }
        }
      },
      "dialogSettingFloatMeasure": function() {
        if (this.dialogSettingFloatMeasure) {
          let app =this
          setTimeout(function() {app.$refs.itemQuantity.focus()}, 1) 
        }
      }
    },
    methods: {
      setFloatMeasure() {
        this.$store.commit('itemAdditionManager/setQuantity', this.quantity)
        this.quantity = ""
        this.dialogSettingFloatMeasure = false
      },
      closeDialogSettingFloatMeasure() {
        this.$store.commit('itemAdditionManager/barcodeInputFocus')
        this.$store.commit('itemAdditionManager/setLiveStep', "init")
        this.quantity = ""
        this.dialogSettingFloatMeasure = false
      }
    }
}
</script>