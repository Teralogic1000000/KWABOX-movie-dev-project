import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../../Views/Home.vue"),
  },
  {
    path: "/movies",
    name: "Movies",
    component: () => import("../../Views/Movie.vue"),
  },
 
  {
    path: "/favorites",
    name: "MyList",
    component: () => import("../../Views/Mylist.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
