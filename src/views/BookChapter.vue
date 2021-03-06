<template>
  <b-container tag="article" class="BookChapter">
    <p v-if="loading">正在加载中</p>
    <div v-else>
      <h1 class="text-center">{{bookChapter.name}}</h1>
      <ChapterNav :bookInfo="bookInfo" :chapterIndex="chapterIndex" :prevChapterInfo="prevChapterInfo" :nextChapterInfo="nextChapterInfo" />

      <div class="chapterContent" :style="contentStyle" v-html="bookChapter.data" />
      <ChapterNav :bookInfo="bookInfo" :chapterIndex="chapterIndex" :prevChapterInfo="prevChapterInfo" :nextChapterInfo="nextChapterInfo" />
      <b-button pill class="incFontSize" @click.prevent="changeFontSize(0.1)">增大</b-button>
      <b-button pill class="decFontSize" @click.prevent="changeFontSize(-0.1)">减小</b-button>
    </div>

  </b-container>
</template>

<script>
import {queryBookChapter, notifyReadBookChapter} from "../api.js";
import ChapterNav from '@/components/ChapterNav.vue'

export default {
  name: 'BookChapter',
  props: {name: String, authorName: String, bookId: String, chapterIndex: Number},
  components: {
    ChapterNav
  },
  data() {
    return {
      bookChapter: {
        name: "",
        data: "",
      },
      bookChapterCaches: {},
      loading: true,
      readingTimeoutId: null,
      lastChapterScrollY: 0.0,
    };
  },
  computed: {
    bookInfo() {
      return {
        name: this.name,
        authorName: this.authorName,
        bookId: this.bookId,
      }
    },
    prevChapterInfo() {
      return this.bookChapter && this.bookChapter.prev;
    },
    nextChapterInfo() {
      return this.bookChapter && this.bookChapter.next;
    },
    bookFullName() {
      return this.name + '-' + this.authorName;
    },
    bookUserData() {
      return this.$store.getters.getBookUserData(this.bookId);
    },
    contentStyle() {
      return {
        'font-size': this.$store.state.userData.theme['font-size'] + 'em',
      };
    },
  },
  created() {
    this.tryFetchBookChapter(this.chapterIndex);
    const userData = this.bookUserData;
    if (userData && userData.chapterScrollY && this.chapterIndex == userData.chapterIndex) {
      console.log("set lastChapterScrollY:", userData.chapterScrollY);
      this.lastChapterScrollY = userData.chapterScrollY;
    }   
    console.log("name: ", this.name);
    console.log("authorName: ", this.authorName);
    console.log("chapterIndex: ", this.chapterIndex);
    console.log('chapterIndex type: ', typeof this.chapterIndex);
  },
  beforeMount() {
    window.addEventListener('scroll', this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  },
  beforeRouteLeave(to, from, next) {
    console.log("beforeRouteLeave scrollY:", window.scrollY);
    if (this.readingTimeoutId) {
      window.clearTimeout(this.readingTimeoutId);
      this.readingTimeoutId = null;
    }
    this.$store.commit({
      type: 'setReading',
      bookId: this.bookId,
      bookFullName: this.bookFullName,
      chapterIndex: this.chapterIndex,
      chapterScrollY: window.scrollY,
    });
    next();
  },
  beforeRouteUpdate(to, from, next) {
    this.tryFetchBookChapter(to.params.chapterIndex, next);
  },
  methods: {
    tryFetchBookChapter(curChapterIndex, next) {
      this.queryBookChapterWithCache(this.bookId, curChapterIndex, true).then(res => {
        if (!res.data.errors) {
          this.bookChapter = res.data.data.bookChapter;
          if (res.data.data.isCache) {
            console.log('hit the cache: ', this.bookChapter.name);
          } else {
            this.bookChapterCaches[this.bookChapter.index] = this.bookChapter;
          }
          document.title = this.bookChapter.name + ' - 易读';
          if (next) {
            next();
          }

          this.$nextTick(function () {
            this.$root.$emit('scroll-to', this.lastChapterScrollY);
            this.lastChapterScrollY = 0.0;
          });
          this.loading = false;
          this.$store.commit({
            type: 'setReading',
            bookId: this.bookId,
            bookFullName: this.bookFullName,
            chapterIndex: curChapterIndex,
            chapterScrollY: window.scrollY,
          });
          this.clearOutdatedCache(curChapterIndex);
        } else {
          //TODO 错误提示
          console.error(res.data.errors);
        }
      }).catch(e => console.error(e));
      this.queryBookChapterWithCache(this.bookId, curChapterIndex - 1, false).then(res => {
        if (!res.data.errors && !res.data.data.isCache) {
          this.bookChapterCaches[res.data.data.bookChapter.index] = res.data.data.bookChapter;
        }
      });
      this.queryBookChapterWithCache(this.bookId, curChapterIndex + 1, false).then(res => {
        if (!res.data.errors && !res.data.data.isCache) {
          this.bookChapterCaches[res.data.data.bookChapter.index] = res.data.data.bookChapter;
        }
      });
    },
    async queryBookChapterWithCache(bookId, chapterIndex, read) {
      if (chapterIndex < 0) {
        return {
          data: {
            errors: [
              'chapterIndex cannot < 0.'
            ]
          }
        };
      }
      if (this.bookChapterCaches[chapterIndex]) {
        if (read) {
          notifyReadBookChapter(bookId, chapterIndex);
        }
        return {
          data: {
            data: {
              bookChapter: this.bookChapterCaches[chapterIndex],
              isCache: true
            }
          }
        };
      } else {
        return queryBookChapter(bookId, chapterIndex, read);
      }
    },
    changeFontSize(delta) {
      this.$store.commit({
        type: 'changeFontSize',
        delta: delta,
      });
    },
    onScroll() {
      if (this.readingTimeoutId) {
        window.clearTimeout(this.readingTimeoutId);
      }
      this.readingTimeoutId = window.setTimeout(this.recordReadingPos.bind(this), 1000);
    },
    recordReadingPos() {
      this.readingTimeoutId = null;
      console.log("recordReadingPos");
      this.$store.commit({
        type: 'setReading',
        bookId: this.bookId,
        bookFullName: this.bookFullName,
        chapterIndex: this.chapterIndex,
        chapterScrollY: window.scrollY,
      });
    },
    clearOutdatedCache(curChapterIndex) {
      let toDel = [];
      for (const chapterIndex in this.bookChapterCaches) {
        if (Math.abs(chapterIndex - curChapterIndex) > 2) {
          toDel.push(chapterIndex);
        }
      }
      for (const chapterIndex of toDel) {
        delete this.bookChapterCaches[chapterIndex];
      } 
    }
  },
  title() {
    return this.bookChapter.name + " - 易读";
  }
}
</script>

<style>
.chapterContent {
  text-indent: 2em;
  /* via https://perishablepress.com/wrapping-content/ */
	white-space: pre;           /* CSS 2.0 */
	white-space: pre-wrap;      /* CSS 2.1 */
	white-space: pre-line;      /* CSS 3.0 */
	white-space: -pre-wrap;     /* Opera 4-6 */
	white-space: -o-pre-wrap;   /* Opera 7 */
	white-space: -moz-pre-wrap; /* Mozilla */
	white-space: -hp-pre-wrap;  /* HP Printers */
	word-wrap: break-word;      /* IE 5+ */
}
.incFontSize {
  position: fixed;
  bottom: 3em;
  left: 10px;
}
.decFontSize {
  position: fixed;
  bottom: 0.5em;
  left: 10px;
}
</style>