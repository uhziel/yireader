<template>
  <div id="app">
    <NavBar />
    <main role="main">
      <b-container class="pb-5" style="max-width: 900px;">
        <router-view/>
      </b-container>
    </main>
  </div>
</template>

<style>
#app {
  font-family: "Microsoft YaHei", 微软雅黑, 宋体, Verdana, Geneva, Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>