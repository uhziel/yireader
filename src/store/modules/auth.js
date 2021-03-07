import {apiLogin, apiRegister,
  apiChangePassword, setAuthorizationHeader} from "../../api"

const state = () => {
  const initState = {
    authData: {
      username: '',
      token: '',
    },
    authStatus: '',
  };

  let authDataStr = localStorage.getItem('authData');
  if (authDataStr) {
    try {
      const data = JSON.parse(authDataStr);
      initState.authData = data;
    } catch (e) {
      console.error(e);
      localStorage.removeItem('authData');
    }
  }
  setAuthorizationHeader(initState.authData.token);
  console.log("initStore authData: ", initState.authData);
  return initState;
};

const getters = {
  isLoggedIn(state) {
    return state.authData.token.length > 0;
  },
  username(state) {
    return state.authData.username;
  },
  authStatus(state) {
    return state.authStatus;
  },
};

const mutations = {
  authRequest(state) {
    state.authStatus = 'loading'
  },
  authSuccess(state, payload) {
    state.authStatus = 'success'
    state.authData.username = payload.username;
    state.authData.token = payload.token;
    localStorage.setItem('authData', JSON.stringify(state.authData));
    setAuthorizationHeader(payload.token);
  },
  authFail(state) {
    state.authStatus = 'fail';
  },
  logout(state) {
    state.authStatus = '';
    state.authData.username = '';
    state.authData.token = '';
    localStorage.setItem('authData', JSON.stringify(state.authData));
    setAuthorizationHeader('');
  },
};

const actions = {
  async login({commit}, user) {
    commit('authRequest');
    try {
      let result = (await apiLogin(user)).data;
      if (result.ret === 0) {
        commit('authSuccess', {
          username: result.username,
          token: result.token,
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
      let result = (await apiRegister(user)).data;
      if (result.ret === 0) {
        commit('authSuccess', {
          username: result.username,
          token: result.token,
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
    return (await apiChangePassword(user)).data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
