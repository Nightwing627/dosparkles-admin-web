import { getToken, setToken, removeToken } from '@/utils/auth';

const state = {
  token: getToken(),
  username: '',
  id: -1,
  roles: [],
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERNAME: (state, username) => {
    state.username = username;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_ID: (state, id) => {
    state.id = id;
  },
};

const actions = {
  facebookLogin({ rootGetters, commit, dispatch }, authResponse) {
    return new Promise((resolve, reject) => {
      authResponse.access_token = authResponse.accessToken;
      const url = Object.keys(authResponse)
        .map(function (k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(authResponse[k]);
        })
        .join('&');

      rootGetters.strapi.clearToken();
      rootGetters.strapi
        .request('get', '/auth/facebook/callback?' + url)
        .then((response) => {
          commit('SET_ROLES', [response.user.role.name]);
          commit('SET_USERNAME', response.user.email);
          commit('SET_TOKEN', response.jwt);
          commit('SET_ID', response.user.id);

          setToken(response.jwt);

          dispatch('changeRoles');

          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  googleLogin({ rootGetters, commit, dispatch }, GoogleUser) {
    if (GoogleUser) {
      let token = GoogleUser.getAuthResponse().access_token;

      return new Promise((resolve, reject) => {
        rootGetters.strapi.clearToken();
        rootGetters.strapi
          .request('get', '/auth/google/callback?access_token=' + token)
          .then((response) => {
            commit('SET_ROLES', [response.user.role.name]);
            commit('SET_USERNAME', response.user.email);
            commit('SET_TOKEN', response.jwt);
            commit('SET_ID', response.user.id);

            setToken(response.jwt);

            dispatch('changeRoles');

            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  },
  forgotPassword({ rootGetters }, userInfo) {
    const { username } = userInfo;
    return new Promise((resolve, reject) => {
      rootGetters.strapi.clearToken();
      rootGetters.strapi
        .forgotPassword(username.trim(), 'https://admin.dosparkles.com/reset-password')
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  changePassword({ state, rootGetters, dispatch }, userInfo) {
    const { password } = userInfo;
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const code = Math.random().toString(36).substring(7);
      await rootGetters.strapi
        .updateEntry('users', state.id, { resetPasswordToken: code })
        // eslint-disable-next-line no-unused-vars
        .then((response) => {
        })
        .catch((error) => {
          reject(error);
        });
      await rootGetters.strapi
        .resetPassword(code, password, password)
        // eslint-disable-next-line no-unused-vars
        .then(async (response) => {
          await dispatch('logout');
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  resetPassword({ rootGetters }, userInfo) {
    const { code, password } = userInfo;
    return new Promise((resolve, reject) => {
      rootGetters.strapi.clearToken();
      rootGetters.strapi
        .resetPassword(code, password, password)
        // eslint-disable-next-line no-unused-vars
        .then((response) => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  //check old password
  async checkOldPassword({ state, rootGetters }, oldPassword) {
    if (!state.token) {
      return false;
    }
    rootGetters.strapi.clearToken();

    try {
      await rootGetters.strapi.login(state.username.trim(), oldPassword);
      rootGetters.strapi.setToken(state.token);
      return true;
    } catch (e) {
      rootGetters.strapi.setToken(state.token);
      return false;
    }
  },
  // user login
  login({ rootGetters, commit, dispatch }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      rootGetters.strapi
        .login(username.trim(), password)
        .then((response) => {
          // console.log('response', response);
          commit('SET_ROLES', [response.user.role.name]);
          commit('SET_USERNAME', response.user.email);
          commit('SET_TOKEN', response.jwt);
          commit('SET_ID', response.user.id);

          setToken(response.jwt);

          dispatch('changeRoles');
          resolve();
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  // user register
  register({ rootGetters, commit, dispatch }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      rootGetters.strapi.clearToken();
      rootGetters.strapi
        .register(username.trim(), username.trim(), password)
        .then((response) => {
          commit('SET_ROLES', [response.user.role.name]);
          commit('SET_USERNAME', response.user.email);
          commit('SET_TOKEN', response.jwt);
          commit('SET_ID', response.user.id);

          setToken(response.jwt);

          dispatch('changeRoles');
          resolve();

          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // set guest mode
  setGuestMode({ commit }, username) {
    return new Promise((resolve) => {
      const data = {
        roles: ['guest'],
        username,
        id: -1,
      };

      commit('SET_ROLES', data.roles);
      commit('SET_USERNAME', data.username);
      commit('SET_ID', data.id);
      resolve(data);
    });
  },
  // get user info
  getInfo({ rootGetters, commit, dispatch, state }) {
    // // console.log(state.token);
    if (state.token) {
      return new Promise((resolve, reject) => {
        rootGetters.strapi.setToken(state.token);
        rootGetters.strapi
          .request('get', '/users/me')
          .then(async (response) => {
            // console.log('me', response);

            if (!response) {
              reject('Verification failed, please Login again.');
            }

            if (!response.role || !response.role.name) {
              reject('getInfo: roles must be assigned!');
            }
            commit('SET_ROLES', [response.role.name]);
            commit('SET_USERNAME', response.email);
            commit('SET_ID', response.id);

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    } else {
      dispatch('logout');
    }
  },
  updateProfile({ rootGetters, dispatch, state }, data) {
    return new Promise((resolve, reject) => {
      rootGetters.strapi
        .updateEntry('users', state.id, data)
        .then(async (response) => {
          await dispatch('getInfo');
          resolve(response);
        })
        .catch((error) => {
          // // console.log(error)
          reject(error);
        });
    });
  },
  // user logout
  logout({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      commit('SET_USERNAME', null);
      commit('SET_ID', -1);

      removeToken();
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      removeToken();
      resolve();
    });
  },

  // dynamically modify permissions
  changeRoles() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      // generate accessible routes map based on roles
      // const accessRoutes = await dispatch('permission/generateRoutes', state.roles, { root: true });

      // dynamically add accessible routes
      // router.addRoutes(accessRoutes);

      // reset visited views and cached views
      // dispatch('tagsView/delAllViews', null, { root: true });

      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
