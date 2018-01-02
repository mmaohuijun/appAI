<template>
  <!-- <div id="app">
    <router-view></router-view>
  </div> -->
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  #app {
    width: 100%;
    height: 100%
  }
</style>
