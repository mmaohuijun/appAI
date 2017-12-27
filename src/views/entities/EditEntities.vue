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
          <tr v-for="(item, index) in createEntitiesForm.wordList" :key="index">
            <td>
              <input 
              placeholder="添加关键词"
              type="text" 
              v-focus="addLine"
              v-model="item.keyword">
            </td>
          </tr>      
        </table>
        <a href="" @click.prevent="addLine">添加一行</a>
      </Form-item>
      <Form-item>
        <Button type="primary" size="large" @click="saveCreate('createEntitiesForm')">保存</Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  name: 'CreateEntities',
  data () {
    return {
      // 应用id
      appId: '',
      // 搜索词库列表 关键词
      name: '',
      // 词库id
      id: '',
      // 词库列表
      entitiesList: [],
      // 创建词库 表单
      createEntitiesForm: {
        name: '',
        wordList: []
      },
      // 是否有词库列表
      hasEntities: false,
      // 表单验证规则
      ruleEntitiesForm: {
        entitiesName: [
          { required: true, message: '词库名称不能为空', trigger: 'blur' }
        ]
      },
      // 词库详情
      entitiesDetail: {}
    }
  },
  computed: {
    getAppId () {
      return this.$store.getters.getAppId
    },
    getEntityId () {
      return this.$store.getters.getEntityId
    }
  },
  directives: {
    focus: {
      inserted: function (el, { value }) {
        if (value) {
          el.focus() 
        }
      }
    }
  },
  methods: {
    // 获取词库列表
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
    },
    // 获取某词库详情
    getEntitiesDetail (selectEntity) {
      this.id = selectEntity
      if (!selectEntity) {
        this.id = this.getEntityId
      }
      this.$axios.post('dict/detail', { id: this.id }).then(response => {
        if (response.data) {
          let data = response.data.detail
          this.createEntitiesForm.name = data.name
          this.createEntitiesForm.wordList = data.wordList
          this.createEntitiesForm.id = data.id
          if (data.wordList.length < 1) {
            this.addLine()
          }
        }
      })
    },
    // 修改某个词库
    gotoEdit (index) {
      let selectEntity = this.entitiesList[index].id
      this.$store.dispatch('setEntityId', this.entitiesList[index].id)
      this.getEntitiesDetail(selectEntity)
    },
    // 保存修改
    saveCreate (name) {
      this.$refs[name].validate((valid) => {
        if (!valid) {
          this.$Message.error('提交失败')
        } else {
          let data = {
            appId: this.appId,
            id: this.createEntitiesForm.id,
            name: this.createEntitiesForm.name,
            synonymyFlag: 0,
            wordList:[{ keyword: '123' }, { keyword: '222' }]
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
    // 添加一行
    addLine () {
      this.createEntitiesForm.wordList.push({ keyword: this.createEntitiesForm.wordList.keyword })
      console.log(this.createEntitiesForm.wordList)
    },
    // enter 添加一行
    enterAddLine (event) {
      if (event.key === 'Enter' || event.keyCode === 13) {
        this.addLine()
      }
    }
  },
  created () {
    this.getEntitiesList()
    this.getEntitiesDetail()
    document.addEventListener('keyup', this.enterAddLine)
  },
  destroyed () {
    document.removeEventListener('keyup', this.enterAddLine)
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
