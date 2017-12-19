<template>
  <div class="create-box">
    <aside v-if="hasEntitiesList">
      <h2>词库列表</h2>
      <input type="text" placeholder="搜索">
      <ul>
        <li><a href="" @click.prevent="gotoEdit">123</a></li>
      </ul>
    </aside>
    <Form class="form" ref="createEntitiesForm" :model="createEntitiesForm" :rules="ruleEntitiesForm">
      <Form-item label="词库名称" prop="entitiesName">
        <Input v-model="createEntitiesForm.entitiesName"></Input>
      </Form-item>
      <Form-item>
        <table class="add-keywords-tbl">
          <tr><td><input placeholder="添加关键词" type="text"></td></tr>
          <tr><td><input placeholder="添加关键词" type="text"></td></tr>
          <tr><td><input placeholder="添加关键词" type="text"></td></tr>
          <tr><td><input placeholder="添加关键词" type="text"></td></tr>
          <tr><td><input placeholder="添加关键词" type="text"></td></tr>
        </table>
        <a href="">添加一行</a>
      </Form-item>
      <Form-item>
        <Button type="primary" size="large" @click="saveCreate('createEntitiesForm')">保存</Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'CreateEntities',
  data () {
    return {
      // 是否已创建词库
      hasEntitiesList: false,
      // 创建词库 表单
      createEntitiesForm: {
        entitiesName: ''
      },
      // 表单验证规则
      ruleEntitiesForm: {
        entitiesName: [
          { required: true, message: '词库名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 编辑某个词库
    gotoEdit () {
      this.$router.push('/editEntities')
    },
    saveCreate (name) {
      this.$refs[name].validate((valid) => {
        if (!valid) {
          this.$Message.error('提交失败')
        } else {
          this.$Message.success('提交成功')
          // 显示词库列表 以及新添加的值
          this.hasEntitiesList = true
        }
      })
    }
  }
}
</script>

<style lang="less">
  // 左侧侧边栏
  .create-box {
    display: flex;
  }
  aside {
    // float: left;
    width: 300px;
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
  .add-keywords-tbl {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ccc;

    td {
      padding: 5px 20px;
      border: 1px solid #ccc;
    }

    input {
      width: 100%;
      outline: none;
      border: none;
    }
  }
</style>
