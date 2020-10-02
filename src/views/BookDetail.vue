<template>
  <div class="BookDetail">
    <h4>{{bookInfo.name}}</h4>
    <p>作者：{{bookInfo.author}}</p>
    <img :alt="bookInfo.name+'封面'" :src="bookInfo.cover">
    <p>{{bookInfo.summary}}</p>
    <p>最新章节：{{bookData.bookDetail.lastChapter}}</p>
    <p>书架：
    <button v-if="!inBookShelf" @click="addToBookshelf()">加入</button>
    <span v-else>已加入</span>
    </p>
    <div class="catalog">
      <p v-for="(chapter, index) in bookData.bookCatalog" :key="index"><router-link :to='{name:"BookChapter", params:{name:bookInfo.name, author:bookInfo.author, chapterIndex:index}}'>{{chapter.name}}</router-link></p>
    </div>
  </div>
</template>

<script>

export default {
  name: "BookDetail",
  props: ["name", "author"],
  data() {
    return {
      bookInfo: []
    }
  },
  computed: {
    bookData() { 
      //return this.$store.state.books[this.bookFullName] ||
      return this.$store.getters.getBookByFullName(this.bookFullName) ||
        { bookDetail: {lastChapter: ""}, bookCatalog: [], bookInfo: {} }; 
    },
    inBookShelf() {
      return this.$store.getters.isInBookshelf(this.bookFullName);
    },
    bookFullName() {
      return this.name + "-" + this.author;
    }
  },
  created() {
    this.bookInfo = this.$route.query;
    if (!this.$store.getters.getBookByFullName(this.bookFullName)) {
      console.log("fetchBook:", this.bookInfo);
      this.$store.dispatch("fetchBook", this.bookInfo);
    }
    console.log("name: ", this.name);
    console.log("author: ", this.author);
    console.log("bookInfo: ", this.bookInfo)
  },
  watch: {
    $route() {
      this.bookInfo = this.$route.query;
      if (!this.$store.getters.getBookByFullName(this.bookFullName)) {
        console.log("fetchBook:", this.bookInfo);
        this.$store.dispatch("fetchBook", this.bookInfo);
      }
    }
  },
  methods: {
    addToBookshelf() {
      this.$store.commit("addToBookshelf", this.bookFullName);
    }
  },
  title() {
    return this.name + " - 易读";
  }
}
</script>