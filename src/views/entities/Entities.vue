<template>
  <div>
    <div class="app-header">      
      <h1>词库</h1>
    </div>
    <div v-if="ifEntities">
      <Input placeholder="搜索" icon="search"></Input>
      <ul class="list-group">
        <li @click="gotoEditEntities(index)" v-for="(item, index) in entitiesList" :key="index">
          <a>{{item.name}}</a>
          <div class="rt">
            <a @click.stop="showM(index)">
              <Icon type="trash-a" class="app-icon"></Icon>
            </a>
          </div>
        </li>
      </ul>
      <Button type="primary" size="large" @click="gotoCreateEntities">创建词库</Button>
      <Modal
        v-model="showModal"
        title="删除场景"
        @on-ok="delEntities(index)">
        <p>确定删除场景吗</p>
        <p>删除后无法恢复</p>
      </Modal>
    </div>
    <div class="no-list" v-else>
      <p>还没有词库，先<a href="" @click.prevent="gotoCreateEntities">创建第一个</a>词库</p>
      <p>详细了解词库，<a href="">查看文档</a></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Entities',
  data () {
    return {
      appId: '',
      showModal: false, // 删除模态框
      name: '', // 搜索词库 关键字
      ifEntities: this.ifHasEntities, // 是否存在词库
      entitiesList: [], // 词库列表
      delId: '' // 要删除的词库id
    }
  },
  computed: {
    getAppId () {
      // return this.$store.getters.appId
      this.appId = this.$store.state.appId
      if (!this.appId) {
        this.appId = this.$store.getters.getAppId
      }
      return this.appId
    },
    ifHasEntities () {
      return this.entitiesList.length > 0
    }
  },
  methods: {
    gotoCreateEntities () {
      this.$router.push({ name: 'CreateEntities' })
    },
    // 获取词库列表
    getEntitiesList () {
      // console.log(this.$store.getters.getAppId)
      console.log(this.getAppId)
      console.log(this.$store.state.appId)
      this.appId = this.$store.state.appId
      if (!this.appId) {
        this.appId = this.$store.getters.getAppId
      }
      this.$axios.post('dict/list', { name: this.name, appId: this.appId }).then(response => {
        if (response.data.dictList.length > 0) {
          this.entitiesList = response.data.dictList
          this.ifEntities = true
        } else {
          this.ifEntities = false
        }
      })
    },
    showM (index) {
      this.showModal = true
      this.delId = this.entitiesList[index].id
    },
    // 编辑词库
    gotoEditEntities (index) {
      let SelectEntity = this.entitiesList[index].id
      this.$store.dispatch('setEntityId', SelectEntity)
      this.$router.push({ name: 'EditEntities', params: { appId: this.getAppId } })
    },
    // 删除词库
    delEntities () {
      this.$axios.post('dict/del', { id: this.delId }).then(response => {
        if (response.data === null) {
          this.$Message.success('提交成功！')
          this.getEntitiesList()
        }
      })
    }
  },
  created () {
    this.getEntitiesList()
  }
}
</script>

<style lang="less">

</style>

