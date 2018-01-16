<template>
  <!-- <div>
    所有应用
    <Select style="width:500px;" @on-change="getTransList">
      <Option v-for="item in appList" :value="item.id" :key="item.id" >{{item.name}}</Option>
    </Select>
    <Button @click="doTrain" style="float: right" size="large">训练</Button>
    <div class="train-tbl">
      <Table :columns="column" :data="trainList"></Table>
    </div>
  </div> -->
  <div class="content-body">
    <div class="content-body-header">
      <div class="">
        <span style="padding-right: 15px;">时间</span>
        <DatePicker 
          type="date" 
          @on-change="dateChange"
          placeholder="Select date" 
          style="width: 200px; margin-right: 50px;">
        </DatePicker>
        <Input 
          @on-click="getAppList"
          v-model="name"
          icon="search" 
          placeholder="应用名称" 
          style="width: 200px">
        </Input>
      </div>
    </div>
    <div class="select-box">
      <Select style="width:500px;" @on-change="getTransList">
        <Option v-for="item in appList" :value="item.id" :key="item.id" >{{item.name}}</Option>
      </Select>
      <Button @click="doTrain" style="float: right" size="large">训练</Button>      
    </div>

      <Table 
        :columns="column" 
        :data="trainList">
      </Table>
      <Page 
        :total="total" 
        :current="pageNo" 
        :page-size="pageSize" 
        show-elevator 
        @on-change="pageChange"
        style="padding-top: 30px; text-align: center;">
      </Page>
 
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
      selectId: '', // 选中的应用id
      date: '',
      pageSize: 10,
      pageNo: 1,
      total: 0,
      name: '' // 关键词搜索
    }
  },
  methods: {
    getAppList () {
      let data = {
        name: this.name,
        date: this.date,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      this.$axios.post('app/list', data).then(response => {
        if (response.data) {
          this.appList = response.data.list
        }
      })
    },
    // 获取训练表格值
    getTransList (id) {
      this.selectId = id
      let data = {
        id: id || '',
        name: this.name,
        date: this.date,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      this.$axios.post('train/list', data).then(response => {
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
    },
    dateChange (date) {
      this.date = date
      this.pageNo = 1
      this.getEntitiesList()
    },
    pageChange (pageNo) {
      this.pageNo = pageNo
      this.getEntitiesList()
    }
  },
  created () {
    this.getAppList()
    this.getTransList()
  }
}
</script>

<style>
  .train-tbl {
    margin-top: 15px;
  }
  .ivu-table-body {
    overflow: hidden;
  }
  .select-box {
    margin-bottom: 15px;
  }
</style>

