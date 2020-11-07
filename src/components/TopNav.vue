<template>
  <div class="top-nav">
    <v-app-bar app>
      <v-container :class="appBarClass">
        <v-toolbar-title class="mr-10 hidden-xs-only">易读</v-toolbar-title>
        <v-toolbar-items class="hidden-xs-only">
          <v-btn v-for="(item, index) in items" :key="index" :to="item.to" text>
            {{item.title}}
          </v-btn>
        </v-toolbar-items>
        <v-app-bar-nav-icon class="hidden-sm-and-up" @click="drawer = true"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <SearchBar/>
      </v-container>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
    >
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" :to="item.to" link>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            {{item.title}}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import SearchBar from './SearchBar';

export default {
  name: 'TopNav',
  components: {
    SearchBar
  },
  data: () => { return {
    'drawer': false,
    'items': [
      { title: '首页', to: '/' },
      { title: '书源', to: '/booksource' },
      { title: '关于', to: '/about' },
    ]
  }},
  computed: {
    appBarClass() {
      return this.$vuetify.breakpoint.xs ? "pa-0 fill-height" : "py-0 fill-height";
    }
  },
}
</script>
