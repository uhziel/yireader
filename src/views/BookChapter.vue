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
      chapterCache: {},
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
    this.loadChapter();
    console.log("name: ", this.name);
    console.log("author: ", this.author);
    console.log("chapterIndex: ", this.chapterIndex);
  },
  watch: {
    $route() {
      this.loadChapter();
      document.title = this.chapterInfo.name + " - 易读";
    }
  },
  methods: {
    getChapterCache(chapterIndex) {
      return this.chapterCache[chapterIndex];
    },
    loadChapter() {
      if (this.getChapterCache(this.chapterIndex)) {
        console.log("命中缓存:", this.chapterInfo.name);
        this.paragraphs = this.getChapterCache(this.chapterIndex);
      } else {
        this.fetchChapter(this.chapterIndex, this.chapterInfo)
      }

      if (!this.getChapterCache(this.chapterIndex-1)) {
        this.fetchChapterCache(this.chapterIndex-1, this.lastChapterInfo);
      }

      if (!this.getChapterCache(this.chapterIndex+1)) {
        this.fetchChapterCache(this.chapterIndex+1, this.nextChapterInfo);
      }

      let toDel = [];
      for (const chapterIndex in this.chapterCache) {
        if (Math.abs(chapterIndex - this.chapterIndex) > 1) {
          toDel.push(chapterIndex);
        }
      }
      for (const chapterIndex of toDel) {
        delete this.chapterCache[chapterIndex];
      }
    },
    fetchChapter(chapterIndex, chapterInfo) {
      this.loading = true;
      chapter(chapterInfo).then(res => {
        console.log(res.data);
        this.loading = false;
        this.paragraphs = res.data.content.split('\n');
        this.chapterCache[chapterIndex] = this.paragraphs;
      }).catch(res => {
        console.error(res);
      });
    },
    fetchChapterCache(chapterIndex, chapterInfo) {
      chapter(chapterInfo).then(res => {
        console.log(res.data);
        this.chapterCache[chapterIndex] = res.data.content.split('\n');
      }).catch(res => {
        console.error(res);
      });
    }
  },
  title() {
    return this.chapterInfo.name + " - 易读";
  }
}
</script>