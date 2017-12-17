<template>
  <div id="app">
    <Layout></Layout>
    <router-view/>
  </div>
</template>

<script>
import Layout from 'components/Layout'
export default {
  name: 'app',
  components: { Layout }
}
</script>

<style>
#app {
  padding: 0 20px;
}
.line-input {
  border: none;
}
</style>
