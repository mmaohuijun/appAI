<template>
  <div class="create-box">
    <aside>
      <h2>词库列表</h2>
      <input type="text" placeholder="搜索">   
      <ul v-if="hasEntities">    
        <li v-for="(item, index) in entitiesList" :key="index" @click="gotoEdit(index)">
          <a>{{item.name}}</a>
        </li>
      </ul>
      <p v-else>当前词库列表为空！</p>
    </aside>
    <Form class="form" ref="createEntitiesForm" :model="createEntitiesForm" :rules="ruleEntitiesForm">
      <Form-item label="词库名称" prop="name">
        <Input v-model="createEntitiesForm.name"></Input>
      </Form-item>
      <Form-item>
        <table class="add-keywords-tbl">
          <tr><td><input placeholder="添加关键词" type="text" v-model="createEntitiesForm.word"></td></tr>
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
      // 应用id
      appId: '',
      // 词库 id
      id: 0 || '',
      // 搜索词库列表 关键词
      name: '',
      // 是否已创建词库
      hasEntities: false,
      // 词库列表
      entitiesList: [],
      // 创建词库 表单
      createEntitiesForm: {
        name: '',
        word: ''
      },
      // 表单验证规则
      ruleEntitiesForm: {
        entitiesName: [
          { required: true, message: '词库名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    getAppId () {
      return this.$store.getters.getAppId
    }
  },
  methods: {
    // 编辑某个词库
    gotoEdit (index) {
      console.log(this.entitiesList[index].id)
      this.$store.dispatch('setEntityId', this.entitiesList[index].id)
      this.$router.push({ name: 'EditEntities', params: { appId: this.appId } })
    },
    saveCreate (name) {
      this.$refs[name].validate((valid) => {
        if (!valid) {
          this.$Message.error('提交失败')
        } else {
          let data = {
            appId: this.appId,
            name: this.createEntitiesForm.name,
            id: this.id,
            synonymyFlag: 0,
            wordList: []
          }
          this.$axios.post('dict/add', data).then(response => {
            if (response.data === null) {
              this.$Message.success('提交成功')
              this.getEntitiesList()
            }
          })
        }
      })
    },
    getEntitiesList () {
      this.appId = this.$store.state.appId
      if (!this.appId) {
        this.appId = this.getAppId
      }
      this.$axios.post('dict/list', { name: this.name, appId: this.appId }).then(response => {
        if (response.data.dictList.length > 0) {
          this.entitiesList = response.data.dictList
          this.hasEntities = true
        }
      })
    }
  },
  created () {
    this.getEntitiesList()
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
