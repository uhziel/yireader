import Vue from 'vue'
import Vuex from 'vuex'
import api from "@/api.js";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    books: {}, //<name-author, { bookDetail: {lastChapter: ""}, bookCatalog: [], bookInfo: {} }>
    userData: { 
      bookshelf: [], //"name-author"...
      reading: {}, //"name-author",chapter_index...
    }
  },
  getters: {
    getBookByFullName(state) {
      return function (fullName) {
        return state.books[fullName];
      };
    },
    isInBookshelf(state) {
      return function (fullName) {
        return state.userData.bookshelf.indexOf(fullName) !== -1;
      }
    },
    bookInfosInBookshelf(state, getters) {
      let bookInfos = [];
      for (const bookFullName of state.userData.bookshelf) {
        let book = getters.getBookByFullName(bookFullName);
        if (book) {
          bookInfos.push(book.bookInfo);
        }
      }
      console.log("bookInfosInBookshelf ", bookInfos);
      return bookInfos;
    },
    getReadingProcess(state, getters) {
      return function (fullName) {
        const chapterIndex = state.userData.reading[fullName];
        if (chapterIndex < 0) {
          return null;
        }
        const book = getters.getBookByFullName(fullName);
        if (!book.bookCatalog[chapterIndex]) {
          return null;
        }
        return {
          chapterIndex,
          chapterName: book.bookCatalog[chapterIndex].name
        };
      };

    },
  },
  mutations: {
    initStore (state) {
      let userDataStr = localStorage.getItem("userData");
      if (userDataStr) {
        try {
          state.userData = JSON.parse(userDataStr);
        } catch (e) {
          console.error(e);
          localStorage.removeItem("userData");
        }
      }
      console.log("initStore userData: ", state.userData );
      for (let i = 0; i < localStorage.length; i++) {
        let bookFullName = localStorage.key(i);
        if (bookFullName.indexOf("-") === -1 || bookFullName === "loglevel:webpack-dev-server") {
          continue;
        }
        let bookStr = localStorage.getItem(bookFullName);
        if (bookStr) {
          try {
            let book = JSON.parse(bookStr);
            Vue.set(state.books, bookFullName, book);
          } catch (e) {
            console.error(e);
            localStorage.removeItem(bookFullName);
          }
        }
      }
    },
    updateBook (state, book) {
      console.log("updateBook ", book);
      let fullName = book.bookInfo.name + "-" + book.bookInfo.author;
      Vue.set(state.books, fullName, book);
      localStorage.setItem(fullName, JSON.stringify(book));
    },
    addToBookshelf (state, bookFullName) {
      Vue.set(state.userData.bookshelf, state.userData.bookshelf.length, bookFullName);
      localStorage.setItem("userData", JSON.stringify(state.userData));
    },
    setReading (state, payload) {
      console.log('setReading bookFullName:', payload.bookFullName, "index:", payload.chapterIndex);
      if (!state.userData.reading) {
        Vue.set(state.userData, 'reading', {});
      }
      Vue.set(state.userData.reading, payload.bookFullName, payload.chapterIndex);
      localStorage.setItem("userData", JSON.stringify(state.userData));
    }
  },
  actions: {
    async fetchBook ({commit}, bookInfo) {
      try {
        let bookDetail = (await api.detail(bookInfo)).data;
        let bookCatalog = (await api.catalog(bookDetail)).data;
        let book = {
          bookDetail, bookCatalog, bookInfo
        };
        commit("updateBook", book);
      } catch (e) {
        console.error(e);
      }
    }
  },
  modules: {
  }
})
