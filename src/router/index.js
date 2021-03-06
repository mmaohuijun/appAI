import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../components/Layout'
import store from '../vuex/store.js'
// 登录
const Login = () => import('../views/setting/Login')
const ModifyPwd = () => import('../views/setting/ModifyPwd')

// 模型管理
const Application = () => import('../views/apps/application/Application') // 应用
const EditApp = () => import('../views/apps/application/EditApp')
const CreateApp = () => import('../views/apps/application/CreateApp')
const Intents = () => import('../views/apps/intents/Intents') // 场景
const EditIntents = () => import('../views/apps/intents/EditIntents')
const CreateIntents = () => import('../views/apps/intents/CreateIntents')
const Entities = () => import('../views/apps/entities/Entities') // 词库
const EditEntities = () => import('../views/apps/entities/EditEntities')
const CreateEntities = () => import('../views/apps/entities/CreateEntities')
const Module = () => import('../views/apps/modules/Module') // 模型

// 权限
const UserAuth = () => import('../views/auth/UserAuth')
const SecurityAuth = () => import('../views/auth/SecurityAuth')
const TeamAuth = () => import('../views/auth/TeamAuth')
const ThemeAuth = () => import('../views/auth/ThemeAuth')

const RoleAuth = () => import('../views/auth/roleAuth/RoleAuth')
const DisUser = () => import('../views/auth/roleAuth/DisUser')
const DisThemeUser = () => import('../views/auth/roleAuth/DisThemeUser')

// 微服务管理
const MiService = () => import('../views/miService/MiService')
const EditMicro = () => import('../views/miService/EditMicro')

// 流程管理
const Flow = () => import('../views/flow/Flow')
const EditFlow = () => import('../views/flow/EditFlow')
Vue.use(Router)

// const path = store.getters.BASE_PATH

// export const keyRouter = {
//   Apps: {
//     path: '/app',
//     component: Layout,
//     name: '模型管理',
//     children: [
//       {
//         path: 'application',
//         name: '应用',
//         component: Layout,
//         children: [
//           { path: 'index', name: 'Application', component: Application },
//           { path: 'create', name: 'CreateApp', component: CreateApp },
//           { path: 'edit', name: 'EditApp', component: EditApp }
//         ]
//       },
//       {
//         path: ':appId/intents',
//         name: '场景',
//         component: Layout,
//         children: [
//           { path: 'index', name: 'Intents', component: Intents },
//           { path: 'create', name: 'CreateIntents', component: CreateIntents },
//           { path: 'edit', name: 'EditIntents', component: EditIntents }
//         ]
//       },
//       {
//         path: ':appId/entities',
//         name: '词库',
//         component: Layout,
//         children: [
//           { path: 'index', name: 'Entities', component: Entities },
//           { path: 'create', name: 'CreateEntities', component: CreateEntities },
//           { path: 'edit', name: 'EditEntities', component: EditEntities }
//         ]
//       },
//       {
//         path: 'modules',
//         name: '模型',
//         component: Layout,
//         redirect: '/modules/index',
//         children: [
//           { path: 'index', name: 'Module', component: Module }
//         ]
//       }
//     ]
//   },
//   Auth: {
//     path: '/auth',
//     name: '权限管理',
//     children: [
//       { path: 'userAuth', name: 'UserAuth', component: UserAuth },
//       { path: 'teamAuth', name: 'TeamAuth', component: TeamAuth },
//       { path: 'themeAuth', name: 'ThemeAuth', component: ThemeAuth },
//       { path: 'securityAuth', name: 'SecurityAuth', component: SecurityAuth },
//       {
//         path: 'roleAuth',
//         name: '角色权限',
//         component: Layout,
//         children: [
//           { path: 'index', name: 'RoleAuth', component: RoleAuth },
//           { path: 'disUser', name: 'DisUser', component: DisUser },
//           { path: 'disThemeUser', name: 'DisThemeUser', component: DisThemeUser }
//         ],
//         meta: { requiresLogin: true }
//       }
//     ]
//   }
// }

const normalRouter = [
  { path: '/', name: 'Login', component: Login },
  { path: '/modify', name: 'ModifyPwd', component: ModifyPwd },
  {
    path: '/app',
    component: Layout,
    name: '模型管理',
    children: [
      { path: 'application/index', name: 'Application', component: Application },
      { path: 'application/create', name: 'CreateApp', component: CreateApp },
      { path: 'application/edit', name: 'EditApp', component: EditApp },
      { path: 'intents/index', name: 'Intents', component: Intents },
      { path: 'intents/create', name: 'CreateIntents', component: CreateIntents },
      { path: 'intents/edit', name: 'EditIntents', component: EditIntents },
      { path: 'entities/index', name: 'Entities', component: Entities },
      { path: 'entities/create', name: 'CreateEntities', component: CreateEntities },
      { path: 'entities/edit', name: 'EditEntities', component: EditEntities },
      { path: 'modules/indexindex', name: 'Module', component: Module }
    ],
    meta: { requiresLogin: true, requiresAuth: true }
  },
  {
    path: '/auth',
    component: Layout,
    name: '权限',
    children: [
      { path: 'userAuth', name: 'UserAuth', component: UserAuth },
      { path: 'teamAuth', name: 'TeamAuth', component: TeamAuth },
      { path: 'themeAuth', name: 'ThemeAuth', component: ThemeAuth },
      { path: 'securityAuth', name: 'SecurityAuth', component: SecurityAuth },
      { path: 'roleAuth/index', name: 'RoleAuth', component: RoleAuth },
      { path: 'roleAuth/disUser', name: 'DisUser', component: DisUser },
      { path: 'roleAuth/disThemeUser', name: 'DisThemeUser', component: DisThemeUser }
    ],
    meta: { requiresLogin: true, requiresAuth: true }
  },
  {
    path: '/micro',
    component: Layout,
    name: '微服务管理',
    children: [
      { path: 'miService', name: 'MiService', component: MiService },
      { path: 'editMicro', name: 'EditMicro', component: EditMicro }
    ],
    meta: { requiresLogin: true, requiresAuth: true }
  },
  {
    path: '/flow',
    component: Layout,
    name: '流程管理',
    children: [
      { path: 'flow', name: 'Flow', component: Flow },
      { path: 'editFlow', name: 'EditFlow', component: EditFlow }
    ],
    meta: { requiresLogin: true, requiresAuth: true }
  }
]

export const router = new Router({
  mode: 'history',
  routes: normalRouter,
  scrollBehavior: () => ({ y: 0 })
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresLogin)) {
    if (store.getters.loginStatus || store.getters.hasUserInfo) {
      if (store.getters.auth.length === 0) {
        store.dispatch('getUserInfoFromStorage')
      }
      if (to.matched.some(record => record.meta.requiresAuth)) {
        next()
      } else {
        console.log('您没有权限')
      }
    } else {
      next({ name: 'Login' })
    }
  } else {
    next()
  }
})
