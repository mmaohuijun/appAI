<template>
  <div class="layout">
      <Menu class="modify-ul" mode="horizontal" active-name="1" >
        <div class="layout-logo">
          <img src="../../assets/logo.png" alt="">
        </div>
        <div class="layout-logout">
          <p>
            Hi,{{this.username}}
            <Dropdown>
                <a href="javascript:void(0)">
                    设置
                    <Icon type="arrow-down-b" style="margin-left: 5px;"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem @click.native="gotoMod">修改密码</DropdownItem>
                    <DropdownItem @click.native="logout">安全退出</DropdownItem>
                </DropdownMenu>
            </Dropdown>  
          </p>
        </div>
      </Menu>
      <div class="pass-box">
        <Form>
          <h1>修改密码</h1>
          <Form-item label="原密码">
            <Input type="password" v-model="password"></Input>
          </Form-item>
          <Form-item label="修改密码">
            <Input type="password" v-model="newPassword"></Input>
          </Form-item>
          <Form-item>
            <Button type="primary" @click="modifyPwd">确定</Button>
          </Form-item>
        </Form>
      </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ModifyPwd',
  data () {
   return {
     password: '',
     newPassword: ''
   } 
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  },
  methods: {
    modifyPwd () {
      let data = {
        password: this.password,
        newPassword: this.newPassword
      }
      this.$axios.post('user/chg-passwd', data).then(response => {
        console.log(response)
      })
    }
  }
}
</script>
<style lang="less">
.layout {
  height: 100%;

    height: 75px;
    .modify-ul.ivu-menu {
      position: fixed;
      z-index: 900;
      top: 0;
      left: 0;
      width: 100%;
      height: 75px;
      background: #0396FF;
      line-height: 75px;
    }
    .layout-logo{
      border-radius: 3px;
      float: left;
      position: relative;
      top: 2px;
      left: 20px;
      img {
        width: 180px;
        margin-top: 13px;
      }
    }
    .layout-logout {
      float: right;
      margin-right: 35px;
      &>p {
        color: #fff;
      }
      a {
        text-decoration: none;
        margin-left: 5px;
      }
    }
} 
.pass-box {
  width: 500px;
  border: 1px solid #ccc;
  padding: 20px;
  margin: 300px auto;
}
</style>


