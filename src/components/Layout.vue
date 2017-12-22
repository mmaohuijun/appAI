<template>
  <div class="layout">
    <Menu mode="horizontal" theme="dark" active-name="1" @on-select="selectMenu">
            <div class="layout-logo"></div>
            <div class="layout-nav">
              <!-- <MenuItem name="1"> -->
                <!-- <Dropdown @on-click="selectApp">
                  <a>
                    {{this.getAppName}}
                    <Icon type="arrow-down-b"></Icon>
                    <Icon type="plus"></Icon> 
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="createApp">
                      创建应用
                      <Icon type="plus-circled" class="drop-down-list"></Icon>
                    </DropdownItem>
                    <DropdownItem name="showApp">
                      查看所有应用
                      <Icon type="navicon" class="drop-down-list"></Icon>
                    </DropdownItem> -->
                    <!-- <DropdownItem name="showAppDetail" divided>
                      应用1
                      <Icon type="gear-a" class="drop-down-list"></Icon>
                    </DropdownItem> -->
                    <!-- <DropdownItem :name="index" v-for="(item, index) in appList" :key="item.id">
                      {{item.name}}
                      <Icon type="gear-a" class="drop-down-list"></Icon>
                    </DropdownItem>
                  </DropdownMenu> -->
                <!-- </Dropdown> -->
              <!-- </MenuItem> -->
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
              <MenuItem name="2" @click.native="gotoIntents">
                场景
              </MenuItem>  
              <MenuItem name="3" @click.native="gotoEntities">
                词库
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
      return this.$store.getters.getAppId
    },
    getAppName () {
      let appName
      appName = this.$store.state.appName
      if (!appName) {
        appName = this.$store.getters.getAppName
      }
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
          this.$store.dispatch('setAppId', this.appList[0].id)
        }
      })
    },
    // 下拉菜单选择
    selectApp (name) {
      if (name === 'createApp') {
        this.$router.push({name: 'CreateApp'})
      } else if (name === 'showApp') {
        this.$router.push('/apps')
      } else {
        console.log('name')
        this.index = name
        // this.appId = this.getAppList
        this.$store.dispatch('setAppId', this.getAppId)
        this.$store.dispatch('setAppName', this.getAppName)
        this.$router.push({ name: 'Intents', params: { appId: this.getAppId } })
        // 需要优化
        // this.getIntentsList(this.getAppId)
      }
    },
    // 场景 词库 菜单
    selectMenu (name) {
      if (name === 2) {
        this.$router.push({ name: 'Intents', params: { appId: this.getAppId } })
      } else if (name === '3') {
        this.$router.push('/entities')
      }
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
    hello () {
      console.log('hello')
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
      console.log('index', index)
      this.$store.dispatch('setAppId', this.appList[index].id)
      this.$router.push({ name: 'Intents', params: { appId: this.appList[index].id } })
      // 强制页面刷新 修改
      // this.$router.go(0)
    },
    // 查看某应用下 所有词库
    gotoEntities () {
      this.$router.push({ name: 'Entities', params: { appId: this.getAppId }})
    }
  },
  created () {
    console.log(this.getAppId)
    this.getAppList()
  },
  watch: {
    '$router.to' (n, o) {
      console.log(n, o)
    }
  }
}
</script>

<style lang="">
  .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        margin-bottom: 30px;
    }
    .layout-logo {
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
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
    .layout>div {
      background: #fff;
      padding: 30px 30px 0 30px;
      border: none;
    }
</style>
