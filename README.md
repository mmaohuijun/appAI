# appai

> A Vue.js project

## Build Setup

``` bash
# 安装项目相关依赖
npm install

# 启动本地服务器于 localhost:8080
npm run dev

# 生产环境代码打包
npm run build

```

======================================================================================

## 页面结构

1. 模型管理 apps
    1. 应用 application
        * 应用列表 Application.vue
        * 创建应用 CreateApp.vue
        * 编辑应用 EditApp.vue
    2. 词库 entities
        * 词库列表 Entities.vue
        * 创建词库 CreateEntities.vue
        * 编辑词库 EditEntities.vue
    3. 场景 intents
        * 场景列表 Intentes.vue
        * 创建场景 CreateIntents.vue
        * 编辑场景 EditIntents.vue
    4. 模型 modules
        * 模型 Modules.vue
2. 权限管理 auth
    1. 角色权限 roleAuth
        * 分配主题 DisThemeUser.vue
        * 分配用户 DisUser.vue
        * 分配权限 RoleAuth.vue
    2. 主题权限 ThemeAuth.vue
    3. 密集权限 SecurityAuth.vue
    4. 用户权限 UserAuth.vue
    5. 组权限 TeamAuth.vue
3. 流程管理 flow
    1. 流程列表 Flow.vue
    2. 编辑流程 EditFlow.vue
4. 微服务管理 miService
    1. 微服务列表 MiService.vue
    2. 编辑微服务 EditMicro.vue
5. 设置 setting
    1. 登录 Login.vue
    2. 修改密码 ModifyPwd.vue
6. 碎片化平台（待续...）
7. 数据安全管理（待续...）

项目部分截图
![](./src/assets/01.png '应用列表')
![](./src/assets/02.png '应用列表')
![](./src/assets/03.png '应用列表')
![](./src/assets/04.png '应用列表')
![](./src/assets/05.png '应用列表')
![](./src/assets/06.png '应用列表')


For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
