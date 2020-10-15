<template>
<div>
 Версия ПО: {{version}} 
</div>
</template>

<script>


  export default {
    name: 'landing',
    
    data() {
      return {
        version: require('vue/package.json').version
      }
    },
    methods: {
      
      }
    
    
  }
</script>

<style>
  
</style>
