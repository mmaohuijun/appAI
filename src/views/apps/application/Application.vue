<template>
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
        <Button 
          @click="gotoCreateApp"
          type="primary" 
          style="float: right;margin-right: 15px;">
        添加
        </Button>
      </div>
    </div>
      <Modal
        v-model="showModal"
        title="删除应用"
        @on-ok="deleteApp">
        <p>确定删除应用吗？</p>
        <p>删除后无法恢复</p>
      </Modal>
      <Table 
        @on-row-click="gotoIntents"
        :columns="columnApp" 
        :data="appList">
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
  name: 'Application',
  data () {
    return {
      appList: [], // 应用列表
      name: '' || null, // 搜索关键字
      ifApps: 2, // 是否有应用
      columnApp: [
        {
          title: '应用名称',
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
          title: '创建者',
          key: 'createBy'
        },
        {
          title: 'Action',
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
                    that.clickEdit = true
                    // that.gotoEditApp(params.index)
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
                    that.showModal = true
                    // that.clickDel = true
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
      clickEdit: false,
      showModal: false,
      delId: ''
    }
  },
  computed: {
    getAppId () {
      return this.$store.getters.getAppId
    }
  },
  methods: {
    // 跳转到场景
    gotoIntents (params) {
      if (this.clickEdit) {
        this.gotoEditApp(params.id)
        this.clickEdit = false
      } else if (this.showModal) {
        this.delId = params.id
      } else {
        this.$store.dispatch('setAppId', params.id)
        this.$store.dispatch('setAppName', params.name)
        console.log('application appId', params.id)
        this.$router.push({ name: 'Intents', params: { appId: params.id } })
      }
    },
    // 跳转到 编辑页面
    gotoEditApp (appId) {
      this.$store.dispatch('setAppId', appId)
      this.$router.push({ name: 'EditApp', params: { appId: appId } })
    },
    gotoCreateApp () {
      this.$router.push({ name: 'CreateApp' })
    },
    getAppList () {
      let data = {
        name: this.name,
        date: this.date,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      this.$axios.post('app/list', data).then(response => {
        if (response.data) {
          if (response.data.list.length > 0) {
            this.appList = response.data.list
            this.total = response.data.total
          } else {
            this.appList = []
          }
        }
      })
    },
    // 删除应用
    deleteApp () {
      if (this.delId) {
        this.$axios.post('app/del', { id: this.delId }).then(response => {
          if (response.data === null) {
            this.$Message.success('删除成功！')
            this.getAppList()
            // this.$router.push({ name: 'Application' })
          }
        })
      }
      this.delId = ''
    },
    dateChange (date) {
      this.date = date
      this.pageNo = 1
      this.getAppList()
    },
    pageChange (pageNo) {
      this.pageNo = pageNo
      this.getAppList()
    }
  },
  mounted () {
    this.getAppList()
  }
}
</script>

<style lang="less">

</style>

