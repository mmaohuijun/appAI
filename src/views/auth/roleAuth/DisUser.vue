<template>
  <div class="content-body">
    <div>
      <!-- <ul>
        <li>角色名称:{{ roleDetail.name }}</li>
        <li>英文名称:{{ roleDetail.enName }}</li>
        <li>数据范围:{{ roleDetail.dataScope }}</li>
      </ul> -->
      <Form>
        <Form-item label="角色名称">
          <Input v-model="roleDetail.name"></Input>
        </Form-item>
        <Form-item label="英文名称">
          <Input v-model="roleDetail.enName"></Input>
        </Form-item>
        <Form-item label="数据范围">
          <Input v-model="roleDetail.dataScope"></Input>
        </Form-item>
      </Form>
      <Button type="primary" @click="disUser">分配用户</Button>
    </div>
    <Table :columns="disColumn" :data="disUserList">
    </Table>
    <Modal v-model="showDis" @on-ok="saveDis">
      <Card>
        <p slot="title">所在部门</p>
        <div>
          <ul>
            <tree-node 
              v-for="(item, index) in deptList" 
              :key="index" 
              @selectDept="selectDept"
              :dept-list="item">
            </tree-node>
          </ul>
        </div>
        <!-- <Tree :data="deptList"></Tree> -->

      </Card>
      <Card>
        <p slot="title">待选人员</p>
        <ul>
            <li 
            v-for="(item, index) in this.getWaitList" 
            :key="index">
              <a @click="chooseUser(index)">{{ item.username }}</a>
            </li>
          </a>  
        </ul>
      </Card>
      <Card>
        <p slot="title">已选人员</p>
        <ul>
          <a @click="cancleUser(index)" v-for="(item, index) in disUserList" :key="item.id">
            <li>{{ item.name }}</li>
          </a>  
        </ul>
      </Card>
    </Modal>
  </div>
</template>
<script>
import TreeNode from '../../../components/TreeNode'
export default {
  name: 'DisUser',
  data () {
    return {
      roleAuthId: '',
      roleDetail: {}, // 角色详情
      disUserList: [], // 已分配用户列表
      allUserList: [], // 所有用户列表
      waitList: [], // 待选用户列表
      deptList: [], // 所有部门列表
      disColumn: [
        {
          title: '归属公司',
          key: 'companyName'
        },
        {
          title: '归属部门',
          key: 'officeName'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '电话',
          key: 'phone'
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            let that = this
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  fontSize: '14px'
                },
                on: {
                  click () {
                    that.removeDis(params.row.id)
                  }
                }
              }, '移除')
            ])
          }
        }
      ],
      showDis: false, // 显示分配 模态框
      userIds: '' // 被选中的用户id
    }
  },
  computed: {
    getRoleAuthId () {
      if (this.$store.state.roleAuthId) {
        this.roleAuthId = this.$store.state.roleAuthId
      } else {
        this.roleAuthId = this.$store.getters.getRoleAuthId
      }
      return this.roleAuthId
    },
    getWaitList () {
      this.waitList = this.$store.state.waitList
      return this.waitList
    }
  },
  methods: {
    getUserList () {
      if (this.getRoleAuthId) {
        this.$axios.post('role/role_user_list', { id: this.getRoleAuthId }).then(response => {
          if (response.data) {
            this.roleDetail = response.data.roleDetail
            this.disUserList = response.data.userList
            this.allUserList = response.data.userAllList
          }
        })
      }
    },
    getDeptList () {
      this.$axios.post('user/to_save').then(response => {
        if (response.data) {
          this.deptList = response.data.officeAllList
        }
      })
    },
    // 点击分配用户按钮 显示模态框
    disUser () {
      this.showDis = true
    },
    // 点击父级菜单
    selectDept (dept) {
      let data = {
        dept: '',
        name: '',
        date: '',
        pageSize: 2000,
        pageNo: 1
      }
      this.$axios.post('user/list', data).then(response => {
        this.waitList = response.data.userList
        this.$store.commit('SET_WAITLIST', this.waitList)
      })
    },
    // 选择用户
    chooseUser (index) {
      console.log(this.waitList[index])
      this.disUserList.push({ id: this.waitList[index].id, name: this.waitList[index].username })
      this.waitList.splice(index, 1)
      console.log('disUserList', this.disUserList)
    },
    // 取消选择用户
    cancleUser (index) {
      this.waitList.push({ username: this.disUserList[index].name })
      this.disUserList.splice(index, 1)
    },
    // 确定分配用户
    saveDis () {
      let arr = []
      for (let i = 0; i < this.disUserList.length; i++) {
        arr.push(this.disUserList[i].id)
        this.userIds = arr.toString()
      }
      let data = {
        id: this.getRoleAuthId,
        userIds: this.userIds
      }
      this.$axios.post('role/role_add_user', data).then(response => {
        if (response.data === null) {
          this.getUserList()
        }
      })
    },
    removeDis (userId) {
      let data = {
        id: this.getRoleAuthId,
        userId: userId
      }
      this.$axios.post('role/role_remove_user', data).then(response => {
        if (response.data === null) {
          this.$Message.success('删除成功！')
          this.getUserList()
        }
      })
    }
  },
  mounted () {
    this.getDeptList()
    this.getUserList()
  },
  components: { TreeNode }
}
</script>
<style lang="less">
  .ivu-modal-body {
    display: flex;
    justify-content: space-between; 

    .ivu-card {
      width: 30%;
    }
  }
</style>


