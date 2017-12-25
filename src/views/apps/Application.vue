<template>
  <div>
    <div class="app-header">      
      <h1>所有应用</h1>
    </div>
    <div v-if="ifApps">
      <Input placeholder="搜索" icon="search"></Input>
      <ul class="list-group">
        <li @click="gotoIntents(index)" v-for="(item, index) in this.appList" :key="index">
          <a>{{item.name}}</a>
          <div class="rt">
            <a @click.stop="gotoEditApp(index)">
              <Icon type="gear-a" class="app-icon"></Icon>
            </a>
          </div>
        </li>
      </ul>
      <Button type="primary" size="large" @click="gotoCreateApp">创建应用</Button>
    </div>
    <div v-else class="no-list">
      <p>还没有词库，先<a href="" @click.prevent="gotoCreateApp">创建第一个</a>应用</p>
      <p>详细了解应用，<a href="">查看文档</a></p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Application',
  data () {
    return {
      appList: [], // 应用列表
      name: '' || null // 搜索关键字
    }
  },
  computed: {
    getAppId () {
      return this.$store.getters.getAppId
    }
  },
  methods: {
    // 跳转到场景
    gotoIntents (index) {
      let appId = this.appList[index].id
      this.$store.dispatch('setAppId', appId)
      this.$store.dispatch('setAppName', this.appList[index].name)
      this.$router.push({ name: 'Intents', params: { appId: appId } })
    },
    // 跳转到 编辑页面
    gotoEditApp (index) {
      let appId = this.appList[index].id
      console.log('appId', appId)
      // this.$store.commit('initAppId', appId)
      this.$store.dispatch('setAppId', appId)
      // this.appId = $Storage.sessionStorage.getItem('appId')
      this.$router.push({ name: 'EditApp', params: { appId: appId } })
    },
    gotoCreateApp () {
      this.$router.push({ name: 'CreateApp' })
    },
    getAppList () {
      this.$axios.post('app/list', { name: this.name }).then(response => {
        if (response.data) {
          this.appList = response.data.list
        }
      })
    }
  },
  created () {
    this.getAppList()
  }
}
</script>

<style lang="less">
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
      cursor: pointer
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
</style>

