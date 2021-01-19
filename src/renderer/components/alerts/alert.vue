<template>

  <v-snackbar
    v-model="alertObject.show"
    top 
    :color="alertObject.type" 
    :timeout="alertObject.timeout"
  >
  {{ alertObject.text }}
     <template v-slot:action="{ attrs }">
        
        <v-btn
          dark 
          text
          @click="alertObject.show = false"
          icon
           v-bind="attrs"
        >
        <v-icon>mdi-close</v-icon>     
        </v-btn>
     </template>
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