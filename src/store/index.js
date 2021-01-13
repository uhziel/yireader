import Vue from 'vue'
import Vuex from 'vuex'
import api, {setAuthorizationHeader} from "@/api.js";

Vue.use(Vuex)

function isInBookshelf(bookshelf, bookFullName) {
  for (const bookUserData of bookshelf) {
    if (bookUserData.fullName === bookFullName) {
      return true;
    }
  }
  return false;
}

function upgradeUserData(oldUserData, newUserData) {
  if (oldUserData.version === 1 && newUserData.version === 2) {
    for (const bookUserData of oldUserData.bookshelf) {
      bookUserData.reverseOrder = false;
    }
  }
  oldUserData.version = newUserData.version;
}

export default new Vuex.Store({
  state: {
    books: {}, //<name-author, { bookDetail: {lastChapter: ""}, bookCatalog: [], bookInfo: {}, bookChapters: {} }>
    userData: { 
      bookshelf: [], //{fullName: "", chapterIndex: -1, chapterScrollY: 0.0, lastFetchTime: 0, contentChanged: false, reverseOrder: false}
      theme: {
        'font-size': 1.235
      },
      username: '',
      token: '',
      version: 2
    },
    authStatus: '',
  },
  getters: {
    isLoggedIn(state) {
      return state.userData.token.length > 0;
    },
    username(state) {
      return state.userData.username;
    },
    authStatus(state) {
      return state.authStatus;
    },
    bookshelfLength(state) {
      return state.userData.bookshelf.length;
    },
    getBookByFullName(state) {
      return function (fullName) {
        return state.books[fullName];
      };
    },
    getBookUserData(state) {
      return function (fullName) {
        for (const bookUserData of state.userData.bookshelf) {
          if (bookUserData.fullName === fullName) {
            return bookUserData;
          }
        }
        return null;
      };
    },
    isInBookshelf(state, getters) {
      return function (fullName) {
        return !!getters.getBookUserData(fullName);
      };
    },
    isReverseOrder (stete, getters) {
      return function (fullName) {
        const bookUserData = getters.getBookUserData(fullName);
        if (!bookUserData) {
          return false;
        }
        return bookUserData.reverseOrder;
      };
    },
    bookInfosInBookshelf(state, getters) {
      let bookInfos = [];
      for (const bookUserData of state.userData.bookshelf) {
        let book = getters.getBookByFullName(bookUserData.fullName);
        if (book) {
          bookInfos.push(book.bookInfo);
        }
      }
      console.log("bookInfosInBookshelf ", bookInfos);
      return bookInfos;
    },
    getReadingProcess(state, getters) {
      return function (fullName) {
        const bookUserData = getters.getBookUserData(fullName);
        if (!bookUserData) {
          return null;
        }
        const chapterIndex = bookUserData.chapterIndex;
        if (chapterIndex < 0) {
          return null;
        }
        const book = getters.getBookByFullName(fullName);
        if (!book.bookCatalog[chapterIndex]) {
          return null;
        }
        return {
          chapterIndex,
          chapterScrollY: bookUserData.chapterScrollY,
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
          const oldUserData = JSON.parse(userDataStr);
          upgradeUserData(oldUserData, state.userData);
          state.userData = oldUserData;
        } catch (e) {
          console.error(e);
          localStorage.removeItem("userData");
        }
      }
      setAuthorizationHeader(state.userData.token);
      console.log("initStore userData: ", state.userData );
      for (let i = 0; i < localStorage.length; i++) {
        let bookFullName = localStorage.key(i);
        if (bookFullName.indexOf("-") === -1 || bookFullName === "loglevel:webpack-dev-server") {
          continue;
        }
        let bookStr = localStorage.getItem(bookFullName);
        if (bookStr) {
          try {
            if (!isInBookshelf(state.userData.bookshelf, bookFullName)) {
              localStorage.removeItem(bookFullName);
              continue;
            }
            let book = JSON.parse(bookStr);
            Vue.set(state.books, bookFullName, book);
          } catch (e) {
            console.error(e);
            localStorage.removeItem(bookFullName);
          }
        }
      }
    },
    authRequest(state) {
      state.authStatus = 'loading'
    },
    authSuccess(state, payload) {
      state.authStatus = 'success'
      state.userData.token = payload.token;
      state.userData.username = payload.username;
      localStorage.setItem('userData', JSON.stringify(state.userData));
      setAuthorizationHeader(payload.token);
    },
    authFail(state) {
      state.authStatus = 'fail';
    },
    logout(state) {
      state.authStatus = '';
      state.userData.token = '';
      state.userData.username = '';
      localStorage.setItem('userData', JSON.stringify(state.userData));
      setAuthorizationHeader('');
    },
    updateBook (state, book) {
      console.log("updateBook ", book);
      if (book.bookInfo.summary.length === 0 && book.bookDetail.summary.length > 0) {
        book.bookInfo.summary = book.bookDetail.summary;
      }
      if (book.bookInfo.cover.length === 0 && book.bookDetail.cover.length > 0) {
        book.bookInfo.cover = book.bookDetail.cover;
      }
      let fullName = book.bookInfo.name + "-" + book.bookInfo.author;
      Vue.set(state.books, fullName, book);
      localStorage.setItem(fullName, JSON.stringify(book));
    },
    addToBookshelf (state, bookFullName) {
      Vue.set(state.userData.bookshelf, state.userData.bookshelf.length,
        {fullName: bookFullName, chapterIndex: -1, chapterScrollY: 0.0,
          lastFetchTime: 0, contentChanged: false, reverseOrder: false});
      localStorage.setItem('userData', JSON.stringify(state.userData));
    },
    removeFromBookshelf (state, indexInBookshelf) {
      Vue.delete(state.userData.bookshelf, indexInBookshelf);
      localStorage.setItem('userData', JSON.stringify(state.userData));
    },
    moveUpInBookshelf (state, indexInBookshelf) {
      if (indexInBookshelf <= 0 ) {
        return;
      }
      const tmp = state.userData.bookshelf[indexInBookshelf-1];
      Vue.set(state.userData.bookshelf, indexInBookshelf-1, state.userData.bookshelf[indexInBookshelf]);
      Vue.set(state.userData.bookshelf, indexInBookshelf, tmp);
      localStorage.setItem('userData', JSON.stringify(state.userData));
    },
    moveDownInBookshelf (state, indexInBookshelf) {
      if (indexInBookshelf >= state.userData.bookshelf.length - 1) {
        return;
      }
      const tmp = state.userData.bookshelf[indexInBookshelf+1];
      Vue.set(state.userData.bookshelf, indexInBookshelf+1, state.userData.bookshelf[indexInBookshelf]);
      Vue.set(state.userData.bookshelf, indexInBookshelf, tmp);
      localStorage.setItem('userData', JSON.stringify(state.userData));
    },
    setReading (state, payload) {
      console.log('setReading bookFullName:', payload.bookFullName,
        " index:", payload.chapterIndex,
        " scrollY:", payload.chapterScrollY);
      for (const bookUserData of state.userData.bookshelf) {
        if (bookUserData.fullName === payload.bookFullName) {
          bookUserData.chapterIndex = payload.chapterIndex;
          bookUserData.chapterScrollY = payload.chapterScrollY;
          localStorage.setItem('userData', JSON.stringify(state.userData));
          break;
        }
      }
    },
    setLastFetchTime (state, payload) {
      console.log('setLastFetchTime bookFullName:', payload.bookFullName, " lastFetchTime:", payload.lastFetchTime);
      for (const bookUserData of state.userData.bookshelf) {
        if (bookUserData.fullName === payload.bookFullName) {
          bookUserData.lastFetchTime = payload.lastFetchTime;
          localStorage.setItem('userData', JSON.stringify(state.userData));
          break;
        }
      }
    },
    setContentChanged (state, payload) {
      console.log('setContentChanged bookFullName:', payload.bookFullName,
        " contentChanged:", payload.contentChanged);
      for (const bookUserData of state.userData.bookshelf) {
        if (bookUserData.fullName === payload.bookFullName) {
          bookUserData.contentChanged = payload.contentChanged;
          localStorage.setItem('userData', JSON.stringify(state.userData));
          break;
        }
      }     
    },
    setReverseOrder (state, payload) {
      for (const bookUserData of state.userData.bookshelf) {
        if (bookUserData.fullName === payload.bookFullName) {
          bookUserData.reverseOrder = payload.reverseOrder;
          localStorage.setItem('userData', JSON.stringify(state.userData));
          break;
        }
      }
    },
    changeFontSize (state, payload) {
      state.userData.theme['font-size'] += payload.delta;
      if (state.userData.theme['font-size'] < 1.035) {
        state.userData.theme['font-size'] = 1.035;
      }
      localStorage.setItem('userData', JSON.stringify(state.userData));
    },
  },
  actions: {
    async login({commit}, user) {
      commit('authRequest');
      try {
        let result = (await api.login(user)).data;
        if (result.ret === 0) {
          commit('authSuccess', {
            token: result.token,
            username: result.username
          });
        } else {
          commit('authFail');
        }
        return result;
      } catch (e) {
        commit('authFail');
        throw e;
      }
    },
    async register({commit}, user) {
      commit('authRequest');
      try {
        let result = (await api.register(user)).data;
        if (result.ret === 0) {
          commit('authSuccess', {
            token: result.token,
            username: result.username
          });
        } else {
          commit('authFail');
        }
        return result;
      } catch (e) {
        commit('authFail');
        throw e;
      }
    },
    async changePassword(_, user) {
      return (await api.changePassword(user)).data;
    },
    async fetchBook ({commit, getters}, bookInfo) {
      console.log('fetchBook ', bookInfo);
      try {
        let bookDetail = (await api.detail(bookInfo)).data;
        let bookCatalog = (await api.catalog(bookDetail)).data;
        bookCatalog = bookCatalog.filter(entry => entry.url.length > 0);
        let bookChapters = {};
        let book = {
          bookDetail, bookCatalog, bookInfo, bookChapters
        };
        let fullName = book.bookInfo.name + "-" + book.bookInfo.author;
        let oldBook = getters.getBookByFullName(fullName);
        if (oldBook) {
          book.bookChapters = oldBook.bookChapters;
        }
        commit('updateBook', book);
        commit({
          type: 'setLastFetchTime',
          bookFullName: fullName,
          lastFetchTime: Date.now(),
        });
        if (oldBook) {
          if (oldBook.bookCatalog.length !== book.bookCatalog.length) {
            commit({
              type: 'setContentChanged',
              bookFullName: fullName,
              contentChanged: true,
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    async fetchAllBook({state, getters, dispatch}) {
      console.log('fetchAllBook');
      const now = Date.now();
      for (const bookUserData of state.userData.bookshelf) {
        const timeDiff = now - bookUserData.lastFetchTime;
        console.log('fetchAllBook timeDiff:', timeDiff);
        if (timeDiff > 600000) {
          const book = getters.getBookByFullName(bookUserData.fullName);
          if (book) {
            await dispatch('fetchBook', book.bookInfo);
          }
        }
      }
    },
    setBookChapters ({commit, getters}, payload) {
      console.log("setBookChapters bookFullName:", payload.bookFullName);
      const book = getters.getBookByFullName(payload.bookFullName);
      if (!book) {
        return;
      }
      book.bookChapters = payload.bookChapters;
      commit('updateBook', book);
    },
  },
  modules: {
  }
})
