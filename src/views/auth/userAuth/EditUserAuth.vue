<template>
  <div class="content-body">
    <Form :model="authForm">
      <Form-item label="姓名">
        <Input v-model="authForm.name"></Input>
      </Form-item>
      <Form-item label="email">
        <Input v-model="authForm.email"></Input>
      </Form-item>
      <Form-item label="联系电话">
        <Input v-model="authForm.phone"></Input>
      </Form-item>
      <Form-item label="归属公司">
        <Input v-model="authForm.company"></Input>
      </Form-item>
      <Form-item label="归属部门">
        <Select v-model="authForm.officeid">
          <Option 
            v-for="item in deptList" 
            :value="item.id" 
            :key="item.id">
            {{ item.name }}
          </Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button @click="saveUserAuth">提交</Button>
      </Form-item>
    </Form>
  </div>
</template>
<script>
export default {
  name: 'EditUserAuth',
  data () {
    return {
      userAuthId: '', // 当前修改 id
      authForm: {
        name: '',
        email: '',
        phone: '',
        company: '微构科技',
        officeid: 0
      },
      deptList: [] // 部门列表
    }
  },
  computed: {
    getUserAuthId () {
      this.userAuthId = this.$store.state.userAuthId
      if (!this.userAuthId) {
        if (this.$store.getters.getUserAuthId) {
          this.userAuthId = this.$store.getters.getUserAuthId
        }    
      }
      return this.userAuthId
    }
  },
  methods: {
    // 获取部门列表
    getDeptList () {
      this.$axios.post('user/to_save').then(response => {
        if (response.data) {
          this.deptList = response.data.officeAllList
        }
      })
    },
    // 保存用户权限
    saveUserAuth () {
      let data = {
        id: this.id,
        name: this.authForm.name,
        email: this.authForm.email,
        phone: this.authForm.phone,
        officeid: this.authForm.officeid
      }
      this.$axios.post('user/regist', data).then(response => {
        if (response.data === null) {
          this.$Message.success('提交成功！')
          this.$router.push({ name: 'UserAuth' })
        }
      })
    },
    // 获取用户权限表单详情
    getAuthDetail () {
      this.$axios.post('user/detail', { id: this.getUserAuthId }).then(response => {
        console.log(response)
      })
    }
  },
  mounted () {
    this.getDeptList()
    this.getAuthDetail()
  }
}
</script>

