<template>
  <div class="BookDetail">
    <h4>{{bookInfo.name}}</h4>
    <p>作者：{{bookInfo.author}}</p>
    <img :alt="bookInfo.name+'封面'" :src="bookInfo.cover">
    <p>{{bookInfo.summary}}</p>
    <p>最新章节：{{bookData.bookDetail.lastChapter}}</p>
    <div class="catalog">
      <p v-for="(chapter, index) in bookData.bookCatalog" :key="index"><router-link :to='{name:"BookChapter", params:{name:bookInfo.name, author:bookInfo.author, chapterIndex:index}}'>{{chapter.name}}</router-link></p>
    </div>
  </div>
</template>

<script>
import {detail, catalog} from "@/api.js";

export default {
  name: "BookDetail",
  props: ["name", "author"],
  data() {
    return {
      bookData: { bookDetail: {lastChapter: ""}, bookCatalog: [], bookInfo: {} },
      bookInfo: [],
      bookFullName: ""
    }
  },
  created() {
    this.bookInfo = this.$route.query;
    this.bookFullName = this.name + "-" + this.author;
    console.log("name: ", this.name);
    console.log("author: ", this.author);
    console.log("bookInfo: ", this.bookInfo)
  },
  mounted() {
    this.loadBookData();
  },
  watch: {
    $route() {
      this.bookInfo = this.$route.query;
      this.bookFullName = this.name + "-" + this.author;
      this.loadBookData();
    }
  },
  methods: {
    fetchBookDetail(bookInfo) {
      detail(bookInfo).then(res => {
        console.log(res.data);
        this.bookData.bookDetail = res.data;
        return catalog(this.bookData.bookDetail);
      }).then(res => {
          console.log("bookDetail:", res.data);
          this.bookData.bookCatalog = res.data;
          this.bookData.bookInfo = this.bookInfo;
          this.saveBookData();
      }).catch(res => {
        console.error(res);
      });
    },
    loadBookData() {
      if (localStorage.getItem(this.bookFullName)) {
        try {
          this.bookData = JSON.parse(localStorage.getItem(this.bookFullName));
        } catch (e) {
          localStorage.removeItem(this.bookFullName);
        }
      }
      else {
        this.fetchBookDetail(this.bookInfo);
      }
    },
    saveBookData() {
      const parsed = JSON.stringify(this.bookData);
      localStorage.setItem(this.bookFullName, parsed);
    }
  }
}
</script>