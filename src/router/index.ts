import {RouteRecordRaw} from 'vue-router'
import {createRouter, createWebHistory} from 'vue-router/auto'
import {setupLayouts} from 'virtual:generated-layouts'

import authGuard from '@/router/guards/auth.guard'
import appGuard from '@/router/guards/app.guard'
// import roleGuard from '@/router/guards/role.guard';

// const devGuard = roleGuard('dev');
// const adminGuard = roleGuard(['dev', 'admin']);

const authRoutes: RouteRecordRaw[] = [
  {path: '/login', name: 'Login', meta: {layout: 'auth'}, component: () => import('@/pages/login.vue'), beforeEnter: authGuard},
]

const errorRoute: RouteRecordRaw[] = [
  {path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/pages/Error.vue'), beforeEnter: appGuard},
  {path: '/error/:type', name: 'Error', component: () => import('@/pages/Error.vue'), beforeEnter: appGuard},
]

const uuid = '[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}'

const appRoutes: RouteRecordRaw[] = [

  {path: '/', name: 'Home', component: () => import('@/pages/Home.vue'), beforeEnter: appGuard},

  {path: '/user', name: 'User', component: () => import('@/pages/user/UserTable.vue'), beforeEnter: appGuard},
  {path: '/user/new', name: 'UserNew', component: () => import('@/pages/user/UserForm.vue'), beforeEnter: appGuard},
  {path: '/user/:id(\\d+)', name: 'UserForm', component: () => import('@/pages/user/UserForm.vue'), beforeEnter: appGuard},

  {path: '/workspace', name: 'Workspace', component: () => import('@/pages/workspace/WorkspaceTable.vue'), beforeEnter: appGuard},
  {path: '/workspace/new', name: 'WorkspaceNew', component: () => import('@/pages/workspace/WorkspaceForm.vue'), beforeEnter: appGuard},
  {path: '/workspace/:wid(\\d+)', name: 'WorkspaceForm', component: () => import('@/pages/workspace/WorkspaceForm.vue'), beforeEnter: appGuard},

  {path: `/workspace/:wid(${uuid})/table`, name: 'Table', component: () => import('@/pages/table/TableTable.vue'), beforeEnter: appGuard},
  {path: `/workspace/:wid(${uuid})/table/new`, name: 'TableNew', component: () => import('@/pages/table/TableForm.vue'), beforeEnter: appGuard},
  {path: `/workspace/:wid(${uuid})/table/:id(\\d+)`, name: 'TableForm', component: () => import('@/pages/table/TableForm.vue'), beforeEnter: appGuard},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL || '/admin/'),
  extendRoutes: () => setupLayouts([...appRoutes, ...authRoutes, ...errorRoute]),
})

export default router
