<template>
  <div>
    <div class="app-header">      
      <h1>场景</h1>
    </div> 
    <div v-if="ifIntents">
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
    <div v-else class="no-list">
      <p>还没有场景，先<a href="" @click.prevent="gotoCreateIntents">创建第一个</a>场景</p>
      <p>详细了解场景，<a href="">查看文档</a></p>
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
      ifIntents: false, // 是否存在场景
      intentList: [],
      showModal: false, // 显示删除 模态框
      delId: '' // 删除场景id
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
      // console.log(this.intentList[index].id)
      this.$store.dispatch('setIntentId', this.intentList[index].id)
      this.$router.push({ name: 'EditIntents', params: this.getAppId })
    },
    // 获取场景列表
    getIntentsList () {
      this.appId = this.$store.state.appId
      if (!this.appId) {
        this.appId = this.getAppId
      }
      // this.appId = $Storage.sessionStorage.getItem('appId')
      this.$axios.post('intent/list', { appId: this.appId, name: this.name }).then(response => {
        // // console.log(response.data.list.length)
        if (response.data.list.length > 0) {
          this.intentList = response.data.list
          this.ifIntents = true
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
      this.$axios.post('intent/del', { appId: this.appId, id: this.delId }).then(reponse => {
        if (response.data === null) {
          this.$Message.success('提交成功！')
        }
      })
      this.$router.go(0)
    }
  },
  created () {
    this.getIntentsList()
  }
}
</script>

<style lang="less">

</style>

