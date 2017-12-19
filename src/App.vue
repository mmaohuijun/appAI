<template>
  <div id="app">
    <Layout></Layout>
    <router-view></router-view>
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
/* #app{
  padding: 0 20px;
  font-size: 14px;
  height: 100%;
} */
#app > div.layout + div{
  padding: 0 30px;
}
</style>
