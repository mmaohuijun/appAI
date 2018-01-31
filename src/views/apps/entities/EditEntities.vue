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
      entityId: '',
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
        name: [
          { required: true, message: '词库名称不能为空', trigger: 'blur' }
        ]
      },
      // 词库详情
      entitiesDetail: {},
      hasChoosed: false
    }
  },
  computed: {
    ...mapGetters([
      'getAppId'
    ]),
    getEntityId () {
      this.entityId = this.$store.state.entityId
      if (!this.entityId) {
        this.entityId = this.$store.getters.getEntityId
      }
      return this.entityId
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
      this.entityId = selectEntity
      if (!selectEntity) {
        this.entityId = this.getEntityId
      }
      this.$axios.post('dict/detail', { id: this.entityId }).then(response => {
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
      this.hasChoosed = true
      let selectEntity = this.entitiesList[index].id
      this.$store.dispatch('setEntityId', selectEntity)
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
            synonymyFlag: 0
            // wordList: this.createEntitiesForm.wordList
          }
          this._.each(this.createEntitiesForm.wordList, (ele, index) => {
            data[`wordList[${index}].keyword`] = ele.keyword
            data[`wordList[${index}].id`] = ele.id
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
    // 添加一行
    addLine () {
      this.createEntitiesForm.wordList.push({ keyword: this.createEntitiesForm.wordList.keyword })
      // console.log(this.createEntitiesForm.wordList)
    },
    // 删除一行
    delLine (index) {
      console.log(index)
      this.createEntitiesForm.wordList.splice(index, 1)
    },
    // enter 添加一行
    enterAddLine (event) {
      if (event.key === 'Enter' || event.keyCode === 13) {
        this.addLine()
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
  .content-body {
    position: relative
  }
  .icon-trash {
    position: absolute;
    top: 30%;
    right: 15px;
    font-size: 16px;
    color: #333;
    display: none;
  }
  .choosed {
    background: #333;
  }
</style>
