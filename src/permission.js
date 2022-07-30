import router from './router';
import store from './store';
import { getToken } from '@/utils/auth'; // get token from cookie

router.beforeEach(async (to, from, next) => {
  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === '/logout') {
      await store.dispatch('user/logout');
      next({ name: 'Auth' });
    } else {
      if (!store.state.user.username) {
        try {
          // get user info
          await store.dispatch('user/getInfo');
          next({ name: 'Dashboard' });
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken');
          next({ name: 'Auth' });
        }
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

router.afterEach(() => {
});
