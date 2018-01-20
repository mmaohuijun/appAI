<template>
  <div class="content-body">
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
      <Button type="primary" @click="disThemeUser">分配主题和密级</Button>
      <Table :columns="themeColumn" :data="themeList"></Table>
      <Table :columns="secretColumn" :data="secretList"></Table>
      <Modal v-model="showDis" @on-ok="saveDis" >
        <Card>
          <p slot="title">主题</p>
          <ul>
            <li>待分配</li>
            <li 
              @click="disTheme(index)"
              v-for="(item, index) in themeAllList" 
              :key="index">
            {{ item.name }}
            </li>
          </ul>
          <ul>
            <li>已分配</li>
            <li 
              @click="cancleTheme(index)"
              v-for="(item, index) in themeList" 
              :key="index">
            {{ item.name }}
            </li>
          </ul>
        </Card>
        <Card>
          <p slot="title">密级</p>
          <ul>
            <li>待分配</li>
            <li 
              @click="disSecret(index)"
              v-for="(item, index) in secretAllList" 
              :key="index">
            {{ item.name }}
            </li>
          </ul> 
          <ul>
            <li>已分配</li>
            <li 
              @click="cancleSecret(index)"
              v-for="(item, index) in secretList" 
              :key="index">
              {{ item.name }}
            </li>
          </ul>
        </Card>
      </Modal>
      <Modal></Modal>
  </div>
</template>
<script>
export default {
  name: 'DisThemeUser',
  data () {
    return {
      roleAuthId: '', // 角色id
      themeIds: '', // 选中主题id
      secretIds: '', // 选中密级id
      roleDetail: {},
      themeList: [],
      themeAllList: [],
      secretList: [],
      secretAllList: [],
      showDis: false, // 显示分配模态框
      themeColumn: [
        {
          title: '主题',
          key: 'name'
        },
        {
          title: '操作',
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
                    that.removeTheme(params.row.id)
                  }
                }
              }, '移除')
            ])
          }
        }
      ],
      secretColumn: [
        {
          title: '密级',
          key: 'name'
        },
        {
          title: '操作',
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
                    that.removeSecret(params.row.id)
                  }
                }
              }, '移除')
            ])
          }
        }
      ]
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
    }
  },
  methods: {
    getUserList () {
      if (this.getRoleAuthId) {
        this.$axios.post('role/role_ts_list', { id: this.getRoleAuthId }).then(response => {
          if (response.data) {
            this.roleDetail = response.data.roleDetail,
            this.themeList = response.data.themeList,
            this.secretList = response.data.secretList,
            this.themeAllList = response.data.themeAllList,
            this.secretAllList = response.data.secretAllList
          }
        })
      }
    },
    // 分配密级和主题
    disThemeUser () {
      this.showDis = true
    },
    // 保存分配
    saveDis () {
      let arr1 = [], arr2 = []
      for (let i in this.themeList) {
        arr1.push(this.themeList[i].id)
        this.themeIds = arr1.toString()
      }
      for (let i of this.secretList) {
        arr2.push(i.id)
        this.secretIds = arr2.toString()
      }
      let data = {
        id: this.roleAuthId,
        themeIds: this.themeIds,
        secretIds: this.secretIds
      }
      this.$axios.post('role/role_add_tsids', data).then(response => {
        if (response.data === null) {
          this.$Message.success('提交成功！')
          this.getUserList()
        }
      })
    },
    // 选择主题
    disTheme (index) {
      this.themeList.push(this.themeAllList[index])
    },
    // 取消主题
    cancleTheme (index) {
      this.themeList.splice(index, 1)
    },
    // 选择密级
    disSecret (index) {
      this.secretList.push(this.secretAllList[index])
    },
    // 取消密级
    cancleSecret (index) {
      this.secretList.splice(index, 1)
    },
    // 移除主题
    removeTheme (id) {
      this.$axios.post('role/role_remove_theme', { themeId: id }).then(response => {
        if (response.data === null) {
          this.$Message.success('删除成功！')
          this.getUserList()
        }
      })
    },
    // 移除密级
    removeSecret (id) {
      this.$axios.post('role/role_remove_secret', { secretId: id }).then(response => {
        if (response.data === null) {
          this.$Message.success('删除成功！')
          this.getUserList()
        }
      })
    }
  },
  mounted () {
    this.getUserList()
  }
}
</script>
<style>
  .ivu-card-body {
    display: flex;
    justify-content: space-around
  }
</style>


