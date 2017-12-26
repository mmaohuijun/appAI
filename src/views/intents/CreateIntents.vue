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
          <input @select="selectText" class="my-input" type="text" placeholder="添加用户提问语料">
          <Select v-if="selectSomething">
            <Option v-for="item in entitiesList" :value="item.name" :key="item.id">{{item.name}}</Option>
          </Select>
        </div>
        <div>
          <table class="action-tbl user-ask-tbl">
            <thead>
              <tr>
                <th>名称</th>
                <th>类型</th>
                <th>取值</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in askForm" :key="index">
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
        <table class="action-tbl">
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
      intentList: [], // 场景列表
      selectSomething: false, // 是否选取文字
      entitiesList: [], // 词库列表
      askList: [] // 用户提问列表
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
    },
    // 获取词库列表
    getEntitiesList () {
      this.$axios.post('dict/list', { appId: this.appId, name: '' }).then(response => {
        if (response.data) {
          this.entitiesList = response.data.dictList
        }
      })
    },
    // 获取用户提问列表

    // 鼠标选中 表单中的文字
    selectText () {
      console.log('selectText')
      // let selector = window.getSelection() ? window.getSelection().toString : document.selection.createRange().text
      let selector = window.getSelection().toString()
      // alert(selector)
      if (selector !== null) {
        this.selectSomething = true
        this.getEntitiesList()
      }
    }
  },
  created () {
    // console.log(this.getAppId)
    this.getIntentsList()
  }
}
</script>

<style lang="less">
  // 右侧表单
  .form {
    // 用户提问
    .user-ask {
      input {

      }
      .user-ask-tabl {
        
      }
    }
  }
  .action-tbl {
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
    input {
      outline: none;
      border: none;
      padding: 10px 15px;
    }
  }
  //
</style>
