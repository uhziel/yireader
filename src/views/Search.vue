<template>
  <div class="search">
    <p v-if="isSearchEmpty">搜索"{{searchKey}}"：没找到你想找的书</p>
    <BookInfo v-for="(bookInfo, index) in searchResult" :key="index" :index="index" :info="bookInfo" />
  </div>
</template>

<script>
import BookInfo from '@/components/BookInfo.vue'
import {apiSearch} from "../api"

export default {
  name: "Search",
  props: ["searchKey"],
  components: {
    BookInfo
  },
  data() {
    return {
      searchResult: [],
      searching: true,
    };
  },
  computed: {
    isSearchEmpty() {
      return !this.searching && this.searchResult.length === 0;
    }
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
      apiSearch(searchKey).then(res => {
        console.log(res.data);
        this.searchResult = res.data.data.search;
        this.searching = false;
      }).catch(res => {
        console.error(res);
      });
    }
  },
  title: "搜索 - 易读"
}
</script>