<template>
  <div class="content-body">
    <search-header 
      placeholder="姓名"
      :ifSearchCompany="true"
      :ifDatePicker="true"
      :ifAddBtn="true"
      @onDateChange="dateChange"
      @onSearchCompany="searchCompany"
      @onSearchName="searchName"
      @onAdd="addUser">
    </search-header>
    <Table 
      :columns="columnAuth" 
      :data="userList">
    </Table>
    <Modal
      v-model="showModal"
      title="删除应用"
      @on-ok="deleteUser">
      <p>确定删除该用户权限吗？</p>
      <p>删除后无法恢复</p>
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
import SearchHeader from '../../../components/SearchHeader'
export default {
  name: 'UserAuth',
  data () {
    return {
      name: '', // 姓名 搜索
      dept: '', // 公司名称 搜索
      date: '', // 日期 搜索
      pageSize: 10,
      pageNo: 1,
      total: 0,
      columnAuth: [
        {
          title: '用户名',
          key: 'username'
        },
        {
          title: '部门',
          key: 'dept'
        },
        {
          title: '创建日期',
          key: 'createDate'
        },
        {
          title: '修改日期',
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
                    that.$store.dispatch('setUserAuthId', params.row.id)
                    that.$router.push({ name: 'EditUserAuth' })
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
                    that.delId = params.row.id
                  }
                }
              })
            ])
          }
        }
      ],
      userList: [], // 用户权限列表
      showModal: false, // 显示模态框
      delId: 0 // 删除 id
    }
  },
  methods: {
    addUser () {
      this.$router.push({ name: 'CreateUserAuth' })
    },
    getAuthList () {
      let data = {
        dept: this.dept,
        name: this.name,
        date: this.date,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      this.$axios.post('user/list', data).then(response => {
        if (response.data) {
          this.userList = response.data.userList
          this.total = response.data.total
        }
      })
    },
    deleteUser () {
      this.$axios.post('user/del', { id: this.delId }).then(response => {
        console.log(response)
        if (response.data === null) {
          this.$Message.success('删除成功！')
          this.getAuthList()
        }
      })
    },
    searchName (name) {
      this.name = name
      this.getAuthList()
    },
    searchCompany (dept) {
      this.dept = dept
      this.getAuthList()
    },
    dateChange (date) {
      this.date = date
      this.getAuthList()
    },
    pageChange (pageNo) {
      this.pageNo = pageNo
      this.getAuthList()
    }
  },
  mounted () {
    this.getAuthList()
  },
  components: { SearchHeader }
}
</script>

