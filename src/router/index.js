import Vue from "vue";
import VueRouter from "vue-router";
import store from "./../store/index";
import { axios } from "./../config";
Vue.use(VueRouter);
const routes = [
  {
    path: "/signup",
    redirect: {
      name: "Sign Up",
      params: {
        lang: "en",
      },
    },
  },
  {
    path: "/signup/:lang",
    name: "Sign Up",
    component: () => import("./../views/SignUp.vue"),
  },
  {
    path: "/login",
    redirect: {
      name: "Login",
      params: {
        lang: "en",
      },
    },
  },
  {
    path: "/login/:lang",
    name: "Login",
    component: () => import("./../views/Login.vue"),
  },
  {
    path: "/",
    component: () => import("./../components/layout/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("./../views/Home.vue"),
        meta: {
          requiresAuth: true,
          title: "Главная",
        },
      },
      {
        path: "/profile",
        name: "Profile",
        component: () => import("./../views/Profile.vue"),
        meta: {
          requiresAuth: true,
          title: "Мой профиль",
        },
      },
      {
        path: "/patients",
        name: "Patients",
        component: () => import("./../views/Patients.vue"),
        meta: {
          requiresAuth: true,
          title: "Пациенты",
        },
      },
      {
        path: "/patients/:id",
        name: "Patient",
        component: () => import("./../components/patient/Patient.vue"),
        meta: {
          requiresAuth: true,
          title: "Амбулаторная карта пациента",
        },
      },
      {
        path: "/doctors",
        name: "Doctors",
        component: () => import("./../views/Doctors.vue"),
        meta: {
          requiresAuth: true,
          title: "Докторы",
        },
      },
      {
        path: "/doctors/:id",
        name: "Doctor",
        component: () => import("./../components/doctor/Doctor.vue"),
        meta: {
          requiresAuth: true,
          title: "Доктор",
        },
      },
      {
        path: "/schedule",
        name: "Schedule",
        component: () => import("./../views/Schedule.vue"),
        meta: {
          requiresAuth: true,
          title: "Расписание",
        },
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((route) => route.meta.requiresAuth);
  if (
    (to.name === "Login" || to.name === "Sign Up") &&
    store.state.auth.authStatus
  ) {
    return next({ name: "Dashboard" });
  }
  if (requiresAuth) {
    if (!store.state.auth.authStatus) {
      const localData = window.localStorage.getItem("neomedy");
      if (!localData) {
        return next({ name: "Login", params: { lang: "en" } });
      }

      const login = JSON.parse(localData).login;
      store
        .dispatch("auth/confirmLogin", login, { root: true })
        .then((status) => {
          if (status) {
            axios.defaults.headers.common.Authorization = JSON.parse(
              localData
            ).token;
            store.dispatch("auth/fetchUserProfile");
            store.dispatch("auth/fetchDoctorProfile");

            return next();
          } else {
            return next({
              name: "Login",
              params: {
                lang: "en",
              },
            });
          }
        });
    } else {
      return next();
    }
  } else {
    next();
  }
});

export default router;
