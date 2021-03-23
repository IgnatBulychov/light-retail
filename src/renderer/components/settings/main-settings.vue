<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
          <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
          <v-btn
              v-bind="attrs" v-on="on"
              color="success"
              dark
              icon
              @click.stop="saveMainSettings()"
          >
              <v-icon>mdi-content-save-outline</v-icon> 
          </v-btn>
          </template>
          <span>Сохранить настройки</span>
      </v-tooltip>
          
      </v-card-title>

      <v-card-text>
          <v-select
          :items="taxationTypes"
          label="СНО по умолчанию"
          v-model="taxationTypeDefaultTemp"
          ></v-select> 

          Используемые типы оплат:
      <v-checkbox
        v-model="paymentTypesDefaultTemp"
        label="Наличными"
        value="cash"
      ></v-checkbox>
      <v-checkbox
        v-model="paymentTypesDefaultTemp"
        label="Безналичными"
        value="electronically"
      ></v-checkbox>
      <v-checkbox
        v-model="paymentTypesDefaultTemp"
        label="Предоплата"
        value="prepaid"
      ></v-checkbox>
      <v-checkbox
        v-model="paymentTypesDefaultTemp"
        label="Оплата в кредит"
        value="credit"
      ></v-checkbox>
      <v-checkbox
        v-model="paymentTypesDefaultTemp"
        label="Иная форма оплаты (оплата встречным представлением)"
        value="other"
      ></v-checkbox>
      <v-checkbox
        v-model="paymentTypesDefaultTemp"
        label="Комбооплата"
        value="combo"
      ></v-checkbox>

      </v-card-text>

      

    </v-card>
  </v-container>
</template>

<script>
import taxationTypes from '../resources/taxationTypes.js'
export default {
  name: 'main-settings',
  data() {
    return {
      taxationTypes,      
      taxationTypeDefaultTemp: null,
      paymentTypesDefaultTemp: ['cash','electronically'],
      alert: {
        show: false,
        timeout: 2000,
        type: "success",
        text: ''
      },
    }
  },
  mounted() {
    this.$store.dispatch('settings/getSettings')
    this.taxationTypeDefaultTemp = this.taxationTypeDefault
    this.paymentTypesDefaultTemp = this.paymentTypesDefault
  },
  computed: {
    taxationTypeDefault() {
      return this.$store.state.settings.mainSettings.taxationTypeDefault
    },
    paymentTypesDefault() {
      return this.$store.state.settings.mainSettings.paymentTypesDefault
    }
  },
  methods: {
    saveMainSettings() {
      let app = this
      this.$store.dispatch('settings/saveMainSettings', {
        taxationTypeDefault: app.taxationTypeDefaultTemp,
        paymentTypesDefault: app.paymentTypesDefaultTemp
      })
      this.alert = {
        show: true,
        type: "success",
        timeout: 2000,
        text: 'Настройки сохранены'
      }
    },
  }
}
</script>