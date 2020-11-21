<template>
  <div class="bookInfo">
    <div class="bookCover">
      <router-link :to="detailRoute">
        <img :alt="info.name+'封面'" :src="info.cover">
      </router-link>
    </div>
    <dl>
      <dt>
        <router-link class="name" :to="detailRoute">{{info.name}}<span class="redpoint" v-if="contentChanged" /></router-link>
        <span class="author">{{info.author}}</span>
      </dt>
      <dd>{{info.summary}}</dd>
      <div class="operate">
        <button v-if="inBookshelf" @click="removeFromBookshelf">移出</button>
        <button v-if="inBookshelf" :disabled="!moveUpEnable" @click="moveUp">上移</button>
        <button v-if="inBookshelf" :disabled="!moveDownEnable" @click="moveDown">下移</button>
      </div>
      <div class="process">
        <span v-if="reading">已读到：<router-link :to="detailRoute">{{reading.chapterName}}</router-link></span>
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
    },
    bookUserData() {
      return this.$store.getters.getBookUserData(this.bookFullName);
    },
    contentChanged() {
      const bookUserData = this.bookUserData;
      if (!bookUserData) {
        return false;
      }
      return this.inBookshelf && bookUserData.contentChanged;
    },
    detailRoute() {
      if (!this.inBookshelf) {
        return {
          name:"BookDetail",
          params:{name: this.info.name, author:this.info.author},
          query: this.info
        };
      }
      const bookUserData = this.bookUserData;
      let chapterIndex = 0;
      if (bookUserData) {
        chapterIndex = bookUserData.chapterIndex;
      }
      if (chapterIndex === -1) {
        chapterIndex = 0;
      }
      return {
        name: "BookChapter",
        params: {
          name: this.info.name,
          author: this.info.author,
          chapterIndex: chapterIndex,
        }
      };
    },
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
.bookInfo dl dt .author {
  float: right;
  color: #999;
}
.redpoint{
  vertical-align: top;
  display:inline-block;
  height:10px;
  width:10px;
  border-radius:10px;
  background:red;
}
.bookInfo dl dd {
  padding: 7px 0 0 0;
  color: #999;
  margin: 0;
  line-height: 1.4;
  max-height: 4.2em;
  overflow-y: hidden;
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
