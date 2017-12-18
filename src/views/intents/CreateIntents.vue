<template>
  <div>
    <Form ref="createIntentsForm" :model="createIntentsForm" :rules="ruleIntentsForm">
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
        <Button type="primary" size="large">保存</Button>
      </Form-item>
    </Form>
    <aside>
      <h2>场景列表</h2>
      <input type="text" placeholder="搜索">
      <ul>
        <li>haha</li>
        <li>fjfj</li>
      </ul>
    </aside>
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
          { require: true, message: '场景名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="less">
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
