<template>
  <b-navbar toggleable="lg" sticky>
    <b-navbar-brand to="/">易读</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/booksources">书源</b-nav-item>
        <b-nav-item to="/about">关于</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <SearchBar class="navSearch"/>

        <b-nav-item-dropdown text='用户' right>
          <b-dropdown-item to="/">设置</b-dropdown-item>
          <b-dropdown-item to="/">登出</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue';

export default {
  name: 'NavBar',
  components: {
    SearchBar
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
nav {
  position: sticky;
  top: 0;
  padding: 10px;
  background: white;
  display: flex;
  margin-bottom: 8px;
  font-weight: bold;
}
</style>
