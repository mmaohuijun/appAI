<template>
  <div>
    所有应用
    <Select style="width:500px;" @on-change="getTransList">
      <Option v-for="item in appList" :value="item.id" :key="item.id" >{{item.name}}</Option>
    </Select>
    <Button @click="doTrain" style="float: right" size="large">训练</Button>
    <div class="train-tbl">
      <Table :columns="column" :data="trainList"></Table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Module',
  data () {
    return {
      appList: [],
      column: [
        {
          title: '应用名称',
          key: 'name'
        },
        {
          title: '模型',
          key: 'local'
        },
        {
          title: '训练时间',
          key: 'trainDate'
        }
      ],
      trainList: [],
      selectId: '' // 选中的应用id
    }
  },
  methods: {
    getAppList () {
      this.$axios.post('app/list', { name: '' }).then(response => {
        if (response.data) {
          this.appList = response.data.list
        }
      })
    },
    // 获取训练表格值
    getTransList (id) {
      this.selectId = id
      this.$axios.post('train/list', { id: id }).then(response => {
        if (response.data) {
          this.trainList = response.data.trainList
        }
      })
    },
    // 训练
    doTrain () {
      this.$axios.post('train/do', { id: this.selectId }).then(response => {
        if (response.data) {
          this.$Message.success('训练成功！')
        } else {
          this.$Message.success('训练失败！')
        }
      })
    }
  },
  created () {
    this.getAppList()
  }
}
</script>

<style>
  .train-tbl {
    margin-top: 15px;
  }
</style>

