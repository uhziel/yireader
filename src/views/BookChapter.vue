<template>
  <article class="BookChapter">
    <h1 class="chapterName">{{chapterInfo.name}}</h1>
    <ChapterNav :bookInfo="bookData.bookInfo" :chapterIndex="chapterIndex" :lastChapterInfo="lastChapterInfo" :nextChapterInfo="nextChapterInfo" />
    <p v-if="loading">正在加载中</p>
    <p v-else v-for="(paragraph, index) in paragraphs" :key="index">{{paragraph}}</p>
    <ChapterNav :bookInfo="bookData.bookInfo" :chapterIndex="chapterIndex" :lastChapterInfo="lastChapterInfo" :nextChapterInfo="nextChapterInfo" />
  </article>
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
      return this.$store.getters.getBookByFullName(this.bookFullName) ||
        { bookDetail: {lastChapter: ""}, bookCatalog: [], bookInfo: {} };
    },
    chapterInfo() { return this.bookData.bookCatalog[this.chapterIndex]; },
    lastChapterInfo() { return this.bookData.bookCatalog[this.chapterIndex-1]; },
    nextChapterInfo() {
      return this.bookData.bookCatalog[parseInt(this.chapterIndex)+1];
    },
    bookFullName() {
      return this.name + '-' + this.author;
    }
  },
  created() {
    this.loadChapter();
    this.tryFetchBook();
    this.setContentChangedToFalse();    
    console.log("name: ", this.name);
    console.log("author: ", this.author);
    console.log("chapterIndex: ", this.chapterIndex);
    console.log('chapterIndex type: ', typeof this.chapterIndex);
  },
  watch: {
    $route() {
      this.loadChapter();
      this.tryFetchBook();
      this.setContentChangedToFalse();
      document.title = this.chapterInfo.name + ' - 易读';
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
        this.$store.commit({
          type: 'setReading',
          bookFullName: this.bookFullName,
          chapterIndex: this.chapterIndex
        });
      } else {
        this.fetchChapter(this.chapterIndex, this.chapterInfo)
      }

      if (!this.getChapterCache(this.chapterIndex-1) && this.lastChapterInfo) {
        this.fetchChapterCache(this.chapterIndex-1, this.lastChapterInfo);
      }

      if (!this.getChapterCache(this.chapterIndex+1) && this.nextChapterInfo) {
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
        this.$store.commit({
          type: 'setReading',
          bookFullName: this.bookFullName,
          chapterIndex: chapterIndex
        });
        this.chapterCache[chapterIndex] = this.paragraphs;
      }).catch(res => {
        console.error(res);
      });
    },
    fetchChapterCache(chapterIndex, chapterInfo) {
      console.log('fetchChapterCache ', chapterInfo);
      chapter(chapterInfo).then(res => {
        console.log(res.data);
        this.chapterCache[chapterIndex] = res.data.content.split('\n');
      }).catch(res => {
        console.error(res);
      });
    },
    tryFetchBook() {
      const book = this.$store.getters.getBookByFullName(this.bookFullName);
      console.log('tryFetchBook length', book.bookCatalog.length, ' chapterIndex:', this.chapterIndex);
      const lengthDiff = book.bookCatalog.length - this.chapterIndex;
      if (lengthDiff < 10) {
        const bookUserData = this.$store.getters.getBookUserData(this.bookFullName);
        const timeDiff = Date.now() - bookUserData.lastFetchTime;
        console.log('tryFetchBook now', Date.now(), ' lastFetchTime:', bookUserData.lastFetchTime,
          ' timeDiff:', timeDiff);
        if (timeDiff > 600000 || (lengthDiff === 1 || lengthDiff === 2)) {
          this.$store.dispatch('fetchBook', book.bookInfo);
        }
      }
    },
    setContentChangedToFalse() {
      this.$store.commit({
        type: 'setContentChanged',
        bookFullName: this.bookFullName,
        contentChanged: false,
      });
    }
  },
  title() {
    return this.chapterInfo.name + " - 易读";
  }
}
</script>

<style scoped>
.chapterName {
  text-align: center;
}
p {
  text-indent: 2em;
  font-size: 1.235em;
}
</style>