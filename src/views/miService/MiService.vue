<template>
  <div class="content-body">
    <search-header 
      placeholder="姓名"
      :ifSearchCompany="false"
      :ifDatePicker="true"
      :ifAddBtn="true"
      @onDateChange="dateChange"
      @onSearchName="searchName"
      @onAdd="addMicro">
    </search-header>
    <Table 
      :columns="columnAuth" 
      :data="microList">
    </Table>
    <Modal
      v-model="showModal"
      title="删除应用"
      @on-ok="deleteMicro">
      <p>确定删除该微服务吗？</p>
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
import SearchHeader from '../../components/SearchHeader'
export default {
  name: 'SecurityAuth',
  data () {
    return {
      name: '', // 角色名称 搜索
      date: '', // 日期 搜索
      pageSize: 10,
      pageNo: 1,
      total: 0,
      columnAuth: [
        {
          title: '微服务名称',
          key: 'name'
        },
        {
          title: '描述',
          key: 'describe'
        },
        {
          title: '修改日期',
          key: 'updateDate'
        },
        {
          title: 'url',
          key: 'url'
        },
        {
          title: '接口',
          key: 'interfaces'
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
                    that.$store.commit('SET_MICRO_ID', params.row.id)
                    that.$router.push({ name: 'EditMicro' })
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
      microList: [], // 主题权限列表
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
      // showEdit: false, // 编辑模态框
      delId: '', // 删除 id
      authForm: {
        name: '',
        enName: '',
        dataScope: ''
      }
    }
  },
  methods: {
    addMicro () {
      // this.showEdit = true
      this.$store.commit('SET_MICRO_ID', '')
      this.$router.push({ name: 'EditMicro' })
    },
    getMicroList () {
      let data = {
        name: this.name,
        date: this.date,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      this.$axios.post('mic_service/list', data).then(response => {
        if (response.data) {
          this.microList = response.data.mServiceList
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
    deleteMicro () {
      this.$axios.post('mic_service/delete', { id: this.delId }).then(response => {
        if (response.data === null) {
          this.$Message.success('删除成功！')
          this.getMicroList()
        }
      })
    },
    // 保存修改
    saveRoleAuth () {
      let data = {
        id: this.saveId,
        name: this.authForm.name,
        describe: this.authForm.describe
      }
      this.$axios.post('secret/save', data).then(response => {
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
      this.getMicroList()
    },
    dateChange (date) {
      this.date = date
      this.getMicroList()
    },
    pageChange (pageNo) {
      this.pageNo = pageNo
      this.getMicroList()
    }
  },
  mounted () {
    this.getMicroList()
    this.getDeptList()
  },
  components: { SearchHeader }
}
</script>

