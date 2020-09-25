<template>
  <div class="BookChapter">
    <h2>{{chapterInfo.name}}</h2>
    <ChapterNav :bookInfo="bookData.bookInfo" :chapterIndex="chapterIndex" :lastChapterInfo="lastChapterInfo" :nextChapterInfo="nextChapterInfo" />
    <p v-if="loading">正在加载中</p>
    <p v-else v-for="(paragraph, index) in paragraphs" :key="index">{{paragraph}}</p>
    <ChapterNav :bookInfo="bookData.bookInfo" :chapterIndex="chapterIndex" :lastChapterInfo="lastChapterInfo" :nextChapterInfo="nextChapterInfo" />
  </div>
</template>

<script>
import {chapter} from "@/api.js";
import ChapterNav from '@/components/ChapterNav.vue'

export default {
  name: "BookChapter",
  props: ["name", "author", "chapterIndex"],
  components: {
    ChapterNav
  },
  data() {
    return {
      paragraphs: [],
      loading: true
    };
  },
  computed: {
    bookData() {
      //return this.$store.state.books[this.bookFullName]
      return this.$store.getters.getBookByFullName(this.bookFullName) ||
        { bookDetail: {lastChapter: ""}, bookCatalog: [], bookInfo: {} };
    },
    chapterInfo() { return this.bookData.bookCatalog[this.chapterIndex]; },
    lastChapterInfo() { return this.bookData.bookCatalog[this.chapterIndex-1]; },
    nextChapterInfo() { return this.bookData.bookCatalog[this.chapterIndex+1]; },
    bookFullName () {
      return this.name + "-" + this.author;
    }
  },
  created() {
    this.fetchChapter(this.chapterInfo);
    console.log("name: ", this.name);
    console.log("author: ", this.author);
    console.log("chapterIndex: ", this.chapterIndex);
  },
  watch: {
    $route() {
      this.fetchChapter(this.chapterInfo);
    }
  },
  methods: {
    fetchChapter(chapterInfo) {
      this.loading = true;
      chapter(chapterInfo).then(res => {
        console.log(res.data);
        this.loading = false;
        this.paragraphs = res.data.content.split('\n');
      }).catch(res => {
        console.error(res);
      });
    }
  }
}
</script>