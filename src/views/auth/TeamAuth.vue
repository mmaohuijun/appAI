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
      @onAdd="addTheme">
    </search-header>
    <Table 
      :columns="columnAuth" 
      :data="officeList">
    </Table>
    <Modal
      v-model="showModal"
      title="删除应用"
      :closable="false"
      @on-ok="deleteTeam">
      <p>确定删除该组权限吗？</p>
      <p>删除后无法恢复</p>
    </Modal>
    <Modal
      :closable="false"
      v-model="showEdit"
      title="编辑组权限">
      <Form ref="authForm" :model="authForm" :label-width="60">
        <Form-item label="部门名称" prop="name">
          <Input v-model="authForm.name"></Input>
        </Form-item>
        <Form-item label="机构层级" prop="type">
          <Input v-model="authForm.type" disabled ></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button @click="saveEdit" type="primary">确定</Button>
        <Button @click="showEdit=false">取消</Button>
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
import SearchHeader from '../../components/SearchHeader'
export default {
  name: 'TeamAuth',
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
          title: '机构名称',
          key: 'name'
        },
        {
          title: '机构类型',
          key: 'type'
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
                    that.showEdit = true
                    that.saveId = params.row.id
                    that.getAuthDetail(params.row.id)
                    // that.$store.commit('SET_TEAMAUTHID', params.row.id)
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
      officeList: [], // 用户权限列表
      showModal: false, // 显示模态框
      delId: '', // 删除 id
      saveId: '',
      showEdit: false,
      showDis: false,
      authForm: {
        name: '',
        type: 2,
        parentIds: '',
        parent: ''
      }
    }
  },
  methods: {
    // 添加组权限
    addTheme () {
      // this.authForm.name = ''
      this.saveId = ''
      this.showEdit = true
    },
    // 获取权限列表
    getAuthList () {
      let data = {
        dept: this.dept,
        name: this.name,
        date: this.date,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      this.$axios.post('office/list', data).then(response => {
        if (response.data) {
          console.log(response.data)
          this.officeList = response.data.officeList
          for (let i = 0; i < this.officeList.length; i++) {
            this.officeList[i].type === '1' ? this.officeList[i].type = '公司' : this.officeList[i].type = '部门'
          }
          this.total = response.data.total
        }
      })
    },
    // 获取权限详情
    getAuthDetail (id) {
      this.$axios.post('office/detail', { id: id }).then(response => {
        if (response.data) {
          console.log(response)
          // this.authForm = response.data
          this.authForm.name = response.data.name
          this.authForm.parentIds = response.data.parentIds
          this.authForm.parent = response.data.parent
          this.authForm.type = response.data.type
        }
      })
    },
    // 保存 组权限
    saveEdit () {
      let data = {
        id: this.saveId,
        name: this.authForm.name,
        parentIds: this.authForm.parentIds || '0,1',
        parent: this.authForm.parent || 1,
        type: this.authForm.type || 2
      }
      this.$axios.post('office/save', data).then(response => {
        if (response.status.code === '200') {
          this.showEdit = false
          this.$Message.success('提交成功！')
          this.saveId = ''
          this.getAuthList()
        } else {
          this.$Message.error('提交失败！')
          this.showEdit = false
        }
      })
    },
    deleteTeam () {
      this.$axios.post('office/delete', { id: this.delId }).then(response => {
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
    },
    resetFields (name) {
      this.$refs[name].resetFields()
    }
  },
  mounted () {
    this.getAuthList()
  },
  watch: {
    'showEdit' () {
      this.resetFields('authForm')
    }
  },
  components: { SearchHeader }
}
</script>

