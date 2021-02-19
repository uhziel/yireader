import Vue from 'vue'
import Vuex from 'vuex'
import bookSources from './modules/bookSources';
import books from './modules/books';
import auth from './modules/auth';

Vue.use(Vuex)

function upgradeUserData(oldUserData, newUserData) {
  if (oldUserData.version === 1 && newUserData.version === 2) {
    for (const bookUserData of oldUserData.bookshelf) {
      bookUserData.reverseOrder = false;
    }
  }
  oldUserData.version = newUserData.version;
}

const state = () => {
  const initState = {
    userData: { 
      bookshelf: [], //{bookId: "", bookFullName: "", chapterIndex: -1, chapterScrollY: 0.0}
      theme: {
        'font-size': 1.235
      },
      version: 2
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
        for (const bookUserData of state.userData.bookshelf) {
          if (bookUserData.bookId === bookId) {
            return bookUserData;
          }
        }
        return null;
      };
    },
  },
  mutations: {
    addToBookshelf (state, payload) {
      Vue.set(state.userData.bookshelf, state.userData.bookshelf.length,
        {bookId: payload.bookId, bookFullName: payload.bookFullName, chapterIndex: -1, chapterScrollY: 0.0});
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
      console.log('setReading bookId:', payload.bookId, 'bookFullName:', payload.bookFullName,
        " index:", payload.chapterIndex,
        " scrollY:", payload.chapterScrollY);
      for (const bookUserData of state.userData.bookshelf) {
        if (bookUserData.bookId === payload.bookId) {
          bookUserData.bookFullName = payload.bookFullName;
          bookUserData.chapterIndex = payload.chapterIndex;
          bookUserData.chapterScrollY = payload.chapterScrollY;
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
    logout (state) {
      state.userData.bookshelf = [];
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
