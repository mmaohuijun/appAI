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
          @on-click="getFlowList"
          v-model="name"
          icon="search" 
          placeholder="流程名称" 
          style="width: 200px">
        </Input>
        <Button 
          @click="gotoAdd"
          type="primary" 
          style="float: right;margin-right: 15px;">
        添加
        </Button>
      </div>
    </div>
      <Table 
        :columns="columnFlow"
        :data="processList">
      </Table>
      <Modal
        v-model="showModal"
        @on-ok="deleteFlow(delId)">
        <p>是否确认删除该流程？</p>
        <p>删除后将不可恢复</p>
      </Modal>
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
import { mapGetters } from 'vuex'
export default {
  name: 'Flow',
  data () {
    return {
      name: '', // 搜索词库 关键字
      processList: [],
      columnFlow: [
        {
          title: '流程名称',
          key: 'name'
        },
        {
          title: '描述',
          key: 'describe'
        },
        {
          title: '问题',
          key: 'ask'
        },
        {
          title: '肯定动作',
          key: 'yAction'
        },
        {
          title: '否定动作',
          key: 'nAction'
        },
        {
          title: '修改时间',
          key: 'updateDate'
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
                    that.$store.commit('SET_FLOW_ID', params.row.id)
                    that.$router.push({ name: 'EditFlow' })
                    that.gotoEdit(params.row)
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
                    that.showModal = true
                    that.delId = params.row.id
                  }
                }
              })
            ])
          }
        }
      ],
      showModal: false,
      date: '', // 日期
      pageSize: 10, // 每页显示行数
      pageNo: 1, // 显示页数
      total: 0 // 总信息条数
    }
  },
  computed: {
    ...mapGetters([
      'getAppId',
      'getAppName'
    ])
  },
  methods: {
    getFlowList () {
      let data = {
        date: this.date,
        name: this.name,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      this.$axios.post('process/list', data).then(response => {
        if (response.data) {
          this.processList = response.data.processList
        }
      })
    },
    // 删除该流程
    deleteFlow (id) {
      this.$axios.post('process/delete', { id: id }).then(response => {
        if (response.data === null) {
          this.$Message.success('删除成功！')
          this.getFlowList()
        }
      })
    },
    // 添加流程
    gotoAdd () {
      this.$store.commit('SET_FLOW_ID', '')
      this.$router.push('EditFlow')
    },
    dateChange (date) {
      this.date = date
      this.pageNo = 1
      this.getFlowList()
    },
    pageChange (pageNo) {
      this.pageNo = pageNo
      this.getFlowList()
    }
  },
  created () {
    this.getFlowList()
  }
}
</script>

<style lang="less">

</style>

