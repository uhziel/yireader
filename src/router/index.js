import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
    path: '/booksource',
    name: 'BookSource',
    component: () => import(/* webpackChunkName: "booksource" */ '../views/BookSource.vue')
  },
  {
    path: '/search/:searchKey',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue'),
    props: true
  },
  {
    path: '/bookdetail/:name-:author',
    name: 'BookDetail',
    component: () => import(/* webpackChunkName: "bookdetail" */ '../views/BookDetail.vue'),
    props: true
  },
  {
    path: '/bookchapter/:name-:author/:chapterIndex',
    name: 'BookChapter',
    component: () => import(/* webpackChunkName: "bookchapter" */ '../views/BookChapter.vue'),
    props: true
  },
]

const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
})

export default router
