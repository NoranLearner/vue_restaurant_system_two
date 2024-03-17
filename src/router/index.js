import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUpView from '../views/SignUpView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import UpdateProfileView from '../views/UpdateProfileView.vue'
import AddNewLocation from '@/components/locations/AddNewLocation.vue'
import DeleteLocation from '@/components/locations/DeleteLocation.vue'
import DeleteAllLocations from '@/components/locations/DeleteAllLocations.vue'
import UpdateLocation from '@/components/locations/UpdateLocation.vue'
import Menu from '@/components/menu/Menu.vue'
import ViewCategories from '@/components/menu/ViewCategories.vue'
import AddNewCategory from '@/components/menu/AddNewCategory.vue'
import ErrorPageView from '../views/ErrorPageView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta:{
      title: 'Home',
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/sign-up',
    name: 'signup',
    component: SignUpView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView
  },
  {
    path: '/update-profile',
    name: 'update-profile',
    component: UpdateProfileView
  },
  {
    path: '/add-new-location',
    name: 'AddNewLocation',
    component: AddNewLocation
  },
  {
    path: '/delete-location/:locationId',
    name: 'DeleteLocation',
    component: DeleteLocation
  },
  {
    path: '/delete-all-locations',
    name: 'DeleteAllLocations',
    component: DeleteAllLocations
  },
  {
    path: '/update-location/:locationId',
    name: 'UpdateLocation',
    component: UpdateLocation
  },
  {
    path: '/menu/location/:locationId',
    name: 'Menu',
    component: Menu
  },
  {
    path: '/menu/categories/view/:locationId',
    name: 'ViewCategories',
    component: ViewCategories
  },
  {
    path: '/menu/categories/add/:locationId',
    name: 'AddNewCategory',
    component: AddNewCategory
  },
  // Stays Last
  {
    path: '/:catchAll(.*)',
    name: 'error-page',
    component: ErrorPageView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {

  // https://www.youtube.com/watch?v=W6qpsmkuJ8c

  if(to.meta.title !== undefined){
    document.title = `${to.name} | ${to.meta.title} | ${process.env.VUE_APP_TITLE}`;
  } else {
    if(to.name == null){
      document.title = `Unknown Page | ${process.env.VUE_APP_TITLE}`;
    } else{
      document.title = `${to.name} | ${process.env.VUE_APP_TITLE}`;
    }
  }

  next();
});

export default router
