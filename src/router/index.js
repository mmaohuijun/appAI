import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../components/Layout'
import store from '../vuex/store.js'
// 登录
const Login = () => import('../views/login/Login')
// 应用
const Application = () => import('../views/apps/Application')
const EditApp = () => import('../views/apps/EditApp')
const CreateApp = () => import('../views/apps/CreateApp')
// 场景
const Intents = () => import('../views/intents/Intents')
const EditIntents = () => import('../views/intents/EditIntents')
const CreateIntents = () => import('../views/intents/CreateIntents')
// 词库
const Entities = () => import('../views/entities/Entities')
const EditEntities = () => import('../views/entities/EditEntities')
const CreateEntities = () => import('../views/entities/CreateEntities')
// 模块
const Module = () => import('../views/modules/Module')

// 权限
const Auth = () => import('../views/auth/Auth')
const UserAuth = () => import('../views/auth/userAuth/UserAuth')
const EditUserAuth = () => import('../views/auth/userAuth/EditUserAuth')

const RoleAuth = () => import('../views/auth/roleAuth/RoleAuth')
const EditRoleAuth = () => import('../views/auth/roleAuth/EditRoleAuth')

const SecurityAuth = () => import('../views/auth/securityAuth/SecurityAuth')
const EditSecurityAuth = () => import('../views/auth/securityAuth/EditSecurityAuth')

const TeamAuth = () => import('../views/auth/teamAuth/TeamAuth')
const EditTeamAuth = () => import('../views/auth/teamAuth/EditTeamAuth')

const ThemeAuth = () => import('../views/auth/themeAuth/ThemeAuth')
const EditThemeAuth = () => import('../views/auth/themeAuth/EditThemeAuth')

Vue.use(Router)

const normalRouter = [
  { path: '/', name: 'Login', component: Login },
  {
    path: '/apps',
    component: Layout,
    redirect: '/apps/index',
    name: '应用',
    children: [
      { path: 'index', name: 'Application', component: Application },
      { path: 'create', name: 'CreateApp', component: CreateApp },
      { path: ':appId/editApp', name: 'EditApp', component: EditApp }
    ],
    meta: { requiresLogin: true }
  },
  {
    path: '/intents',
    component: Layout,
    redirect: '/intents/:appId/index',
    name: '场景',
    children: [
      { path: ':appId/index', name: 'Intents', component: Intents },
      { path: 'create', name: 'CreateIntents', component: CreateIntents },
      { path: ':appId/editIntents', name: 'EditIntents', component: EditIntents }
    ],
    meta: { requiresLogin: true }
  },
  {
    path: '/entities',
    component: Layout,
    redirect: '/entities/:appId/index',
    name: '词库',
    children: [
      { path: ':appId/index', name: 'Entities', component: Entities },
      { path: 'create', name: 'CreateEntities', component: CreateEntities },
      { path: ':appId/editEntities', name: 'EditEntities', component: EditEntities }
    ],
    meta: { requiresLogin: true }
  },
  {
    path: '/module',
    component: Layout,
    redirect: '/module/index',
    name: '模块',
    children: [
      { path: 'index', name: 'Module', component: Module }
    ],
    meta: { requiresLogin: true }
  },
  {
    path: '/auth',
    component: Layout,
    redirect: '/auth/index',
    name: '权限',
    children: [
      { path: 'index', name: 'Auth', component: Auth }
    ],
    meta: { requiresLogin: true }
  },
  {
    path: '/auth/userAuth',
    component: Layout,
    redirect: '/auth/userAuth/index',
    name: '用户权限',
    children: [
      { path: 'index', name: 'UserAuth', component: UserAuth },
      { path: 'edit', name: 'EditUserAuth', component: EditUserAuth }
    ],
    meta: { requiresLogin: true }
  },
  {
    path: '/auth/roleAuth',
    component: Layout,
    redirect: '/auth/roleAuth/index',
    name: '角色权限',
    children: [
      { path: 'index', name: 'RoleAuth', component: RoleAuth },
      { path: 'edit', name: 'EditRoleAuth', component: EditRoleAuth }
    ],
    meta: { requiresLogin: true }
  },
  {
    path: '/auth/securityAuth',
    component: Layout,
    redirect: '/auth/securityAuth/index',
    name: '密级权限',
    children: [
      { path: 'index', name: 'SecurityAuth', component: SecurityAuth },
      { path: 'edit', name: 'EditSecurityAuth', component: EditSecurityAuth }
    ],
    meta: { requiresLogin: true }
  },
  {
    path: '/auth/themeAuth',
    component: Layout,
    redirect: '/auth/themeAuth/index',
    name: '主题权限',
    children: [
      { path: 'index', name: 'ThemeAuth', component: ThemeAuth },
      { path: 'edit', name: 'EditThemeAuth', component: EditThemeAuth }
    ],
    meta: { requiresLogin: true }
  },
  {
    path: '/auth/teamAuth',
    component: Layout,
    redirect: '/auth/teamAuth/index',
    name: '组权限',
    children: [
      { path: 'index', name: 'TeamAuth', component: TeamAuth },
      { path: 'edit', name: 'EditTeamAuth', component: EditTeamAuth }
    ],
    meta: { requiresLogin: true }
  }
]

export const router = new Router({
  mode: 'history',
  routes: normalRouter
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresLogin)) {
    let userName = store.state.userName
    if (!userName) {
      userName = store.getters.getUserName
    }
    if (!userName) {
      next({
        path: '/'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
