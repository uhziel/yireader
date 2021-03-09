<template>
  <b-nav-form>
    <b-form-input id="searchKey" type="search" v-model="searchKey" size="sm" class="mr-sm-2" placeholder="可搜书名，少字也别输错字" @keyup.enter="search"></b-form-input>
    <b-button size="sm" class="my-2 my-sm-0" @click.prevent="search">搜索</b-button>
  </b-nav-form>
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
        this.$router.push({name: "Search", params: {searchKey: this.searchKey.trim()}}).catch(failure => {
          console.log(failure);
          console.log(failure.to);
          console.log(failure.from);
        });
        this.searchKey = "";
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
