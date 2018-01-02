<template>
  <div class="layout">
    <Menu mode="horizontal" theme="dark" active-name="1" @on-select="selectMenu">
            <div class="layout-logo"><img src="../assets/logo.png" alt="" style="width:40px;margin-left:15px; "></div>
            <div class="layout-nav">
              <Submenu name="3">
                  <template slot="title">
                      <Icon type="stats-bars"></Icon>
                      {{this.getAppName}}
                  </template>
                    <MenuItem name="createApp" @click.native="gotoCreateApp">创建应用</MenuItem>
                    <MenuItem name="showApp" @click.native="gotoApp">查看所有应用</MenuItem>
                    <MenuGroup title="所有应有">
                      <MenuItem :name="index"  v-for="(item, index) in appList" :key="item.id" @click.native="gotoIntents(index)">
                        {{item.name}}
                        <Icon type="gear-a" class="drop-down-list"></Icon>
                      </MenuItem>
                    </MenuGroup>
              </Submenu>
              <MenuItem name="2" @click.native="gotoIntents(-1)">
                场景
              </MenuItem>  
              <MenuItem name="3" @click.native="gotoEntities">
                词库
              </MenuItem>
              <MenuItem name="4" @click.native="gotoModules">
                模型
              </MenuItem>
            </div>
        </Menu>
        <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'layout',
  data () {
    return {
      index: 0, // 选中应用列表项的index
      appList: [
        {
          name: '',
          id: ''
        }
      ], // 应用列表
      ifIntents: true, // 是否存在场景
      intentList: [],
      appId: '' // 被选中的应用
    }
  },
  computed: {
    getAppId () {
      let appId
      appId = this.$store.state.appId
      if (!appId) {
        appId = this.$store.getters.getAppId
      }
      return appId
    },
    getAppName () {
      // return this.$store.getters.getAppName
      let appName
      appName = this.$store.state.appName
      if (!appName) {
        appName = this.$store.getters.getAppName
      }
    //   appName = this.$store.getters.getAppName
    //   if (!appName) {
    //     appName = '应用'
    //   }
      return appName
    }
  },
  methods: {
    // 导航栏所有应用列表
    getAppList () {
      let name = ''
      this.$axios.post('app/list', {name: name}).then(response => {
        if (response.data) {
          this.appList = response.data.list
          // this.$store.dispatch('setAppId', this.appList[0].id)
        }
      })
    },
    // 场景 词库 菜单
    selectMenu (name) {
      if (name === 2) {
        this.$router.push({ name: 'Intents', params: { appId: this.getAppId } })
      } else if (name === '3') {
        this.$router.push({ name: 'Entities', params: { appId: this.getAppId } })
      }
      console.log('appId', this.getAppId)
    },
    getIntentsList (appId) {
      // this.appId = $Storage.sessionStorage.getItem('appId')
      this.$axios.post('intent/list', { appId: appId, name: '' }).then(response => {
        // console.log(response.data.list.length)
        if (response.data.list.length > 0) {
          this.ifIntents = true
          this.intentList = response.data.list
        } else {
          this.ifIntents = false
        }
      })
    },
    // 查看所有应用
    gotoApp () {
      console.log('gotoApp')
      this.$router.push('/apps/index')
    },
    // 创建应用
    gotoCreateApp () {
      this.$router.push({ name: 'CreateApp' })
    },
    // 查看某应用下 所有场景
    gotoIntents (index) {
      console.log('gotoIntents', index)
      if (index !== -1) {
        console.log('index', index)
        this.$store.dispatch('setAppId', this.appList[index].id)
        this.$store.dispatch('setAppName', this.appList[index].name)
        this.$router.push({ name: 'Intents', params: { appId: this.appList[index].id } })
        // 强制页面刷新 修改
        this.$router.go(0)
      } else {
        this.$router.push({ name: 'Intents', params: { appId: this.getAppId } })
      }
    },
    // 查看某应用下 所有词库
    gotoEntities () {
      this.$router.push({ name: 'Entities', params: { appId: this.getAppId } })
    },
    // 跳转模态页面
    gotoModules () {
      this.$router.push({ name: 'Module' })
    }
  },
  created () {
    this.getAppList()
  }
}
</script>

<style lang="less">
  // 导航条样式
  .layout {
        background: #f5f7f9;
        margin-bottom: 30px;
    }
    .layout-logo {
        // width: 100px;
        // height: 30px;
        // background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 2px;
        left: 20px;
    }
    .layout-nav {
        width: 420px;
        margin: 0 auto;
    }
    .drop-down-list { 
      float: right;
      padding-left: 150px;
      margin-top:-15px;
    }
    .layout>ul {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
    }
    .layout>div {
      background: #fff;
      padding: 30px 30px 0 30px;
      border: none;
      margin-top: 50px;
    }

    /* 没有应用、场景、词库列表 apps/intents/entities */ 
    .no-list {
      text-align: center;
      font-size: 16px;
      margin-top: 100px;
    }
    .app-header {
    float: left;
    margin-top: 20px;
    margin-bottom: 20px;
    clear: both;
    h1 {
      clear: both
    }  
  }
  // 有列表情况 apps/intents/entities
  .lf {
    float: left
  }
  .rt {
    float: right
  }
  .list-group {
    margin-top: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    li {
      border: 1px solid #ccc;
      border-bottom: none;
      font-size: 14px;
      padding:8px 10px;

      a {
        color: #333;
      }

      &:hover {
      // cursor: pointer
      }

      &:hover .app-icon {
        display: block;
      }
    }  
  }
  .app-icon {
    position: relative;
    top: 2px;
    display: none;
    font-size: 16px;
    color: #333;
  }
  // 添加/编辑页面 create/edit
  .create-box {
      .my-input {
      outline: none;
      border: 1px solid #ccc;
      width: 100%;
      padding: 5px;
      margin-bottom: 1px;
    }
    // 左侧侧边栏 列表
    aside {
      width: 300px;
      border: 1px solid #ccc;
      padding: 15px 0;
      margin-right: 15px;
      border-bottom: none;
      position: fixed;
      left: 0;
      top: 60px;
      height: 100%;
      // background: #ccc;
      input {
      width: 290px;
      outline: none;
      border: none;
      padding: 10px 15px;
      }
      h2 {
        border-bottom: 1px solid #ccc;
        padding-bottom: 15px;
        width: 300px;
        padding-left: 15px;
      }
      ul {
        border-top: 1px solid #ccc;
        li {
          // border-bottom: 1px solid #ccc;       
          a {
            width: 100%;
            display: inline-block;
            padding: 8px 15px;
            color: #333;

            &:hover {
              color: #fff;
            }
          }

          &:hover a {
            cursor: pointer;
          background: #9399A6;
          }
        }
      }
    }
    .form {
      margin-left: 300px;
    }
  }
    
</style>
