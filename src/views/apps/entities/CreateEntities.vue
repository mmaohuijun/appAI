<template>
  <div class="content-body ">
    <div class="content-body-header">
      <div class="">
        <span style="padding-right: 15px;">关键词</span>
        <Input 
          @on-click="getEntitiesList"
          v-model="name"
          icon="search" 
          placeholder="应用名称" 
          style="width: 200px">
        </Input>
      </div>
    </div> 

    <div>
      <h2 class="list-header">词库列表</h2>
      <div style="display: flex" >
        <aside>
          <ul v-if="hasEntities">
            <li 
              v-for="(item, index) in entitiesList" 
              :key="index" 
              @click="gotoEdit(index)">
              <a>{{item.name}}</a>
            </li>
          </ul>
          <p v-else class="empty-list">当前词库列表为空！</p>
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
                  v-focus="addKeyLine"
                  v-model="item.keyword">
                </td>
              </tr>      
            </table>
            <a href="" @click.prevent="addKeyLine">添加一行</a>
          </Form-item>
          <Form-item>
            <Button type="primary" size="large" @click="saveCreate('createEntitiesForm')">保存</Button>
          </Form-item>
        </Form>         
      </div>
       
     </div> 

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
        wordList: []
      },
      // 表单验证规则
      ruleEntitiesForm: {
        name: [
          { required: true, message: '词库名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'getAppId'
    ])
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
    // 编辑某个词库
    gotoEdit (index) {
      // console.log(this.entitiesList[index].id)
      this.$store.dispatch('setEntityId', this.entitiesList[index].id)
      this.$router.push({ name: 'EditEntities' })
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
            synonymyFlag: 0
          }
          this._.each(this.createEntitiesForm.wordList, (ele, index) => {
            data[`wordList[${index}].keyword`] = ele.keyword
          })
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
        // this.createEntitiesForm.wordList.push({ keyword: this.createEntitiesForm.wordList.keyword })
    },
    initEntitiesDetail () {
      this.createEntitiesForm.wordList.push({ keyword: this.createEntitiesForm.wordList.keyword })
    },
    addKeyLine () {
      this.createEntitiesForm.wordList.push({ keyword: this.createEntitiesForm.wordList.keyword })
      // console.log(this.createEntitiesForm.wordList)
    },
    // enter 添加一行
    enterAddLine (event) {
      if (event.key === 'Enter' || event.keyCode === 13) {
        this.addKeyLine()
      }
    }
  },
  watch: {
    'name' (newV, oldV) {
      this.getEntitiesList()
    }
  },
  created () {
    this.$store.dispatch('getAppIdFromStorage')
    this.getEntitiesList()
    this.initEntitiesDetail()
    document.addEventListener('keyup', this.enterAddLine)
  },
  destroyed () {
    document.removeEventListener('keyup', this.enterAddLine)
  }
}
</script>

<style lang="less">
  .content-body {
    position: relative;
  }
</style>
