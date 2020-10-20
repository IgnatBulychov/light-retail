<template>
  <v-snackbar
    v-model="alertObject.show"
    top 
    :color="alertObject.type" 
    :timeout="alertObject.timeout"
  >
    {{ alertObject.text }}
    <v-btn
      dark 
      text
      @click="alertObject.show = false"
    >
    <v-icon>mdi-close</v-icon>     
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'alert',
  props: ['alert'],
  computed: {
    alertObject() {
      return this.alert
    }
  },
  data() {
      return {
       
      }
  }
}
</script>