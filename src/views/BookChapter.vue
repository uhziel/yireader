<template>
  <b-container tag="article" class="BookChapter">
    <p v-if="loading">正在加载中</p>
    <div v-else>
      <h1 class="text-center">{{bookChapter.name}}</h1>
      <ChapterNav :bookInfo="bookInfo" :chapterIndex="chapterIndex" :prevChapterInfo="prevChapterInfo" :nextChapterInfo="nextChapterInfo" />

      <div class="content">
        <p :style="contentStyle" v-for="(paragraph, index) in paragraphs" :key="index">{{paragraph}}</p>
      </div>
      <ChapterNav :bookInfo="bookInfo" :chapterIndex="chapterIndex" :prevChapterInfo="prevChapterInfo" :nextChapterInfo="nextChapterInfo" />
      <b-button pill class="incFontSize" @click.prevent="changeFontSize(0.1)">增大</b-button>
      <b-button pill class="decFontSize" @click.prevent="changeFontSize(-0.1)">减小</b-button>
    </div>

  </b-container>
</template>

<script>
import {chapter, graphql} from "../api.js";
import ChapterNav from '@/components/ChapterNav.vue'

export default {
  name: 'BookChapter',
  props: {name: String, author: String, bookId: String, chapterIndex: Number},
  components: {
    ChapterNav
  },
  data() {
    return {
      bookChapter: {
        name: "",
      },
      paragraphs: [],
      loading: true,
      readingTimeoutId: null,
      lastChapterScrollY: 0.0,
    };
  },
  computed: {
    bookInfo() {
      return {
        name: this.name,
        author: {
          name: this.author,
        },
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
      return this.name + '-' + this.author;
    },
    bookUserData() {
      return this.$store.getters.getBookUserData(this.bookFullName);
    },
    contentStyle() {
      return {
        'font-size': this.$store.state.userData.theme['font-size'] + 'em',
      };
    },
  },
  created() {
    this.tryFetchBookChapter();
    const userData = this.bookUserData;
    if (userData && userData.chapterScrollY) {
      console.log("set lastChapterScrollY:", userData.chapterScrollY);
      this.lastChapterScrollY = userData.chapterScrollY;
    }
    //this.tryFetchBook();
    this.setContentChangedToFalse();    
    console.log("name: ", this.name);
    console.log("author: ", this.author);
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
      bookFullName: this.bookFullName,
      chapterIndex: this.chapterIndex,
      chapterScrollY: window.scrollY,
    });
    this.$store.dispatch({
        type: 'setBookChapters',
        bookFullName: this.bookFullName,
        bookChapters: this.chapterCache,
    });
    next();
  },
  watch: {
    $route() {
      this.tryFetchBookChapter();
      //this.tryFetchBook();
      this.setContentChangedToFalse();
      document.title = this.bookChapter.name + ' - 易读';
    }
  },
  methods: {
    tryFetchBookChapter() {
      const query = `
        query BookChapter($info: BookChapterInfo!) {
          bookChapter(info: $info) {
            index
            name
            data
            prev {
              index
              name
            }
            next {
              index
              name
            }
          }
        }`;
      const variables = {
          info: {
            bookId: this.bookId,
            bookChapterIndex: this.chapterIndex,
          }
      };
      graphql(query, variables).then(res => {
        if (!res.data.errors) {
          this.bookChapter = res.data.data.bookChapter;
          this.paragraphs = res.data.data.bookChapter.data.split('\n');
          this.loading = false;
        } else {
          //TODO 错误提示
          console.error(res.data.errors);
        }
      }).catch(e => console.error(e));
    },
    loadChapter() {
      if (this.getChapterCache(this.chapterIndex)) {
        console.log("命中缓存:", this.chapterInfo.name);
        this.paragraphs = this.getChapterCache(this.chapterIndex);
        this.$nextTick(function () {
          this.$root.$emit('scroll-to', this.lastChapterScrollY);
          this.lastChapterScrollY = 0.0;
        });
        this.loading = false;
        this.$store.commit({
          type: 'setReading',
          bookFullName: this.bookFullName,
          chapterIndex: this.chapterIndex,
          chapterScrollY: window.scrollY,
        });
      } else {
        this.fetchChapter(this.chapterIndex, this.chapterInfo)
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
        this.$nextTick(function () {
          this.$root.$emit('scroll-to', this.lastChapterScrollY);
          this.lastChapterScrollY = 0.0;
        });
        this.$store.commit({
          type: 'setReading',
          bookFullName: this.bookFullName,
          chapterIndex: chapterIndex,
          chapterScrollY: window.scrollY,
        });
        this.chapterCache[chapterIndex] = this.paragraphs;
      }).catch(res => {
        console.error(res);
      });
    },
    tryFetchBook() {
      const book = this.$store.getters.getBookByFullName(this.bookFullName);
      console.log('tryFetchBook length', book.bookCatalog.length, ' chapterIndex:', this.chapterIndex);
      const lengthDiff = book.bookCatalog.length - this.chapterIndex;
      if (lengthDiff < 10) {
        const timeDiff = Date.now() - this.bookUserData.lastFetchTime;
        console.log('tryFetchBook now', Date.now(), ' lastFetchTime:', this.bookUserData.lastFetchTime,
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
        bookFullName: this.bookFullName,
        chapterIndex: this.chapterIndex,
        chapterScrollY: window.scrollY,
      });
    }
  },
  title() {
    return this.bookChapter.name + " - 易读";
  }
}
</script>

<style scoped>
p {
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