<template>
  <div class="content-body">
    <search-header 
      placeholder="姓名"
      :ifSearchCompany="false"
      :ifDatePicker="true"
      :ifAddBtn="true"
      @onDateChange="dateChange"
      @onSearchName="searchName"
      @onAdd="addUser">
    </search-header>
    <Table 
      :columns="columnAuth" 
      :data="themeList">
    </Table>
    <Modal
      v-model="showModal"
      title="删除应用"
      @on-ok="deleteUser">
      <p>确定删除该用户权限吗？</p>
      <p>删除后无法恢复</p>
    </Modal>
    <Modal 
      @on-ok="saveRoleAuth"
      v-model="showEdit" 
      title="编辑用户权限">
      <Form :model="authForm" ref="authForm" :rule="authForm">
        <Form-item label="主题名称" prop="name">
          <Input v-model="authForm.name"></Input>
        </Form-item>
        <Form-item label="描述" prop="describe">
          <Input v-model="authForm.describe"></Input>
        </Form-item>
      </Form>
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
  name: 'ThemeAuth',
  data () {
    return {
      name: '', // 角色名称 搜索
      date: '', // 日期 搜索
      pageSize: 10,
      pageNo: 1,
      total: 0,
      columnAuth: [
        {
          title: '主题名称',
          key: 'name'
        },
        {
          title: '描述',
          key: 'describe'
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
      themeList: [], // 主题权限列表
      deptList: [], // 公司机构列表
      scopeList: [
        {
          value: '1',
          label: '所有数据'
        },
        {
          value: '2',
          label: '所在公司数据'
        },
        {
          value: '3',
          label: '所在部门数据'
        },
        {
          value: '5',
          label: '仅本人数据'
        },
        {
          value: '9',
          label: '按明细设置'
        }
      ], // 数据范围列表
      showModal: false, // 显示模态框
      showEdit: false, // 编辑模态框
      delId: '', // 删除 id
      saveId: '', // 编辑 id
      authForm: {
        name: '',
        enName: '',
        dataScope: ''
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
        name: this.name,
        date: this.date,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      this.$axios.post('theme/list', data).then(response => {
        if (response.data) {
          this.themeList = response.data.themeList
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
      this.$axios.post('role/delete', { id: this.delId }).then(response => {
        if (response.data === null) {
          this.$Message.success('删除成功！')
          this.getAuthList()
        }
      })
    },
    // 获取某主题权限详情
    getAuthDetail () {
      this.$axios.post('theme/detail', { id: this.saveId }).then(response => {
        let data = response.data
        this.authForm.name = data.name || ''
        this.authForm.describe = data.describe || ''
      })
    },
    // 保存修改
    saveRoleAuth () {
      let data = {
        id: this.saveId,
        name: this.authForm.name,
        describe: this.authForm.describe
      }
      this.$axios.post('theme/save', data).then(response => {
        if (response.data === null) {
          this.$Message.success('提交成功！')
          this.getAuthList()
        }
      })
    },
    // 重置表单
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    searchName (name) {
      this.name = name
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

