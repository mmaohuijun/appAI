<template>
  <div class="layout">
    <div class="header">
      <Menu mode="horizontal" active-name="1" @on-select="selectMenu">
        <div class="layout-logo">
          <img src="../assets/logo.png" alt="">
        </div>
        <div class="layout-logout">
          <p>
            Hi,{{this.$store.state.userName || this.$store.getters.getUserName}}
            <Dropdown>
                <a href="javascript:void(0)">
                    设置
                    <Icon type="arrow-down-b" style="margin-left: 5px;"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem>修改密码</DropdownItem>
                    <DropdownItem @click.native="logout">安全退出</DropdownItem>
                </DropdownMenu>
            </Dropdown>  
          </p>
        </div>
      </Menu>
    </div>
    
  <div class="sider">
     <ul class="ivu-menu ivu-menu-light ivu-menu-vertical" style="width: 240px;">
      <li 
        class="ivu-menu-submenu" 
        v-for="(item, index) in sideBarMenu" 
        :key="index" 
        :class="showSubMenu&&selectIndex===index? 'ivu-menu-opened' : ''"
        @click="showSub(index)">
        <div class="ivu-menu-submenu-title" >
          {{ item.title }}
          <Icon type="arrow-up-b" style="float: right" v-if="showSubMenu&&index===selectIndex" :key="index"></Icon>
          <Icon type="arrow-down-b" style="float: right;" v-else></Icon>
        </div>
        <transition name="slide-up">
          <ul class="ivu-menu" v-if="item.children" v-show="showSubMenu&&index===selectIndex">
            <li 
              class="ivu-menu-item" 
              :class="selectItem&&item.name===selectName?'ivu-menu-item-selected':''"
              @click.stop="selectMenu(item.name)"
              v-for="(item, index) in item.children" 
              :key="index" :item="item.children">
              {{ item.title }}
            </li>
          </ul>
        </transition>
      </li>
    </ul>
    </div>
        <div class="content">
          <router-view></router-view>
          <div class="footer">微构科技，版权所有 &copy;2017-2027</div>    
        </div>
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
      appId: '', // 被选中的应用
      showSubMenu: false,
      selectIndex: '',
      open: false,
      selectItem: false,
      selectName: ''
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
    sideBarMenu () {
      return this.$store.state.keySideBarMenuMap
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
    selectMenu (name) {
      this.$router.push({ name: name })
      this.selectItem = true
      this.selectName = name
    },
    showSub (index) {
      if (this.open) {
        this.open = false
      } else {
        this.open = true
      }
      this.showSubMenu = this.open
      this.selectIndex = index
    },
    chooseMenu (name) {
      // console.log(name)
      // console.log('chooseMenu', this.getAppId)
      // if (name === '1-1') {
      //   this.gotoApp()
      // } else if (name === '1-2') {
      //   this.getAppId ? this.gotoIntents() : this.$Message.warning('请先选择一个应用')
      // } else if (name === '1-3') {
      //   this.getAppId ? this.gotoEntities() : this.$Message.warning('请先选择一个应用')
      // } else if (name === '1-4') {
      //   this.gotoModules()
      // } else if (name === '5-1') {
      //   this.gotoAuth()
      // }
      switch (name) {
        case '1-1': this.gotoApp()
          break
        case '1-2': this.getAppId ? this.gotoIntents() : this.$Message.warning('请先选择一个应用')
          break
        case '1-3': this.getAppId ? this.gotoEntities() : this.$Message.warning('请先选择一个应用')
          break
        case '1-4': this.$router.push({ name: 'Module' })
          break
        case '5-6': this.$router.push({ name: 'Auth' })
          break
        case '5-1': this.$router.push({ name: 'UserAuth' })
          break
        case '5-2': this.$router.push({ name: 'RoleAuth' })
          break
        case '5-3': this.$router.push({ name: 'TeamAuth' })
          break
        case '5-4': this.$router.push({ name: 'ThemeAuth' })
          break
        case '5-5': this.$router.push({ name: 'SecurityAuth' })
          break
      }
    },
    // 场景 词库 菜单
    // selectMenu (name) {
    //   if (name === 2) {
    //     this.$router.push({ name: 'Intents', params: { appId: this.getAppId } })
    //   } else if (name === '3') {
    //     this.$router.push({ name: 'Entities', params: { appId: this.getAppId } })
    //   }
    //   console.log('appId', this.getAppId)
    // },
    getIntentsList (appId) {
      // this.appId = $Storage.sessionStorage.getItem('appId')
      console.log('getIntentsList', appId)
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
      this.$router.push({ name: 'Application' })
    },
    // 创建应用
    gotoCreateApp () {
      this.$router.push({ name: 'CreateApp' })
    },
    // 查看某应用下 所有场景
    gotoIntents () {
      this.$router.push({ name: 'Intents', params: { appId: this.getAppId } })
    },
    // 查看某应用下 所有词库
    gotoEntities () {
      this.$router.push({ name: 'Entities', params: { appId: this.getAppId } })
    },
    // 退出
    logout () {
      this.$axios.post('user/logout').then(response => {
        if (response.status.code === '200') {
          this.$router.push({ name: 'Login' })
          this.$store.dispatch('clearUserName')
        }
      })
    }
  },
  watch: {
    '$route' (to, from) {
      // console.log(to, from)
    }
  },
  created () {
    this.$store.dispatch('setSideBar')
  }
}
</script>

