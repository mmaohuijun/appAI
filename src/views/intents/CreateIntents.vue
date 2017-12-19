<template>
  <div class="create-box">
    <aside v-if="hasIntentsList">
      <h2>场景列表</h2>
      <input type="text" placeholder="搜索">
      <ul>
        <li><a href="" @click.prevent="gotoEdit">123</a></li>
      </ul>
    </aside>
    <Form class="form" ref="createIntentsForm" :model="createIntentsForm" :rules="ruleIntentsForm">
      <Form-item label="场景名称" prop="intentName">
        <Input v-model="createIntentsForm.intentName"></Input>
      </Form-item>
      <Form-item label="用户提问">
        <Input placeholder="添加用户提问语料"></Input>
        <a href="">添加一行</a>
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
      // 创建场景 表单
      createIntentsForm: {
        intentName: ''
      },
      // 场景表单的验证规则
      ruleIntentsForm: {
        intentName: [
          { required: true, message: '场景名称不能为空', trigger: 'blur' }
        ]
      },
      // 是否显示场景列表
      hasIntentsList: false
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
          // 显示场景列表 以及新添加的值
          this.hasIntentsList = true
        }
      })
    }
  }
}
</script>

<style lang="less">
  .create-box {
    display: flex;
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
    input {
      outline: none;
      border: none;
      // border-right: 1px solid #ccc;
      width: 290px;
      padding: 10px 15px;
      // box-sizing: border-box;
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
    input {
      border: none;
      outline: none;
    }
  }
</style>
