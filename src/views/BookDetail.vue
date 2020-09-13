<template>
  <div class="BookDetail">
    <h4>{{bookInfo.name}}</h4>
    <p>作者：{{bookInfo.author}}</p>
    <img :alt="bookInfo.name+'封面'" :src="bookInfo.cover">
    <p>{{bookInfo.summary}}</p>
    <p>最新章节：{{bookDetail.lastChapter}}</p>
    <div class="catalog">
      <p v-for="chapter in bookCatalog" :key="chapter.url"><a :href="chapter.url">{{chapter.name}}</a></p>
    </div>
  </div>
</template>

<script>
import {detail, catalog} from "@/api.js";

export default {
  name: "BookDetail",
  props: ["name"],
  data() {
    return { bookInfo: [], bookDetail: {}, bookCatalog: [] };
  },
  created() {
    this.bookInfo = this.$route.query;
    this.fetchBookDetail(this.bookInfo);
    console.log("name: ", this.name);
    console.log("bookInfo: ", this.bookInfo)
  },
  watch: {
    $route() {
      this.bookInfo = this.$route.query;
      this.fetchBookDetail(this.bookInfo);
    }
  },
  methods: {
    fetchBookDetail(bookInfo) {
      detail(bookInfo).then(res => {
        console.log(res.data);
        this.bookDetail = res.data;
        return catalog(this.bookDetail);
      }).then(res => {
          console.log("bookDetail:", res.data);
          this.bookCatalog = res.data;
      }).catch(res => {
        console.error(res);
      });
    }
  }
}
</script>