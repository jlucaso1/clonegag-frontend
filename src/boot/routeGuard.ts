import { Notify } from 'quasar';
import { boot } from 'quasar/wrappers';
import { useStore } from 'src/stores/main';

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      const store = useStore();
      const isAuthenticated = store.isLoggedIn;
      if (!isAuthenticated) {
        Notify.create({
          message: 'Você precisa estar autenticado!',
          color: 'negative',
          timeout: 3000,
        });
        next({
          path: '/auth/login',
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    } else {
      next();
    }
  });
});
