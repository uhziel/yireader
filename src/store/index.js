import Vue from 'vue'
import Vuex from 'vuex'
import bookSources from './modules/bookSources';
import books from './modules/books';
import auth from './modules/auth';

Vue.use(Vuex)

function upgradeUserData(oldUserData, newUserData) {
  if (oldUserData.version < 3) {
    oldUserData.bookshelf = {};
  }
  oldUserData.version = newUserData.version;
}

const MAX_BOOK_USER_DATA_LENGTH = 20;
const OUTDATED_INTVERL = 30 * 24 * 60 * 60 * 1000;
function clearOutdatedUserData(userData) {
  if (Object.keys(userData.bookshelf).length <= MAX_BOOK_USER_DATA_LENGTH) {
    return;
  }

  const now = Date.now();
  const toDel = [];
  for (const bookId in userData.bookshelf) {
    if (Object.hasOwnProperty.call(userData.bookshelf, bookId)) {
      const bookUserData = userData.bookshelf[bookId];
      if (!bookUserData.updatedAt) {
        toDel.push(bookId);
      }
      else if (now - bookUserData.updatedAt > OUTDATED_INTVERL) {
        toDel.push(bookId);
      }
    }
  }

  for (const bookId of toDel) {
    Vue.delete(userData.bookshelf, bookId);
  }
}

const state = () => {
  const initState = {
    userData: { 
      bookshelf: {},
      theme: {
        'font-size': 1.235
      },
      version: 3
    }, 
  };

  let userDataStr = localStorage.getItem("userData");
  if (userDataStr) {
    try {
      const oldUserData = JSON.parse(userDataStr);
      upgradeUserData(oldUserData, initState.userData);
      initState.userData = oldUserData;
    } catch (e) {
      console.error(e);
      localStorage.removeItem("userData");
    }
  }
  console.log("initStore userData: ", initState.userData);
  return initState;
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: state,
  getters: {
    getBookUserData(state) {
      return function (bookId) {
        return state.userData.bookshelf[bookId];
      };
    },
    fontSize(state) {
      return state.userData.theme['font-size'] + 'em';
    },
  },
  mutations: {
    setReading (state, payload) {
      console.log('setReading bookId:', payload.bookId, 'bookFullName:', payload.bookFullName,
        " index:", payload.chapterIndex,
        " scrollY:", payload.chapterScrollY);
      const bookUserData = state.userData.bookshelf[payload.bookId];
      if (!bookUserData) {
        Vue.set(state.userData.bookshelf, payload.bookId, {
          updatedAt: Date.now(),
          bookFullName: payload.bookFullName,
          chapterIndex: payload.chapterIndex,
          chapterScrollY: payload.chapterScrollY,
        });
      } else {
        bookUserData.updatedAt = Date.now();
        bookUserData.bookFullName = payload.bookFullName;
        bookUserData.chapterIndex = payload.chapterIndex;
        bookUserData.chapterScrollY = payload.chapterScrollY;
      }
      clearOutdatedUserData(state.userData);
      localStorage.setItem('userData', JSON.stringify(state.userData));
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
  },
  modules: {
    bookSources,
    books,
    auth,
  }
})
