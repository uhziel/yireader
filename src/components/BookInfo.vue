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
      <div class="operate">
        <button v-if="inBookshelf" @click="removeFromBookshelf">移出</button>
        <button v-if="inBookshelf" :disabled="!moveUpEnable" @click="moveUp">上移</button>
        <button v-if="inBookshelf" :disabled="!moveDownEnable" @click="moveDown">下移</button>
      </div>
      <div class="process">
        <span v-if="reading">已读到：<router-link :to='{name:"BookChapter", params:{name:info.name, author:info.author, chapterIndex:reading.chapterIndex}}'>{{reading.chapterName}}</router-link></span>
      </div>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'BookInfo',
  props: ['info', 'reading', 'inBookshelf', 'index'],
  computed: {
    bookFullName() {
      return this.info.name + '-' + this.info.author;
    },
    moveUpEnable() {
      return this.inBookshelf && this.index > 0;
    },
    moveDownEnable() {
      return this.inBookshelf && this.index < this.$store.getters.bookshelfLength - 1;
    }
  },
  created() {
    console.log('BookInfo info', this.info);
    console.log('BookInfo reading', this.reading);
    console.log('BookInfo inBookshelf', this.inBookshelf);
    console.log('BookInfo index', this.index);
  },
  methods: {
    removeFromBookshelf() {
      this.$store.commit('removeFromBookshelf', this.index);
    },
    moveUp() {
      this.$store.commit('moveUpInBookshelf', this.index);
    },
    moveDown() {
      this.$store.commit('moveDownInBookshelf', this.index);
    },
  },
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
  margin: 10px 0 ;
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
.operate {
  padding: 7px 0 0 0;
}
.operate button {
  margin: 0 10px;
}
.process {
  padding: 7px 0 0 0;
}
</style>
