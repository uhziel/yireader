<template>
  <div class="bookInfo">
    <img :alt="name+'封面'" :src="cover">
    <h4>{{name}}</h4>
    <p>作者：{{author}}</p>
    <p>{{summary}}</p>
  </div>
</template>

<script>
export default {
  name: 'BookInfo',
  props: {
    name: String,
    author: String,
    cover: String,
    summary: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h4 {
  margin: 40px 0 0;
}
</style>
