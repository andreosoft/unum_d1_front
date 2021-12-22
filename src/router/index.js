/** @format */

import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './../store/index';
import { axios } from './../config';
Vue.use(VueRouter);
const routes = [
  {
    path: '/signup',
    redirect: {
      name: 'Sign Up',
      params: {
        lang: 'en',
      },
    },
  },
  {
    path: '/signup/:lang',
    name: 'Sign Up',
    component: () => import('./../views/SignUp.vue'),
  },
  {
    path: '/login',
    redirect: {
      name: 'Login',
      params: {
        lang: 'en',
      },
    },
  },
  {
    path: '/login/:lang',
    name: 'Login',
    component: () => import('./../views/Login.vue'),
  },
  {
    path: '/',
    component: () => import('./../components/layout/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('./../views/Home.vue'),
        meta: {
          requiresAuth: true,
          title: 'Home',
        },
      },
      {
        path: '/chats',
        component: () => import('./../views/Chats.vue'),
        meta: {
          requiresAuth: true,
          title: 'Chats',
        },
        children: [
          {
            path: '',
            name: 'Chats',
            components: {
              list: () => import('./../components/chat/List.vue'),
              messages: () => import('./../components/chat/NoSelected.vue'),
            },
            meta: {
              hideMobileList: false,
              title: 'Chats',
            },
          },
          {
            path: ':chatId',
            name: 'Chat',
            components: {
              list: () => import('./../components/chat/List.vue'),
              messages: () => import('./../components/chat/ChatWindow.vue'),
            },
            meta: {
              hideMobileList: true,
              hideMobileTopNavbar: true,
              title: 'Chat',
            },
          },
        ],
      },
      {
        path: '/consillium',
        component: () => import('./../views/Chats.vue'),
        meta: {
          requiresAuth: true,
          title: 'Консиллиум',
        },
        children: [
          {
            path: '',
            name: 'Consilliums',
            components: {
              list: () => import('./../views/Consillium.vue'),
              messages: () => import('./../components/chat/NoSelected.vue'),
            },
          },
          {
            path: ':chatId',
            name: 'Consillium',
            components: {
              list: () => import('./../views/Consillium.vue'),
              messages: () => import('./../components/chat/ChatWindow.vue'),
            },
            meta: {
              hideMobileList: true,
              hideMobileTopNavbar: true,
            },
          },
        ],
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('./../views/Profile.vue'),
        meta: {
          requiresAuth: true,
          title: 'Мой профиль',
        },
      },
      {
        path: '/patients',
        name: 'Patients',
        component: () => import('./../views/Patients.vue'),
        meta: {
          requiresAuth: true,
          title: 'Пациенты',
          goUp: true,
        },
        children: [
          {
            path: 'new-patient',
            name: 'New patient',
            component: () => import('./../components/patient/NewPatientDialog.vue'),
          },
        ],
      },
      {
        path: '/patients/:id',
        name: 'Patient',
        component: () => import('./../components/patient/Patient.vue'),
        meta: {
          requiresAuth: true,
          title: 'Outpatient Card',
          goUp: true,
        },
      },
      {
        path: '/doctors',
        name: 'Doctors',
        component: () => import('./../views/Doctors.vue'),
        meta: {
          requiresAuth: true,
          title: 'Doctors',
        },
      },
      {
        path: '/doctors/:id',
        name: 'Doctor',
        component: () => import('./../components/doctor/Doctor.vue'),
        meta: {
          requiresAuth: true,
          title: 'Доктор',
          goUp: true,
        },
      },
      {
        path: '/schedule',
        name: 'Schedule',
        component: () => import('./../views/Schedule.vue'),
        meta: {
          requiresAuth: true,
          title: 'Schedule',
        },
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('./../views/Settings.vue'),
        meta: {
          requiresAuth: true,
          title: 'Settings',
        },
        /*         children: [
          {
            path: 'clinical-record',
            name: 'SetClinicalRecord',
            component: () => import('@/components/settings/SetClincalRecord.vue'),
          },
        ], */
      },
      {
        path: '/settings/:cname',
        name: 'Setting',
        component: () => import('@/components/settings/Setting.vue'),
        meta: {
          requiresAuth: true,
          title: 'Setting',
          goUp: true,
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
  if ((to.name === 'Login' || to.name === 'Sign Up') && store.state.auth.authStatus) {
    return next({ name: 'Dashboard' });
  }
  if (requiresAuth) {
    if (!store.state.auth.authStatus) {
      const localData = window.localStorage.getItem('neomedy');
      if (!localData) {
        return next({ name: 'Login', params: { lang: 'en' } });
      }

      const login = JSON.parse(localData).login;
      store.dispatch('auth/confirmLogin', login, { root: true }).then((status) => {
        if (status) {
          axios.defaults.headers.common.Authorization = JSON.parse(localData).token;
          store.dispatch('auth/fetchUserProfile');
          store.dispatch('auth/fetchDoctorProfile');

          return next();
        } else {
          return next({
            name: 'Login',
            params: {
              lang: 'en',
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
