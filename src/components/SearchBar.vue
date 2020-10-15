<template>
  <div class="searchBar">
    <form>
      <input id="searchKey" type="text" v-model="searchKey" placeholder="可搜书名，少字也别输错字">
      <button @click.prevent="search">搜索</button>
    </form>
  </div>
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#searchKey {
  margin: 0 5px 0 0;
}
</style>
