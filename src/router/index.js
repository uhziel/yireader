import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/booksources',
    name: 'BookSources',
    component: () => import(/* webpackChunkName: "booksource" */ '../views/BookSources.vue'),
  },
  {
    path: '/search/:searchKey',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue'),
    props: true
  },
  {
    path: '/bookdetail/:bookId',
    name: 'BookDetail',
    component: () => import(/* webpackChunkName: "bookdetail" */ '../views/BookDetail.vue'),
    props: route => {
      const v = {
        bookId: route.params.bookId,
        name: route.query.name,
        authorName: route.query.authorName,
      };
      return v;
    },
  },
  {
    path: '/bookchapter/:bookId/:chapterIndex',
    name: 'BookChapter',
    component: () => import(/* webpackChunkName: "bookchapter" */ '../views/BookChapter.vue'),
    props: route => {
      const v = {
        bookId: route.params.bookId,
        chapterIndex: parseInt(route.params.chapterIndex),
        name: route.query.name,
        authorName: route.query.authorName,
      };
      return v;
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue'),
    meta: {
      requiresAuth: true
    }
  },
]

function scrollBehavior(to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition;
  }

  if (to.name === 'BookChapter') {
    return new Promise( resolve => {
      this.app.$root.$once('scroll-to', function(scrollY) {
        console.log('scroll-to y:', scrollY);
        resolve({x: 0, y: scrollY});
      })
    });
  }
  
  return { x: 0, y: 0 }; 
}

const router = new VueRouter({
  routes,
  scrollBehavior
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      next({
        name: 'Login',
        query: { nextUrl: to.fullPath }
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (!store.getters.isLoggedIn) {
      next();
    } else {
      next({name: 'Home'});
    }
  } else {
    next();
  }
});

export default router
