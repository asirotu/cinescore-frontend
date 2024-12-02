import { createRouter, createWebHistory } from 'vue-router';
import MoviesList from '../components/Movies.vue';
import MovieDetails from '../components/MovieDetails.vue';
import MoviesAdmin from '@/components/MoviesAdmin.vue';
import MoviesForm from '@/components/MoviesForm.vue';
import DirectorsList from '../components/Directors.vue';
import DirectorMovies from '@/components/DirectorMovies.vue';
import DirectorsAdmin from '@/components/DirectorsAdmin.vue';
import DirectorsForm from '@/components/DirectorsForm.vue';
import LoginForm from '../components/Login.vue';
import RegisterForm from '../components/Register.vue';
import UsersAdmin from '@/components/UsersAdmin.vue';
import UsersForm from '@/components/UsersForm.vue';
import Users from '@/components/Users.vue';

const routes = [
  { path: '/login', component: LoginForm },
  { path: '/register', component: RegisterForm },

  { path: '/movies', component: MoviesList, meta: { requiresAuth: true } },
  { path: '/directors', component: DirectorsList, meta: { requiresAuth: true } },
  { path: '/users', component: Users, meta: { requiresAuth: true } },
  { path: '/edit/user/:id', component: UsersForm, meta: { requiresAuth: true } },
  
  { path: '/movies/:id', component: MovieDetails, meta: { requiresAuth: true } },
  { path: '/director/:id', component: DirectorMovies, meta: { requiresAuth: true } },

  { path: '/admin/movies', component: MoviesAdmin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/directors', component: DirectorsAdmin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/users', component: UsersAdmin, meta: { requiresAuth: true, requiresAdmin: true } },

  { path: '/admin/edit/movies/:id', component: MoviesForm, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/add/movie', component: MoviesForm, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/edit/directors/:id', component: DirectorsForm, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/add/director', component: DirectorsForm, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/edit/users/:id', component: UsersForm, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/add/user', component: UsersForm, meta: { requiresAuth: true, requiresAdmin: true } },
  
  { path: '/', redirect: ({ query: { isAdmin } }) => {
    return isAdmin ? '/movies' : '/admin/movies';
}},
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

function isTokenExpired() {
  const expirationTime = localStorage.getItem('tokenExpiration');
  if (!expirationTime) return true;
  const now = new Date().getTime();
  return now > expirationTime;
}

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('authToken');
  const isAdmin = localStorage.getItem('userRole') === 'ROLE_ADMIN';

  if (to.matched.some(record => record.meta.requiresAuth) && (!isLoggedIn || isTokenExpired())) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
    next('/login');
  } 
  else if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
    next('/movies');
  } else {
    next();
  }
});

export default router;
