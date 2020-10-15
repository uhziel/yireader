<template>
  <div class="search">
    <BookInfo v-for="(bookInfo, index) in searchResult" :key="index" :info="bookInfo" />
  </div>
</template>

<script>
import BookInfo from '@/components/BookInfo.vue'
import {search} from "@/api.js"

export default {
  name: "Search",
  props: ["searchKey"],
  components: {
    BookInfo
  },
  data() {
    return { searchResult: [] };
  },
  created() {
    console.log("searchBook ", this.searchKey);
    this.searchBook(this.searchKey);
  },
  watch: {
    $route() {
      this.searchBook(this.searchKey);
    }
  },
  methods: {
    searchBook(searchKey) {
      search(searchKey).then(res => {
        console.log(res.data);
        this.searchResult = res.data;
      }).catch(res => {
        console.error(res);
      });
    }
  },
  title: "搜索 - 易读"
}
</script>