<template>
  <div class="create-box">
    <aside>
      <h2>场景列表</h2>
      <input type="text" placeholder="搜索">   
      <ul v-if="hasIntents" v-for="(item, index) in intentList" :key="index">    
        <li><a href="" @click.prevent="gotoEdit">{{item.name}}</a></li>
      </ul>
      <p v-else>当前场景列表为空！</p>
    </aside>
    <Form class="form" ref="createIntentsForm" :model="createIntentsForm" :rules="ruleIntentsForm">
      <Form-item label="场景名称" prop="intentName">
        <Input v-model="createIntentsForm.intentName"></Input>
      </Form-item>
      <Form-item label="用户提问" class="user-ask"><br>
        <!-- <Input placeholder="添加用户提问语料"></Input>
        <a href="">添加一行</a> -->
        <div>
          <input type="text" placeholder="添加用户提问语料">
        </div>
        <div>
          <table class="user-ask-tbl">
            <thead>
              <tr>
                <th>名称</th>
                <th>类型</th>
                <th>取值</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>X</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Form-item>
      <Form-item label="动作">
        <Input placeholder="输入动作名称..."></Input>
      </Form-item>
      <Form-item>
        <table class="action-table">
          <thead>
            <td>是否必须</td>
            <td>参数名称</td>
            <td>类型</td>
            <td>取值</td>
            <td>提示语</td>
          </thead>
          <tbody>
            <td>
              <input type="checkbox">
            </td>
            <td>
              <input type="text" placeholder="添加参数名称...">
            </td>
            <td>
              <input type="text" placeholder="选择类型">
            </td>
            <td>
              <input type="text" value="${}">
            </td>
            <td>
              <input type="text" placeholder="编辑提示语">
            </td>
          </tbody>
        </table>
        <a href="">添加一行</a>
      </Form-item>
      <Form-item>
        <Button type="primary" size="large" @click="saveCreate('createIntentsForm')">保存</Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'CreateIntents',
  data () {
    return {
      appId: '', // 应用id
      name: '', // 搜素场景关键词
      createIntentsForm: { // 创建场景 表单
        intentName: ''
      },
      ruleIntentsForm: { // 场景表单的验证规则
        intentName: [
          { required: true, message: '场景名称不能为空', trigger: 'blur' }
        ]
      },
      hasIntents: false, // 是否有场景
      intentList: [] // 场景列表
    }
  },
  computed: {
    getAppId () {
      return this.$store.getters.getAppId
    }
  },
  methods: {
    // 编辑某个场景
    gotoEdit () {
      this.$router.push('/editIntents')
    },
    saveCreate (name) {
      this.$refs[name].validate((valid) => {
        if (!valid) {
          this.$Message.error('提交失败')
        } else {
          this.$Message.success('提交成功')
        }
      })
    },
    // 左侧场景列表
    getIntentsList () {
      this.appId = this.$store.state.appId
      if (!this.appId) {
        this.appId = this.getAppId
      }
      this.$axios.post('intent/list', { appId: this.appId, name: this.name }).then(response => {
        if (response.data.list.length > 0) {
          this.hasIntents = true
          this.intentList = response.data.list
        } else {
          this.hasIntents = false
        }
      })
    }
  },
  created () {
    // console.log(this.getAppId)
    this.getIntentsList()
  }
}
</script>

<style lang="less">
  .create-box {
    display: flex;
  }
  input {
      outline: none;
      border: none;
      // border-right: 1px solid #ccc;
      width: 290px;
      padding: 10px 15px;
      // box-sizing: border-box;
    }
  // 左侧侧边栏
  aside {
    // float: left;
    width: 300px;
    // height: 100%;
    border: 1px solid #ccc;
    padding: 15px 0;
    margin-right: 15px;
    border-bottom: none;

    h2 {
      border-bottom: 1px solid #ccc;
      padding-bottom: 15px;
      width: 300px;
      padding-left: 15px;
    }
    ul {
      border-top: 1px solid #ccc;
      li {
        // border-bottom: 1px solid #ccc;       
        a {
          width: 100%;
          display: inline-block;
          padding: 8px 15px;
          color: #333;

          &:hover {
            color: #fff;
          }
        }

        &:hover a {
          cursor: pointer;
        background: #9399A6;
        }
      }
    }
  }
  // 右侧表单
  .form {
    flex-grow: 1;

    // 用户提问
    .user-ask {
      input {

      }
    }
  }
  .action-table {
    border: 1px solid #ccc;
    border-collapse: collapse;
    width: 100%;
    thead {
      text-align: center;
    }
    td {
      border: 1px solid #ccc;
      padding: 10px;
    }
  }
  //
</style>
