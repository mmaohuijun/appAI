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
const NoIntents = () => import('../views/intents/NoIntents')
const EditIntents = () => import('../views/intents/EditIntents')
const CreateIntents = () => import('../views/intents/CreateIntents')
// 词库
const Entities = () => import('../views/entities/Entities')
const EditEntities = () => import('../views/entities/EditEntities')
const CreateEntities = () => import('../views/entities/CreateEntities')
// 模块
const Module = () => import('../views/modules/Module')

Vue.use(Router)

const normalRouter = [
  { path: '/', component: Login },
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
      { path: ':appId/nindex', name: 'NoIntents', component: NoIntents },
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
  }
]

export const router = new Router({
  mode: 'history',
  routes: normalRouter
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresLogin)) {
    if (!store.state.userName) {
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
