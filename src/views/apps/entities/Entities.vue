<template>
  <div class="content-body">
    <div class="content-body-header">
      <div class="">
        <span style="padding-right: 15px;">时间</span>
        <DatePicker 
          type="date" 
          @on-change="dateChange"
          placeholder="Select date" 
          style="width: 200px; margin-right: 50px">
        </DatePicker>
        <Input 
          @on-click="getEntitiesList"
          v-model="name"
          icon="search" 
          placeholder="应用名称" 
          style="width: 200px">
        </Input>
        <Button 
          @click="gotoCreateEntities"
          type="primary" 
          style="float: right;margin-right: 15px;">
        添加
        </Button>
      </div>
    </div>
    <div class="breadList">
      <span>{{ this.getAppName }}</span>
      <span>></span>
      <span>词库列表</span>
    </div>
      <Table 
        :columns="columnEntities" 
        :data="entitiesList">
      </Table>
      <Page 
        :total="total" 
        :current="pageNo" 
        :page-size="pageSize" 
        show-elevator 
        @on-change="pageChange"
        style="padding-top: 30px; text-align: center;">
      </Page>
      <Modal
        v-model="showModal"
        @on-ok="delEntities"
        title="删除场景">
          <p>确定删除场景吗</p>
          <p>删除后无法恢复</p>
        </Modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Entities',
  data () {
    return {
      appId: '',
      showModal: false, // 删除模态框
      name: '', // 搜索词库 关键字
      ifEntities: 2, // 是否存在词库
      entitiesList: [], // 词库列表
      delId: '', // 要删除的词库id
      columnEntities: [
        {
          title: '词库名称',
          key: 'name'
        },
        {
          title: '修改时间',
          key: 'updateDate'
        },
        {
          title: '创建时间',
          key: 'createDate'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const that = this
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  icon: 'edit',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  color: '#999',
                  fontSize: '22px'
                },
                on: {
                  click () {
                    console.log(params)
                    that.gotoEditEntities(params.row)
                  }
                }
              }),
              h('Button', {
                props: {
                  type: 'text',
                  icon: 'trash-a',
                  size: 'small'
                },
                style: {
                  color: '#999',
                  fontSize: '22px'
                },
                on: {
                  click () {
                    console.log('delete')
                    that.showM(params.row)
                  }
                }
              })
            ])
          }
        }
      ],
      date: '', // 日期
      pageSize: 10, // 每页显示行数
      pageNo: 1, // 显示页数
      total: 0, // 总信息条数
      appName: ''
    }
  },
  computed: {
    ...mapGetters([
      'getAppId',
      'getAppName'
    ])
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
      // this.appId = this.$store.state.appId
      // if (!this.appId) {
      //   this.appId = this.$store.getters.getAppId
      // }
      let data = {
        appId: this.getAppId,
        name: this.name,
        date: this.date,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      this.$axios.post('dict/list', data).then(response => {
        if (response.data.dictList.length > 0) {
          this.entitiesList = response.data.dictList
          // this.ifEntities = 0
        } else {
          this.entitiesList = []
          // this.ifEntities = 1
        }
      })
    },
    showM (params) {
      this.showModal = true
      this.delId = params.id
    },
    // 编辑词库
    gotoEditEntities (params) {
      let SelectEntity = params.id
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
    this.$store.dispatch('getAppIdFromStorage')
    this.$store.dispatch('getAppName')
    this.getEntitiesList()
  }
}
</script>

<style lang="less">

</style>

