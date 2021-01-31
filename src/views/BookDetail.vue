<template>
  <div>
    <div class="bookDetailInfo">
      <div class="bookCover">
        <img :alt="bookInfo.name+'封面'" :src="bookInfo.coverUrl">
      </div>
      <div class="bookInfoBox">
        <dl>
          <dt>{{bookInfo.name}}</dt>
          <dd>
            <p>作者：{{bookInfo.author.name}}</p>
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
      <p v-for="(chapterWithIndex, index) in bookCatalogWithIndex" :key="index"><router-link :to='{name:"BookChapter", params:{name:bookInfo.name, author:bookInfo.author.name, chapterIndex:chapterWithIndex.chapterIndex}}'>{{chapterWithIndex.chapter.name}}</router-link></p>
    </div>
  </div>
</template>

<script>
import {book, createBook} from '../api'

export default {
  name: "BookDetail",
  props: ["name", "author"],
  data() {
    return {
      bookInfo: [],
      bookData: {
        id: '',
        name: '',
        author: {
          name: '',
        },
        coverUrl: '',
        lastChapter: '',
        status: '',
        summary: '',
        toc: [],
      },
      reverseOrder: false,
    }
  },
  computed: {
    bookCatalogWithIndex() {
      let bookCatalog = this.bookData.toc;
      let bookCatalogWithIndex = [];
      for (let i = 0; i < bookCatalog.length; i++) {
        const chapterWithIndex = {
          chapter: bookCatalog[i],
          chapterIndex: i
        }
        bookCatalogWithIndex.push(chapterWithIndex);
      }
      if (this.reverseOrder) {
        bookCatalogWithIndex = Array.from(bookCatalogWithIndex).reverse();
      }
      return bookCatalogWithIndex;
    },
    inBookShelf() {
      return !!(this.bookInfo.id)
    },
    bookFullName() {
      return this.name + "-" + this.author;
    },
    disableAddToBookshelf() {
      return (this.bookData.name.length === 0);
    },
    textButtonToggleOrder() {
      if (this.reverseOrder) {
        return '正序';
      } else {
        return '倒序';
      }
    }
  },
  created() {
    this.bookInfo = this.$route.query;
    this.fetchBook();
    this.setContentChangedToFalse();
    console.log("name: ", this.name);
    console.log("author: ", this.author);
    console.log("bookInfo: ", this.bookInfo)
  },
  watch: {
    $route() {
      this.bookInfo = this.$route.query;
      this.fetchBook();
      this.setContentChangedToFalse();
    }
  },
  methods: {
    fetchBook() {
      book(this.bookInfo).then(res => {
        if (!res.data.errors) {
          this.bookData = res.data.data.book;
        } else {
          //TODO
        }
      }).catch(e => console.error(e));
    },
    addToBookshelf() {
      createBook(this.bookInfo).then(res => {
        if (!res.data.errors) {
          this.$router.replace({
            name: 'BookDetail',
            params: {name: this.bookInfo.name, author: this.bookInfo.author.name},
            query: res.data.data.createBook,
          })
        } else {
          //TODO
        }
      }).catch(e => console.error(e));
    },
    setContentChangedToFalse() {
      this.$store.commit({
        type: 'setContentChanged',
        bookFullName: this.bookFullName,
        contentChanged: false,
      });
    },
    toggleOrder() {
      this.reverseOrder = !this.reverseOrder;
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
