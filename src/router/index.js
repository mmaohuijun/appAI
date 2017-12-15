import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// 应用
const HelloWorld = () => import('../components/HelloWorld')
const Apps = () => import('../views/apps/Apps')
const CreateApp = () => import('../views/apps/CreateApp')
// 场景
const Intents = () => import('../views/intents/Intents')
const EditIntents = () => import('../views/intents/EditIntents')
const CreateIntents = () => import('../views/intents/CreateIntents')
// 词库
const Entities = () => import('../views/entities/Entities')
const EditEntities = () => import('../views/entities/EditEntities')
const CreateEntities = () => import('../views/entities/CreateEntities')
Vue.use(Router)

const normalRouter = [
  { path: '/', component: HelloWorld, name: 'helloWorld' },
  {
    path: '/apps',
    component: Apps,
    name: '应用列表'
  },
  {
    path: '/createApp',
    component: CreateApp,
    name: '创建应用'
  },
  {
    path: '/intents',
    component: Intents,
    name: '场景列表'
  },
  {
    path: '/editIntents',
    component: EditIntents,
    name: '编辑场景'
  },
  {
    path: '/createIntents',
    component: CreateIntents,
    name: '新建场景'
  },
  {
    path: '/entities',
    component: Entities,
    name: '词库列表'
  },
  {
    path: '/editEntities',
    component: EditEntities,
    name: '编辑词库'
  },
  {
    path: '/createEntities',
    component: CreateEntities,
    name: '新建词库'
  }
]
export const router = new Router({
  mode: 'history',
  routes: normalRouter
})
