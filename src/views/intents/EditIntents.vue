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
      <Form-item label="场景名称" prop="name">
        <Input v-model="createIntentsForm.name"></Input>
      </Form-item>
      <Form-item label="用户提问" class="user-ask"><br>
      <div v-for="(item, index) in askList" :key="index" style="border: 2px solid pink">
        <div>
          <div>
            <input 
            @select="selectText(index)" 
            class="my-input" 
            type="text" 
            placeholder="添加用户提问语料" 
            v-model="item.text"/>
          </div>    
        </div>        
          <Select v-if="entitySelect" @on-change="changeSelect">
            <Option v-for="item in entitiesList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>

        <div v-if="hasSelected || item.entitys">
          <table class="action-tbl" >
            <thead>
              <tr>
                <th>名称</th>
                <th>类型</th>
                <th>取值</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in item.entitys" :key="index" :ask-list="item">
                <td><input type="text" v-model="item.entity"></td>
                <td @click="toEditSelect(index)">{{ item.type }}</td>
                <td>{{ item.value }}</td>
                <td><button @click.prevent="deleteEntityLine(index)">删除</button></td>
              </tr>
            </tbody>
          </table>         
        </div>              
      </div>
      <a href="" @click.prevent="addAskList">添加一行</a> 
      </Form-item>
      <Form-item label="动作">
        <input type="text" class="my-input" placeholder="请输入动作名称" v-model="actionName">
      </Form-item>
      <Form-item>
        <table class="action-tbl" v-if="showActionList">
          <thead>
            <!-- <td>是否必须</td> -->
            <td>参数名称</td>
            <td>类型</td>
            <td>取值</td>
            <!-- <td>提示语</td> -->
            <td>操作</td>
          </thead>
          <tbody>
            <!-- <td>
              <input type="checkbox">
            </td> -->
            <tr v-for="(item, index) in slotList" :key="index">
              <td>
                <input type="text" placeholder="添加参数名称..." v-model="item.typeName">
              </td>
              <td>
                <input type="text" placeholder="选择类型" v-model="item.dictName">
              </td>
              <td>
                <input type="text" v-model=" '${ ' + item.typeName + '}'">
              </td>
              <td>
                <button @click.prevent="delSlotList(index)">删除</button>
              </td>
              <!-- <td>
                <input type="text" placeholder="编辑提示语" v-model="item.message">
              </td> -->
            </tr>
            
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
  name: 'EditIntents',
  data () {
    return {
      appId: '', // 应用id
      intentId: '',
      name: '', // 搜素场景关键词
      createIntentsForm: { // 创建场景 表单
        name: '', // 场景名称
        text: '' // 提问语料
      },
      ruleIntentsForm: { // 场景表单的验证规则
        intentName: [
          { required: true, message: '场景名称不能为空', trigger: 'blur' }
        ]
      },
      hasIntents: false, // 是否有场景
      intentList: [], // 场景列表
      entitiesList: [], // 词库列表
      entitySelect: false, // 是否显示词库选择下拉框
      hasSelected: false, // 已经选取有效字段
      showActionList: false,
      askList: [],
      // askList: [
      //   {
      //     id: '',
      //     text: '34', // 用户提问语料
      //     intent: '', // 场景名称
      //     entitys: [ // 用户提问下的表格
      //       {
      //         entity: '11', // 名称
      //         type: '112',
      //         value: '123' // 取值
      //       }
      //     ]
      //   }
      // ], // 用户提问列表
      textIndex: '', // 选中的text index
      editSelect: false, // 是否为编辑下拉列表值
      slotList: [],
      actionName: '', // 动作名称
      selector: '' // 鼠标划取的词
    }
  },
  computed: {
    getAppId () {
      return this.$store.getters.getAppId
    },
    getIntentId () {
      return this.$store.getters.getIntentId
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
    // 获取某场景详情
    getIntentsDetail () {
      this.intentId = this.$store.state.intentId
      if (!this.intnetId) {
        this.intentId = this.getIntentId
      }
      this.$axios.post('intent/detail', { id: this.intentId }).then(response => {
        if (response.data) {
          console.log(response.data)
          var data = response.data.intent
          this.createIntentsForm.name = data.name
          this.askList = data.askList
          this.slotList = data.slotList
          this.actionName = data.actionName
        }
      })
    },
    // 鼠标选中 表单中的文字
    selectText (index) {
      console.log('selectText', index)
      this.textIndex = index
      // let selector = window.getSelection() ? window.getSelection().toString : document.selection.createRange().text
      let selector = window.getSelection().toString()
      if (this.entitiesList.length > 0) {
        this.entitySelect = true
        if (selector) {
          this.selector = selector
        }
      }
    },
    // 选中的Option变化时触发
    changeSelect (entityId, tbindex) {
      this.entitySelect = false
      let index, entity, type, value
      for (index = 0; index < this.entitiesList.length; index++) {
        if (this.entitiesList[index].id === entityId) {
          console.log(index)
          this.hasSelected = true
          this.showActionList = true
          entity = this.entitiesList[index].pinyin
          type = this.selector
          value = this.entitiesList[index].name
        }
      }
      console.log(tbindex)
      this.askList[this.textIndex].entitys.push({ entity: entity, type: type, value: value })
      this.slotList.push({ typeName: entity, dictName: type })
      console.log(this.askList)
    },
    // 删除一行
    deleteEntityLine (index) {
      console.log(index)
      this.askList[this.textIndex].entitys.splice(index, 1)
      if (this.askList[this.textIndex].entitys.length < 1) {
        this.hasSelected = false
      }
    },
    delSlotList (index) {
      this.slotList.splice(index, 1)
      if (this.slotList.length < 1) {
        this.showActionList = false
      }
    },
    // 添加一行 用户提问
    addAskList () {
      this.askList.push({})
    },
    // 编辑下拉框的值
    toEditSelect (entityId, tbindex) {
      this.editSelect = true
      this.entitySelect = true
      this.changeSelect(entityId, tbindex)
    }
  },
  created () {
    // console.log(this.getAppId)
    this.getIntentsList()
    this.getIntentsDetail()
    this.getEntitiesList()
  }
}
</script>

<style lang="less">
  // 右侧表单
  .form {
    // 用户提问
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
