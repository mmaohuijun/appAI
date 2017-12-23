<template>
  <div>
    <div class="app-header">      
      <h1>场景</h1>
    </div> 
    <div v-if="!ifIntents" class="no-list">
      <p>还没有场景，先<a href="" @click.prevent="gotoCreateIntents">创建第一个</a>场景</p>
      <p>详细了解场景，<a href="">查看文档</a></p>
    </div>
    <div v-else>
      <Input placeholder="搜索" icon="search"></Input>
      <ul class="list-group">
      <li @click="gotoEditIntents(index)" v-for="(item, index) in this.intentList" :key="index">
        <a>{{item.name}}</a>
        <div class="rt">
          <a @click.stop="delIntents()">
            <Icon type="trash-a" class="app-icon"></Icon>
          </a>
        </div>
      </li>
    </ul>
      <Button type="primary" size="large" @click="gotoCreateIntents">创建场景</Button>
      <Modal
        v-model="showModal"
        title="删除场景"
        @on-ok="delIntents">
          <p>确定删除场景吗</p>
          <p>删除后无法恢复</p>
        </Modal>
    </div> 
  </div>
  
</template>

<script>
// import $Storage from '../../api/storage.js'
export default {
  name: 'Intents',
  data () {
    return {
      name: '', // 场景列表 搜索关键词
      appId: '', // 应用id
      ifIntents: true, // 是否存在场景
      intentList: [],
      showModal: false // 显示删除 模态框
    }
  },
  computed: {
    getAppId () {
      return this.$store.getters.getAppId
    }
  },
  methods: {
    gotoCreateIntents () {
      this.$router.push({ name: 'CreateIntents' })
    },
    gotoEditIntents (index) {
      this.$router.push({ name: ':appId/editIntents' })
    },
    // 获取场景列表
    getIntentsList () {
      this.appId = this.$store.state.appId
      if (!this.appId) {
        this.appId = this.getAppId
      }
      // this.appId = $Storage.sessionStorage.getItem('appId')
      this.$axios.post('intent/list', { appId: this.appId, name: this.name }).then(response => {
        // console.log(response.data.list.length)
        if (response.data.list.length > 0) {
          this.ifIntents = true
          this.intentList = response.data.list
        } else {
          this.ifIntents = false
        }
      })
    },
    // 编辑某个场景
    // 删除某个场景
    delIntents () {
      this.showModal = true
      console.log('delIntents')
    }
  },
  created () {
    console.log(this.appId)
    // console.log('appId', this.getAppId)
    this.getIntentsList()
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

