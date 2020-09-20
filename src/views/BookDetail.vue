<template>
  <div class="BookDetail">
    <h4>{{bookInfo.name}}</h4>
    <p>作者：{{bookInfo.author}}</p>
    <img :alt="bookInfo.name+'封面'" :src="bookInfo.cover">
    <p>{{bookInfo.summary}}</p>
    <p>最新章节：{{bookData.bookDetail.lastChapter}}</p>
    <div class="catalog">
      <p v-for="chapter in bookData.bookCatalog" :key="chapter.url"><router-link :to='{name:"BookChapter", params:{name:bookInfo.name, author:bookInfo.author, chapterName:chapter.name}, query: chapter}'>{{chapter.name}}</router-link></p>
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
      bookData: { bookDetail: {lastChapter: ""}, bookCatalog: [] },
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
    this.loadBookDetail();
  },
  watch: {
    $route() {
      this.bookInfo = this.$route.query;
      this.bookFullName = this.name + "-" + this.author;
      this.loadBookDetail();
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
          this.saveCatalog();
      }).catch(res => {
        console.error(res);
      });
    },
    loadBookDetail() {
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
    saveCatalog() {
      const parsed = JSON.stringify(this.bookData);
      localStorage.setItem(this.bookFullName, parsed);
    }
  }
}
</script>