<template>
  <div class="bookInfo">
    <router-link :to='{name:"BookDetail", params:{name: info.name, author:info.author}, query: info}'><img :alt="info.name+'封面'" :src="info.cover"></router-link>
    <router-link :to='{name:"BookDetail", params:{name: info.name, author:info.author}, query: info}'><h4>{{info.name}}</h4></router-link>
    <p>作者：{{info.author}}</p>
    <p>{{info.summary}}</p>
  </div>
</template>

<script>
export default {
  name: 'BookInfo',
  props: ["info"]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bookInfo {
  margin: 10px 0 0;
  border: 1px solid black;
}
</style>
