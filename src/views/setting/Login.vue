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
import { mapGetters } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      username: 'admin',
      password: '123456'
    }
  },
  computed: {
    ...mapGetters([
      'firstRoute'
    ])
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
        console.log(response)
        if (response.status.code === '200') {
          this.$store.dispatch('toggleLoginStatus', true)
          const resData = response.data
          const loginInfo = {
            auth: resData.menuList,
            token: resData.token.token,
            username: resData.username
          }
          console.log('loginInfo', loginInfo)
          this.$store.dispatch('setUserInfo', loginInfo)
          this.$store.commit('SET_FIRST_ROUTE', resData.menuList[0])
          this.$router.push({ name: this.firstRoute })
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
  body {
    height: auto;
  }
</style>
