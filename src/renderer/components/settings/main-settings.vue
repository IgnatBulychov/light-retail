<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
                   
      </v-card-title>

      <v-card-text>
          <v-select
          :items="taxationTypes"
          label="СНО по умолчанию"
          v-model="taxationTypeDefault"
          ></v-select> 

          Используемые типы оплат:
      <v-checkbox
        v-model="paymentTypesDefault"
        label="Наличными"
        value="cash"
      ></v-checkbox>
      <v-checkbox
        v-model="paymentTypesDefault"
        label="Безналичными"
        value="electronically"
      ></v-checkbox>
      <v-checkbox
        v-model="paymentTypesDefault"
        label="Предоплата"
        value="prepaid"
      ></v-checkbox>
      <v-checkbox
        v-model="paymentTypesDefault"
        label="Оплата в кредит"
        value="credit"
      ></v-checkbox>
      <v-checkbox
        v-model="paymentTypesDefault"
        label="Иная форма оплаты (оплата встречным представлением)"
        value="other"
      ></v-checkbox>
      <v-checkbox
        v-model="paymentTypesDefault"
        label="Комбооплата"
        value="combo"
      ></v-checkbox>

      </v-card-text>

      

    </v-card>
    <alert :alert="alert"/>
  </v-container>
</template>

<script>
import taxationTypes from '../resources/taxationTypes.js'
import Alert from '../alerts/alert'
export default {
  name: 'main-settings',
  components: {
    Alert
  },
  data() {
    return {
      taxationTypes,      
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
  },
  computed: {
    taxationTypeDefault: {
      get() {
        return this.$store.state.settings.mainSettings.taxationTypeDefault
      },
      set(v) {
        this.$store.dispatch('settings/saveMainSettings', {
          taxationTypeDefault: v,
          paymentTypesDefault: this.paymentTypesDefault
        })
        this.alert = {
          show: true,
          type: "success",
          timeout: 2000,
          text: 'Настройки сохранены'
        }
      },
    },
    paymentTypesDefault: {
      get() {
        return this.$store.state.settings.mainSettings.paymentTypesDefault
      },
      set(v) {
        this.$store.dispatch('settings/saveMainSettings', {
          taxationTypeDefault: this.taxationTypeDefault,
          paymentTypesDefault: v
        })
        this.alert = {
          show: true,
          type: "success",
          timeout: 2000,
          text: 'Настройки сохранены'
        }
      }
    }
  },
  methods: {
  }
}
</script>