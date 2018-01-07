<template>
  <div>
    <div class="app-header">      
      <h1>场景</h1>
    </div> 
    <div v-if="ifIntents===0">
      <Input placeholder="搜索" icon="search"></Input>
      <ul class="list-group">
      <li @click="gotoEditIntents(index)" v-for="(item, index) in intentList" :key="index">
        <a>{{item.name}}</a>
        <div class="rt">
          <a @click.stop="del(index)">
            <Icon type="trash-a" class="app-icon"></Icon>
          </a>
        </div>
      </li>
    </ul>
      <Button type="primary" size="large" @click="gotoCreateIntents">创建场景</Button>
      <Modal
        v-model="showModal"
        @on-ok="delIntents"
        title="删除场景">
          <p>确定删除场景吗</p>
          <p>删除后无法恢复</p>
        </Modal>
    </div> 
    <div v-else-if="ifIntents===1" class="no-list">
      <p>还没有场景，先<a href="" @click.prevent="gotoCreateIntents">创建第一个</a>场景</p>
      <p>详细了解场景，<a href="">查看文档</a></p>
    </div>
    <div v-else></div>
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
      ifIntents: 2, // 是否存在场景
      intentList: [],
      showModal: false, // 显示删除 模态框
      delId: '' // 删除场景id
    }
  },
  computed: {
    getAppId () {
      this.appId = this.$store.state.appId
      if (!this.appId) {
        this.appId = this.$store.getters.getAppId
      }
      return this.appId
    },
    ifHasIntents () {
      return this.$store.state.hasIntents || false
    }
  },
  methods: {
    gotoCreateIntents () {
      this.$router.push({ name: 'CreateIntents' })
    },
    gotoEditIntents (index) {
      // console.log(this.intentList[index].id)
      this.$store.dispatch('setIntentId', this.intentList[index].id)
      console.log('appId', this.getAppId)
      this.$router.push({ name: 'EditIntents', params: { appId: this.getAppId } })
    },
    // 获取场景列表
    getIntentsList () {
      this.$axios.post('intent/list', { appId: this.getAppId, name: this.name }).then(response => {
        // // console.log(response.data.list.length

        if (response.data.list.length > 0) {
          this.intentList = response.data.list
          this.ifIntents = 0
        } else {
          this.ifIntents = 1
          // this.$router.push({ name: 'NoIntents', params: { appId: this.appId } })
        }
      })
    },
    // 编辑某个场景
    // 删除某个场景
    del (index) {
      this.showModal = true
      this.delId = this.intentList[index].id
    },
    delIntents () {
      this.$axios.post('intent/del', { appId: this.appId, id: this.delId }).then(response => {
        if (response.data === null) {
          this.$Message.success('提交成功！')
          this.getIntentsList()
        }
      })
    }
  },
  mounted () {
    this.getIntentsList()
  },
  // 两个路由渲染同个组件 实例会被复用
  // 组件的生命周期钩子不会再被调用
  // 监控$route对象 对路由参数的变化做出响应
  watch: {
    '$route' (to, from) {
      console.log(to, from)
      this.getIntentsList()
    },
    'ifIntents' (newV, oldV) {
      console.log('newV', newV, 'oldVal', oldV)
    }
  }
}
</script>

<style lang="less">

</style>

