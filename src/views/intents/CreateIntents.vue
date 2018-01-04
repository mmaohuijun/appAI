<template>
  <div class="create-box">
    <aside>
      <h2>场景列表</h2>
      <input type="text" placeholder="搜索">   
      <!-- <ul v-if="hasIntents" v-for="(item, index) in intentList" :key="index">    
        <li><a href="" @click.prevent="gotoEdit(index)">{{item.name}}</a></li>
      </ul> -->
      <ul v-if="hasIntents">
        <li 
          v-for="(item, index) in intentList"
          :key="index"
          @click="gotoEdit(index)">
          <a>{{item.name}}</a>
          </li>
      </ul>
      <p v-else class="empty-list">当前场景列表为空！</p>
    </aside>
    <Form class="form" ref="createIntentsForm" :model="createIntentsForm" :rules="ruleIntentsForm">
      <Form-item label="场景名称" prop="name">
        <Input v-model="createIntentsForm.name"></Input>
      </Form-item>
      <Form-item label="用户提问"><br>
      <div v-for="(item, index) in askList" :key="index" style="margin-bottom: 10px;" class="ask-box">
        <div>
          <div class="input-box">
            <input 
            @select="selectText(index)" 
            class="my-input" 
            type="text" 
            placeholder="添加用户提问语料" 
            v-model="item.text"/>
            <div @click="deleteAskList(index)">
              <Icon v-show="index!==0" type="trash-a" class="trash-icon"></Icon>
            </div>          
          </div>    
        </div>        
          <Select v-if="hasEntities&&index === textIndex" @on-change="changeSelect">
            <Option v-for="item in entitiesList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>

        <div v-if="hasSelected&&index === textIndex">
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
                <input type="text" placeholder="选择类型" v-model="item.dictName" @click="hasEntities=true">
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
        <Select v-if="hasEntities" @on-change="changeSelect" :key="index">
            <Option v-for="item in entitiesList" :value="item.id" :key="item.id">{{item.name}}</Option>
        </Select>
        <a href="" @click.prevent="addActionList">添加一行</a>
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
      intentId: '',
      name: '', // 搜素场景关键词
      createIntentsForm: { // 创建场景 表单
        name: '', // 场景名称
        text: '' // 提问语料
      },
      ruleIntentsForm: { // 场景表单的验证规则
        name: [
          { required: true, message: '场景名称不能为空', trigger: 'blur' }
        ]
      },
      hasIntents: false, // 是否有场景
      intentList: [], // 场景列表
      entitiesList: [], // 词库列表
      hasEntities: false, // 是否有词库
      hasSelected: false, // 已经选取有效字段
      showSlect: false,
      showActionList: true,
      askList: [],
      textIndex: '', // 选中的text index
      editSelect: false, // 是否为编辑下拉列表值
      slotList: [],
      actionName: '', // 动作名称
      selector: '' // 鼠标划取的词
    }
  },
  computed: {
    getAppId () {
      // return this.$store.getters.getAppId
      this.appId = this.$store.state.appId
      if (!this.appId) {
        this.appId = this.$store.getters.getAppId
      }
      return this.appId
    },
    getIntentId () {
      return this.$store.getters.getIntentId
    }
  },
  methods: {
    // 编辑某个场景
    gotoEdit (index) {
      // this.$router.push('/editIntents')
      this.$store.dispatch('setIntentId', this.intentList[index].id)
      this.$router.push({ name: 'EditIntents', params: { appId: this.getAppId } })
      this.getIntentsDetail()
    },
    saveCreate (name) {
      this.$refs[name].validate((valid) => {
        if (!valid) {
          this.$Message.error('提交失败')
        } else {
          this.$axios.post('intent/add', this.getSaveData()).then(response => {
            console.log(response)
            // if (response.data === null) {
            this.$Message.success('提交成功')
            this.getIntentsList()
          })
        }
      })
    },
    // 获取保存数据
    getSaveData () {
      let data
      data = {
        appId: this.getAppId,
        actionName: this.actionName,
        name: this.createIntentsForm.name,
        rank: ''
      }
      this._.each(this.slotList, (ele, index) => {
        data[`slotList[${index}].defValue`] = ele.defValue
        data[`slotList[${index}].dictName`] = ele.dictName
        data[`slotList[${index}].flag`] = ele.flag
        data[`slotList[${index}].message`] = ele.message
        data[`slotList[${index}].typeName`] = ele.typeName
      })
      // // asklist
      this._.each(this.askList, (ele, index) => {
        data[`askList[${index}].text`] = ele.text
        data[`askList[${index}].intent`] = this.createIntentsForm.name
        this._.each(ele.entitys, (ele2, index2) => {
          data[`askList[${index}].entitys[${index2}].value`] = ele.entitys[index2].value
          data[`askList[${index}].entitys[${index2}].entity`] = ele.entitys[index2].entity
        })
      })
      return data
    },
    // 初始化intent详情
    initIntentDetail () {
      this.askList.push({ text: this.askList.text })
      this.slotList.push({ typeName: this.slotList.typeName, dictName: this.slotList.dictName })
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
    // 鼠标选中 表单中的文字
    selectText (index) {
      // console.log('selectText', index)
      this.textIndex = index
      let selector = window.getSelection().toString()
      if (this.entitiesList.length > 0) {
        this.hasEntities = true
        if (selector) {
          this.selector = selector
        }
      }
    },
    // 选中的Option变化时触发
    changeSelect (entityId) {
      this.hasEntities = false
      let index, entity, type, value
      for (index = 0; index < this.entitiesList.length; index++) {
        if (this.entitiesList[index].id === entityId) {
          this.hasSelected = true
          this.showActionList = true
          entity = this.entitiesList[index].pinyin
          type = this.entitiesList[index].name
          value = this.selector
        } else {
          // console.log('no index')
        }
      }

      this.askList[this.textIndex].entitys.push({ entity: entity, type: type, value: value })
      this.slotList.push({ typeName: entity, dictName: type })
      // console.log(this.askList)
    },
    deleteAskList (index) {
      // console.log('askList', index)
      this.askList.splice(index, 1)
    },
    // 删除一行
    deleteEntityLine (index) {
      // console.log(index)
      this.askList[this.textIndex].entitys.splice(index, 1)
      this.slotList.splice(index, 1)
      if (this.askList[this.textIndex].entitys.length < 1) {
        this.hasSelected = false
      }
      if (this.slotList.length < 1) {
        this.hasSelected = false
      }
    },
    delSlotList (index) {
      this.slotList.splice(index, 1)
      // if (this.slotList.length < 1) {
      //   this.showActionList = false
      // }
    },
    // 添加一行 用户提问
    addAskList () {
      this.askList.push({ text: this.askList.text, entitys: [] })
      // this.askList[0].entitys.push({ entity: this.askList.entitys.entity, type: this.askList.entitys.type, value: this.askList.entitys.value })
    },
    // 添加一行 动作列表
    addActionList () {
      // console.log('addActionList')
      this.showActionList = true
      this.slotList.push({ typeName: this.slotList.typeName, dictName: this.slotList.dictName })
    },
    // 编辑下拉框的值
    toEditSelect (entityId, tbindex) {
      this.editSelect = true
      this.hasEntities = true
      this.changeSelect(entityId, tbindex)
    }
  },
  created () {
    // // console.log(this.getAppId)
    this.getIntentsList()
    this.initIntentDetail()
    this.getEntitiesList()
  },
  watch: {
    'slotList': function (oldVal, newVal) {
      if (!newVal) {
        this.slotList.push({ typeName: this.slotList.typeName, dictName: this.slotList.dictName })
      }
    }
  }
}
</script>

<style lang="less">
.ask-box {
  // 删除按钮
  .input-box {
    position: relative;

    &:hover .trash-icon {
      display: block;
    }
    .trash-icon {
      position: absolute;
      font-size: 14px;
      right: 10px;
      top: 40%;
      display: none;
      cursor: pointer;
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
    width: 25%;
    border: 1px solid #ccc;
    padding: 10px;
  }
  input {
    outline: none;
    border: none;
    padding: 10px 15px;
  }
}
</style>