<style lang="less">
  html, body {
    width: 100%;
    height: 100%;
  }
  // 导航条样式
  .layout {
        // background: #f5f7f9;
        // margin-bottom: 30px;
        height: 100%;

        .header {
          height: 75px;
          .ivu-menu {
            position: fixed;
            z-index: 900;
            top: 0;
            left: 0;
            width: 100%;
            height: 75px;
            background: #0396FF;
            line-height: 75px;
          }
          .layout-logo{
            border-radius: 3px;
            float: left;
            position: relative;
            top: 2px;
            left: 20px;
            img {
              width: 180px;
              margin-top: 13px;
            }
          }
          .layout-logout {
            float: right;
            margin-right: 35px;
            &>p {
              color: #fff;
            }
            a {
              text-decoration: none;
              margin-left: 5px;
            }
          }
        }

        .sider {
          position: fixed;
            top: 74px;
            left: 0;
            height: 100%;
            width: 240px;
          &>ul.ivu-menu {
            // position: fixed;
            // top: 74px;
            // left: 0;
            height: 100%;
            // width: 240px;
            // background: #2D90D7;
            background: -webkit-linear-gradient(left top, #003C90 , #2D90D7); 
            color: #fff;

            .ivu-menu-submenu-title:hover {
              background: #03376A;
            }
            &>li.ivu-menu-opened {
              background: #03376A;
            }
              li.ivu-menu-item {
                height: 35px;
                box-sizing: border-box;
                padding-top: 7px;
                padding-left: 60px;
                &:before {
                  content: '';
                  width: 4px;
                  height: 4px;
                  background: #fff;
                  position: absolute;
                  border-radius: 50%;
                  left: 50px;
                  top: 14px;
                }

                &:hover {
                  background: multiply(#0396FF, #ccc) 
                }
              }

              li.ivu-menu-item-selected {
                background: #0396FF;
                color: #fff;
              }
              
          }

          & ul.ivu-menu {
            color: #fff;
          }
        }

        .content {
          position: fixed;
          top: 75px;
          right: 0;
          width: ~'calc(100% - 240px)';
          height: ~'calc(100% - 75px)';    
          background: #F2F2F2;
          overflow: auto;  

            div.content-body {
              background: #fff;
              padding: 15px 20px 40px 20px;
              min-height: ~'calc(100% - 60px)';

              div.content-body-header {
                height: 60px;
              }

                .ivu-table-wrapper {
                  min-height: ~'calc(100% - 90px)'
                  // height: ~'calc(100% - 32px)';
                }
            }

            .footer {
              height: 60px;
              line-height: 60px;
              margin-left: 30px;
              color: #666;
            }
        }
    }
    .ivu-menu-horizontal.ivu-menu-light:after {
        background: #0396FF;
      }
    .layout-logout {
      float: right;
      margin-right: 15px;
      a {
        color: #fff;
        text-decoration: underline
      }
    }

    .ivu-icon-edit, .ivu-icon-trash-a {
      font-size: 16px;
      cursor: pointer;
      color: #4EB1FB;
    }
    .ivu-table-wrapper {
      border: none;
      
      .ivu-table th {
        background: #fff;
      }
      .ivu-table:after {
        width: 0;
      }
      .ivu-table:before {
        background-color: #F0F3F7;
      }
      .ivu-table th, .ivu-table td {
        border-bottom: 1px solid #F0F3F7
      }
    }


  .list-header {
    background: #0A469E;
    color: #fff;
    font-size: 16px;
    padding: 10px 15px;
  }
  aside {
    width: 240px;
    border: 1px solid #ccc;
    padding: 0 0 15px 0;
    border-bottom: none;
    border-top: none;
    position: absolute;
    left: 20px;
    top: 120px;
    bottom: 0px;
    background: #fff;

    input {
      outline: none;
      border: none;
      // border-right: 1px solid #ccc;
      width: 290px;
      padding: 10px 15px;
      // box-sizing: border-box;
    }
    ul {
      overflow: auto;
      // border-top: 1px solid #ccc;
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
  
  // 右侧表单
  .form {
    margin-left: 260px;
    flex-grow: 1;
    .choosed {
      background: #333;
    }
  }
  .add-keywords-tbl {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ccc;

    td {
      padding: 5px 20px;
      border: 1px solid #ccc;
    }

    input {
      width: 100%;
      outline: none;
      border: none;
    }
  }

.action-tbl {
  border: 1px solid #ccc;
  border-collapse: collapse;
  width: 100%;
  thead {
    text-align: center;
  }
  td {
    width: 25%;
    border-bottom: 1px solid #ccc;
    padding: 0px;
    text-align: center;
  }
  input {
    outline: none;
    border: none;
    padding: 10px 15px;
  }
}
  // 空列表
  .empty-list {
  padding: 15px;
  border-top: 1px solid #ccc;
}
    
</style>
