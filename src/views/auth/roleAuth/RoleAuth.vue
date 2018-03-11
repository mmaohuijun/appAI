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
      :data="roleList">
    </Table>
    <Modal
      v-model="showModal"
      title="删除用户权限"
      :closable="false"
      @on-ok="deleteUser">
      <p>确定删除该用户权限吗？</p>
      <p>删除后无法恢复</p>
    </Modal>
    <Modal 
      v-model="showEdit" 
      :closable="false"
      title="编辑用户权限">
      <Form :model="authForm" ref="authForm" :rule="authForm">
        <Form-item label="角色名称" prop="name">
          <Input v-model="authForm.name"></Input>
        </Form-item>
        <Form-item label="英文名称" prop="enName">
          <Input v-model="authForm.enName"></Input>
        </Form-item>
        <Form-item label="数据范围" prop="dataScope">
          <Select v-model="authForm.dataScope">
            <Option
              v-for="item in scopeList"
              :value="item.value"
              :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveRoleAuth">提交</Button>
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
import SearchHeader from '../../../components/SearchHeader'
export default {
  name: 'RoleAuth',
  data () {
    return {
      name: '', // 角色名称 搜索
      date: '', // 日期 搜索
      pageSize: 10,
      pageNo: 1,
      total: 0,
      columnAuth: [
        {
          title: '角色名称',
          key: 'name'
        },
        {
          title: '英文名称',
          key: 'enName'
        },
        {
          title: '数据范围',
          key: 'dataScope'
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
                  size: 'small',
                  icon: 'person'
                },
                style: {
                  marginRight: '5px',
                  color: '#999',
                  fontSize: '22px'
                },
                on: {
                  click () {
                    that.showDis = true
                    that.$store.commit('SET_ROLEAUTHID', params.row.id)
                    that.$router.push({ name: 'DisUser' })
                  }
                }
              }),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  icon: 'ios-infinite'
                },
                style: {
                  marginRight: '5px',
                  color: '#999',
                  fontSize: '20px'
                },
                on: {
                  click () {
                    that.showDis = true
                    that.$store.commit('SET_ROLEAUTHID', params.row.id)
                    that.$router.push({ name: 'DisThemeUser' })
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
      roleList: [], // 用户权限列表
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
      this.$axios.post('role/list', data).then(response => {
        if (response.data) {
          this.roleList = response.data.roleList
          this.total = response.data.total
          for (let i = 0; i < this.roleList.length; i++) {
            switch (this.roleList[i].dataScope) {
              case '1': this.roleList[i].dataScope = '所有数据'
                break
              case '2': this.roleList[i].dataScope = '所在公司数据'
                break
              case '3': this.roleList[i].dataScope = '所在部门数据'
                break
              case '5': this.roleList[i].dataScope = '仅本人数据'
                break
              case '9': this.roleList[i].dataScope = '按明细设置'
            }
          }
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
    // 获取某用户权限详情
    getAuthDetail () {
      this.$axios.post('role/detail', { id: this.saveId }).then(response => {
        let data = response.data
        this.authForm.name = data.name || ''
        this.authForm.enName = data.enName || ''
        this.authForm.dataScope = data.dataScope || ''
      })
    },
    // 保存修改
    saveRoleAuth () {
      let data = {
        id: this.saveId,
        name: this.authForm.name,
        enName: this.authForm.enName,
        dataScope: this.authForm.dataScope
      }
      this.$axios.post('role/save', data).then(response => {
        if (response.data === null) {
          this.showEdit = false
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

