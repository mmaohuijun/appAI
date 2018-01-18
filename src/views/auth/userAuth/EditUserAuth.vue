<template>
  <div class="content-body">
    <Form :model="authForm">
      <Form-item label="姓名">
        <Input v-model="authForm.username"></Input>
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
        <Button type="primary" @click="saveUserAuth">提交</Button>
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
        username: '',
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
      this.userAuthId = this.$store.state.userAuthId || this.$store.getters.getUserAuthId
      return this.userAuthId
    }
  },
  methods: {
 
    // 保存用户权限
    saveUserAuth () {
      let data = {
        id: this.getUserAuthId || '',
        username: this.authForm.username,
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
      console.log('getAuthDetail', this.getUserAuthId)
      if (this.getUserAuthId) {
        this.$axios.post('user/detail', { id: this.getUserAuthId }).then(response => {
          let data = response.data
          this.authForm.username = data.username || ''
          this.authForm.email = data.email || ''
          this.authForm.phone = data.phone || ''
          this.authForm.officeid = data.officeid || ''
        })
      }
    }
  },
  mounted () {
    this.getDeptList()
    this.getAuthDetail()
  }
}
</script>

