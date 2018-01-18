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
    <Modal 
      v-model="showEdit" 
      title="编辑用户权限">
      <Form :model="authForm" ref="authForm" :rule="authForm">
        <Form-item label="姓名" prop="username">
          <Input v-model="authForm.username"></Input>
        </Form-item>
        <Form-item label="email" prop="email">
          <Input v-model="authForm.email"></Input>
        </Form-item>
        <Form-item label="联系电话" prop="phone">
          <Input v-model="authForm.phone"></Input>
        </Form-item>
        <Form-item label="归属公司" prop="company">
          <Input v-model="authForm.company"></Input>
        </Form-item>
        <Form-item label="归属部门" prop="officeid">
          <Select v-model="authForm.officeid">
            <Option 
              v-for="item in deptList" 
              :value="item.id" 
              :key="item.id">
              {{ item.name }}
            </Option>
          </Select>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveUserAuth">提交</Button>
        <Button>取消</Button>
      </div>
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
                    that.saveId = params.row.id
                    that.getAuthDetail()
                    that.showEdit = true
                    // that.$store.dispatch('setUserAuthId', params.row.id)
                    // that.$router.push({ name: 'EditUserAuth' })
                    
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
      deptList: [], // 公司机构列表
      showModal: false, // 显示模态框
      showEdit: false, // 编辑模态框
      delId: '', // 删除 id
      saveId: '', // 编辑 id
      authForm: {
        username: '',
        email: '',
        phone: '',
        company: '微构科技',
        officeid: 0,
      }
    }
  },
  methods: {
    addUser () {
      this.showEdit = true
      this.saveId = ''
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
    // 获取部门列表
    getDeptList () {
      this.$axios.post('user/to_save').then(response => {
        if (response.data) {
          this.deptList = response.data.officeAllList
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
    // 获取某用户权限详情
    getAuthDetail () {
      this.$axios.post('user/detail', { id: this.saveId }).then(response => {
        let data = response.data
        this.authForm.username = data.username || ''
        this.authForm.email = data.email || ''
        this.authForm.phone = data.phone || ''
        this.authForm.officeid = data.officeid || ''
      })
    },
    // 保存修改
    saveUserAuth () {
      let data = {
        id: this.saveId,
        username: this.authForm.username,
        email: this.authForm.email,
        phone: this.authForm.phone,
        officeid: this.authForm.officeid
      }
      this.$axios.post('user/regist', data).then(response => {
        if (response.data === null) {
          this.showEdit = false
          this.$Message.success('提交成功！')
          this.getAuthList()
        }
      })
    },   
    // 重置表单
    handleReset(name) {
      console.log('resetFields')
      this.$refs[name].resetFields()
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
    this.getDeptList()
  },
  watch: {
    'showEdit' (newV, oldV) {
      this.handleReset('authForm')
    }
  },
  components: { SearchHeader }
}
</script>

