<template>
  <div id="app">
    <nav>
      <router-link class="navItem" to="/">首页</router-link>
      <router-link class="navItem" to="/about">书源</router-link>
      <SearchBar class="navSearch"/>
    </nav>
    <main role="main">
      <router-view/>
    </main>
  </div>
</template>

<style>
#app {
  font-family: "Microsoft YaHei", 微软雅黑, 宋体, Verdana, Geneva, Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 10px 10px 5em 10px;
  color: #2c3e50;
}

nav {
  display: flex;
  border-bottom: 3px solid black;
  margin-bottom: 8px;
}

nav .navItem {
  text-align: center;
  flex: 1;
  font-size: 1.1em;
}

nav .navSearch {
  text-align: right;
  flex: 6;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: white;
  background-color: black;
  text-decoration: none;
}
</style>

<script>
// @ is an alias to /src
import SearchBar from '@/components/SearchBar.vue'

export default {
  name: 'App',
  components: {
    SearchBar
  }
}
</script>