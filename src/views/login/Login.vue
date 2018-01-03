<template>
  <div class="login">
    <div class="login-box">
      <h1>企业智能聊天机器人</h1>
      <Form>
        <Form-item label="用户名">
          <Input v-model="username"></Input>
        </Form-item>
        <Form-item label="密码">
          <Input type="password" v-model="password"></Input>
        </Form-item>
        <Form-item>
          <Button @click="toRegister">注册</Button>
          <Button @click="toLogin">登录</Button>
        </Form-item>
      </Form>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    // 注册
    toRegister () {
      this.$axios.post('user/regist', { username: this.username, password: this.password }).then(response => {
        console.log(response)
      })
    },
    // 登录
    toLogin () {
      this.$axios.post('login', { username: this.username, password: this.password }).then(response => {
        if (response.resCode === "000") {
          // 登录成功时 将用户名保存下用作标识用户身份的id
          this.$store.dispatch('setUserName', this.username)
          this.$router.push({ name: 'Application' })
        }
      })
    }
  }
}
</script>


<style lang="less">
  .login {
    .login-box {
      width: 400px;
      margin: 200px auto;
      border: 1px solid #ccc;
      padding: 20px;
    }
  }
</style>
