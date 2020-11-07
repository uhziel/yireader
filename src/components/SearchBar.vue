<template>
  <v-responsive :max-width="$vuetify.breakpoint.xs ? '14rem' : '20rem'">
    <v-text-field
    v-model="searchKey"
    @click:append="search"
    @keyup.enter="search"
    dense outlined hide-details placeholder="可搜索书名"
    append-icon="mdi-magnify">
    </v-text-field>
  </v-responsive>
</template>

<script>
export default {
  name: 'SearchBar',
  data: function () {
    return { searchKey: "" };
  },
  methods: {
    search: function () {
      if (this.searchKey.length !== 0) {
        this.$router.push({name: "Search", params: {searchKey: this.searchKey}});
        this.searchKey = "";
      }
    }
  }
}
</script>
