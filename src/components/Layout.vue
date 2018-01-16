<template>
  <div class="layout">
    <div class="header">
      <Menu mode="horizontal" active-name="1" @on-select="selectMenu">
        <div class="layout-logo">
          <img src="../assets/logo.png" alt="">
        </div>
        <div class="layout-logout">
          <p>
            Hi,{{this.$store.getters.getUserName}}
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
            <Menu active-name="1-1" :open-names="['1']" @on-select="chooseMenu">
                <Submenu name="1">
                    <template slot="title">
                        <Icon type="ios-navigate"></Icon>
                        模型管理
                    </template>
                    <MenuItem name="1-1">应用</MenuItem>
                    <MenuItem name="1-2">场景</MenuItem>
                    <MenuItem name="1-3">词库</MenuItem>
                    <MenuItem name="1-4">模型</MenuItem>
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        <Icon type="ios-keypad"></Icon>
                        碎片化平台
                    </template>
                    <MenuItem name="2-1">Option 1</MenuItem>
                    <MenuItem name="2-2">Option 2</MenuItem>
                </Submenu>
                <Submenu name="3">
                    <template slot="title">
                        <Icon type="ios-analytics"></Icon>
                        微服务管理
                    </template>
                    <MenuItem name="3-1">Option 1</MenuItem>
                    <MenuItem name="3-2">Option 2</MenuItem>
                </Submenu>
                <Submenu name="4">
                  <template slot="title">
                    <Icon type="ios-analytics"></Icon>
                    流程管理
                  </template>
                </Submenu>
                <Submenu name="5">
                  <template slot="title">
                    <Icon type="ios-analytics"></Icon>
                    权限管理
                  </template>
                  <MenuItem name="5-1">权限测试</MenuItem>
                </Submenu>
                <Submenu name="6">
                  <template slot="title">
                    <Icon type="ios-analytics"></Icon>
                    数据安全管理
                  </template>
                </Submenu>
            </Menu>
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
    chooseMenu (name) {
      console.log(name)
      if (name === '1-1') {
        this.gotoApp()
      } else if (name === '1-2') {
        this.gotoIntents()
      } else if (name === '1-3') {
        this.gotoEntities()
      } else if (name === '1-4') {
        this.gotoModules()
      } else if (name === '5-1') {
        this.gotoAuth()
      }
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
      this.$router.push('/apps/index')
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
    // 跳转模态页面
    gotoModules () {
      this.$router.push({ name: 'Module' })
    },
    // 跳转权限页面
    gotoAuth () {
      this.$router.push({ name: 'Auth' })
    },
    // 退出
    logout () {
      this.$axios.post('logout').then(response => {
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
                  background: #0396FF
                }
              }

              li.ivu-menu-item-selected {
                background: #0396FF;
                color: #fff;
              }
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
    .drop-down-list { 
      float: right;
      padding-left: 150px;
      margin-top:-15px;
    }
    // .layout>ul {
    //   position: fixed;
    //   top: 0;
    //   left: 0;
    //   width: 100%;
    // }
    // .layout>div {
    //   background: #fff;
    //   padding: 30px 30px 0 30px;
    //   border: none;
    //   margin-top: 50px;
    // }
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
      .ivu-table th, .ivu-table td {
        border-bottom: 1px solid #F0F3F7
      }
    }


  .list-header {
    background: #0A469E;
    color: #fff;
    font-size: 16px;
    padding: 15px;
  }
  aside {
    width: 300px;
    border: 1px solid #ccc;
    padding: 0 0 15px 0;
    margin-right: 15px;
    border-bottom: none;
    border-top: none;
    position: absolute;
    left: 20px;
    top: 129px;
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
  
  // 右侧表单
  .form {
    margin-left: 330px;
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

//     /* 没有应用、场景、词库列表 apps/intents/entities */ 
//     .no-list {
//       text-align: center;
//       font-size: 16px;
//       margin-top: 100px;
//     }
//     .app-header {
//     float: left;
//     margin-top: 20px;
//     margin-bottom: 20px;
//     clear: both;
//     h1 {
//       clear: both
//     }  
//   }
//   // 有列表情况 apps/intents/entities
//   .lf {
//     float: left
//   }
//   .rt {
//     float: right
//   }
//   .list-group {
//     margin-top: 20px;
//     margin-bottom: 20px;
//     border-bottom: 1px solid #ccc;
//     li {
//       border: 1px solid #ccc;
//       border-bottom: none;
//       font-size: 14px;
//       padding:8px 10px;

//       a {
//         color: #333;
//       }

//       &:hover {
//       // cursor: pointer
//       }

//       &:hover .app-icon {
//         display: block;
//       }
//     }  
//   }
//   .app-icon {
//     position: relative;
//     top: 2px;
//     display: none;
//     font-size: 16px;
//     color: #333;
//   }
//   // 添加/编辑页面 create/edit
//   .create-box {
//       .my-input {
//       outline: none;
//       border: 1px solid #ccc;
//       width: 100%;
//       padding: 5px;
//       margin-bottom: 1px;
//     }
    // 左侧侧边栏 列表
    // aside {
    //   width: 300px;
    //   border: 1px solid #ccc;
    //   padding: 15px 0;
    //   margin-right: 15px;
    //   border-bottom: none;
    //   position: fixed;
    //   left: 0;
    //   top: 60px;
    //   height: 100%;
    //   // background: #ccc;
    //   input {
    //   width: 290px;
    //   outline: none;
    //   border: none;
    //   padding: 10px 15px;
    //   }
    //   h2 {
    //     border-bottom: 1px solid #ccc;
    //     padding-bottom: 15px;
    //     width: 300px;
    //     padding-left: 15px;
    //   }
    //   ul {
    //     border-top: 1px solid #ccc;
    //     li {
    //       // border-bottom: 1px solid #ccc;       
    //       a {
    //         width: 100%;
    //         display: inline-block;
    //         padding: 8px 15px;
    //         color: #333;

    //         &:hover {
    //           color: #fff;
    //         }
    //       }

    //       &:hover a {
    //         cursor: pointer;
    //       background: #9399A6;
    //       }
    //     }
    //   }
    // }
    // .form {
    //   margin-left: 300px;
    // }
  //}
//   // 空列表
//   .empty-list {
//   padding: 15px;
//   border-top: 1px solid #ccc;
// }
    
</style>
