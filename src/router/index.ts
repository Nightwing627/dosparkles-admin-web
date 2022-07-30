import Vue from "vue";
import VueRouter from "vue-router";
import Auth from "../views/Auth.vue";
import Chat from "../views/Chat.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Auth",
    component: Auth,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Dashboard.vue"),
  },
];

const createRouter = () =>
  new VueRouter({
    mode: 'history', // require service support
    base: process.env.BASE_URL,
    routes,
  });

const router = createRouter();

export default router;
