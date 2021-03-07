<template>
  <div>
    <div class="bookDetailInfo">
      <div class="bookCover">
        <img :alt="name+'封面'" :src="bookData.coverUrl">
      </div>
      <div class="bookInfoBox">
        <dl>
          <dt>{{name}}</dt>
          <dd>
            <p>作者：{{authorName}}</p>
            <p>最新章节：{{bookData.lastChapter}}</p>
              <p>书架：
                <b-button size="sm" v-if="!inBookShelf" :disabled="disableAddToBookshelf" @click="addToBookshelf()">加入</b-button>
                <span v-else>已加入</span>
              </p>
          </dd>
        </dl>
      </div>
    </div>
    <div class="summary">
      <div class="title">内容介绍</div>
      <p>{{bookData.summary}}</p>   
    </div>
    <div class="catalog">
      <div class="title">目录</div>
      <p>排序：<b-button size="sm" @click="toggleOrder">{{textButtonToggleOrder}}</b-button></p>
      <p v-for="(chapterWithIndex, index) in bookCatalogWithIndex" :key="index"><router-link :to='{name:"BookChapter", params:{bookId: bookData.id, chapterIndex:chapterWithIndex.chapterIndex}, query: bookInfo}'>{{chapterWithIndex.chapter.name}}</router-link></p>
    </div>
  </div>
</template>

<script>
import {apiQueryBook, apiAddBookToBookShelf, apiReverseOrderBook} from '../api'

export default {
  name: "BookDetail",
  props: {bookId: String, name: String, authorName: String},
  data() {
    return {
      bookInfo: {},
      bookData: {
        id: '',
        name: '',
        inBookShelf: false,
        authorName: '',
        coverUrl: '',
        lastChapter: '',
        status: '',
        reverseOrder: false,
        summary: '',
        spine: [],
      },
    }
  },
  computed: {
    bookCatalogWithIndex() {
      let bookCatalog = this.bookData.spine;
      let bookCatalogWithIndex = [];
      for (let i = 0; i < bookCatalog.length; i++) {
        const chapterWithIndex = {
          chapter: bookCatalog[i],
          chapterIndex: i
        }
        bookCatalogWithIndex.push(chapterWithIndex);
      }
      if (this.bookData.reverseOrder) {
        bookCatalogWithIndex = Array.from(bookCatalogWithIndex).reverse();
      }
      return bookCatalogWithIndex;
    },
    inBookShelf() {
      return !!(this.bookData.inBookshelf)
    },
    bookFullName() {
      return this.name + "-" + this.authorName;
    },
    disableAddToBookshelf() {
      return (this.bookData.name.length === 0);
    },
    textButtonToggleOrder() {
      if (this.bookData.reverseOrder) {
        return '正序';
      } else {
        return '倒序';
      }
    }
  },
  created() {
    this.bookInfo = this.$route.query;
    this.fetchBook();
    console.log("name: ", this.name);
    console.log("authorName: ", this.authorName);
    console.log("bookInfo: ", this.bookInfo)
  },
  watch: {
    $route() {
      this.bookInfo = this.$route.query;
      this.fetchBook();
    }
  },
  methods: {
    fetchBook() {
      apiQueryBook(this.bookInfo).then(res => {
        if (!res.data.errors) {
          this.bookData = res.data.data.book;
          this.bookInfo.bookId = this.bookData.id;
        } else {
          //TODO
        }
      }).catch(e => console.error(e));
    },
    addToBookshelf() {
      apiAddBookToBookShelf(this.bookData.id).then(res => {
        if (!res.data.errors) {
          this.fetchBook();
        } else {
          //TODO
        }
      }).catch(e => console.error(e));
    },
    toggleOrder() {
      apiReverseOrderBook(this.bookInfo.bookId, !this.bookData.reverseOrder).then(res => {
        if (!res.data.errors) {
          this.fetchBook();
        } else {
          //TODO
        }
      }).catch(e => console.log(e));
    }
  },
  title() {
    return this.name + ' - 易读';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bookDetailInfo {
  display: flex;
}
.title {
  background-color: #222;
  color: white;
  padding-left: 10px;
  margin: 10px 0;
}
.bookCover {
  flex: 3;
}
.bookInfoBox {
  flex: 9;
  padding-left: 10px;
}
.bookInfoBox p {
  margin: 0;
}
.bookInfoBox dl dt {
  border-bottom: 1px dotted #999;
  font-size: 1.2em;
  font-weight: bold;
}
.bookInfoBox dl dd {
  margin: 10px 0 0 0;
}
.bookCover img {
  max-width: 100%;
}
</style>
