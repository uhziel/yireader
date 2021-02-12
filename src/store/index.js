import Vue from 'vue'
import Vuex from 'vuex'
import api, {setAuthorizationHeader} from "@/api.js";
import bookSources from './modules/bookSources';
import books from './modules/books';

Vue.use(Vuex)

function upgradeUserData(oldUserData, newUserData) {
  if (oldUserData.version === 1 && newUserData.version === 2) {
    for (const bookUserData of oldUserData.bookshelf) {
      bookUserData.reverseOrder = false;
    }
  }
  oldUserData.version = newUserData.version;
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
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
  },
  modules: {
    bookSources,
    books,
  }
})
