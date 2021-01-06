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
  },
  computed: {
    taxationTypeDefault() {
      return this.$store.state.settings.mainSettings.taxationTypeDefault
    }
  },
  methods: {
    saveMainSettings() {
      let app = this
      this.$store.dispatch('settings/saveMainSettings', {
        taxationTypeDefault: app.taxationTypeDefaultTemp
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