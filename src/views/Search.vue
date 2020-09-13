<template>
  <div class="search">
    <h1>This is an {{searchKey}} search page</h1>
    <BookInfo v-for="bookInfo in searchResult" :key="bookInfo.detail" :info="bookInfo" />
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
  }
}
</script>