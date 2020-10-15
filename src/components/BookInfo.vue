<template>
  <div class="bookInfo">
    <div class="bookCover">
      <router-link :to='{name:"BookDetail", params:{name: info.name, author:info.author}, query: info}'><img :alt="info.name+'封面'" :src="info.cover"></router-link>
    </div>
    <dl>
      <dt>
        <router-link :to='{name:"BookDetail", params:{name: info.name, author:info.author}, query: info}'>{{info.name}}</router-link>
        <span>{{info.author}}</span>
      </dt>
      <dd>{{info.summary}}</dd>
      <p v-if="reading">已读到：<router-link :to='{name:"BookChapter", params:{name:info.name, author:info.author, chapterIndex:reading.chapterIndex}}'>{{reading.chapterName}}</router-link></p>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'BookInfo',
  props: ['info', 'reading']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bookInfo {
  margin: 10px 0 0;
  border: 1px solid black;
  display: flex;
  padding: 5px;
}
.bookInfo dl {
  flex: 9.5;
}
.bookInfo dl dt {
  border-bottom: 1px dotted #A6D3E8;
}
.bookInfo dl dt span {
  float: right;
  color: #999;
}
.bookInfo dl dd {
  padding: 7px 0 0 0;
  color: #999;
  margin: 0;
}
.bookCover {
  flex: 2.5;
  margin-right: 10px;
}
.bookCover img {
  max-width: 100%;
}
</style>
