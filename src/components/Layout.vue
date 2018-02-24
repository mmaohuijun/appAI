<template>
  <div class="layout">
    <div class="header">
      <Menu class="header-ul" mode="horizontal" active-name="1" @on-select="selectMenu">
        <div class="layout-logo">
          <img src="../assets/logo.png" alt="">
        </div>
        <div class="layout-logout">
          <p>
            Hi,{{this.username}}
            <Dropdown>
                <a href="javascript:void(0)">
                    设置
                    <Icon type="arrow-down-b" style="margin-left: 5px;"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem @click.native="gotoMod">修改密码</DropdownItem>
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
import { mapGetters } from 'vuex'
export default {
  name: 'Layout',
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
    ...mapGetters([
      'sideBarMenu',
      'username'
    ]),
    getAppId () {
      let appId
      appId = this.$store.state.appId
      if (!appId) {
        appId = this.$store.getters.getAppId
      }
      return appId
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
    // 修改密码
    gotoMod () {
      this.$router.push({ name: 'ModifyPwd' })
    },
    // 退出
    logout () {
      this.$axios.post('user/logout').then(response => {
        if (response.status.code === '200') {
          this.$store.dispatch('logoutClear')
          this.$router.push({ name: 'Login' })
        }
      })
    }
  },
  mounted () {
    this.$store.dispatch('setSideBarMenu')
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
        height: 100%;

        .header {
          height: 75px;
          & >ul.header-ul {
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
          .ivu-menu-horizontal.ivu-menu-light:after {
            background: #0396FF;
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
      border: none !important;
      
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
        border-bottom: 1px solid #F0F3F7;
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
