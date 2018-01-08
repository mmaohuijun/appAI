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
            @focus="focusInput(index)"
            @blur="blurInput"
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
        <transition name="fade">
          <div v-if="showAsk&&index === textIndex || hasSelected&&index === textIndex ">
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
                  <td>{{ item.type }}</td>
                  <td>{{ item.value }}</td>
                  <td><button @click.prevent="deleteEntityLine(index)" class="del-btn">删除</button></td>
                </tr>
              </tbody>
            </table>         
          </div>  
        </transition>            
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
              <td @click="editActionList(index)">
                <span>{{item.dictName || '请选择类型...'}}</span>
              </td>
              <td>
                <input type="text" v-model=" '${ ' + item.typeName + '}'">
              </td>
              <td>
                <button @click.prevent="delSlotList(index)" class="del-btn">删除</button>
              </td>
              <!-- <td>
                <input type="text" placeholder="编辑提示语" v-model="item.message">
              </td> -->
            </tr>         
          </tbody>
        </table>
        <Select v-if="hasEntities" @on-change="onSelectAction" :key="index">
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
  name: 'EditIntents',
  data () {
    return {
      appId: '', // 应用id
      intentId: '',
      selectIntent: '',
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
      showActionList: true,
      askList: [],
      showAsk: false, // 显示表格
      slotList: [],
      textIndex: '', // 选中的text index
      editSelect: false, // 是否为编辑下拉列表值
      actionName: '', // 动作名称
      selector: '', // 鼠标划取的词
      editActionIndex: '', // 正在编辑第几行 动作列表
      index: ''
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
      // return this.$store.getters.getIntentId
      this.intentId = this.$store.state.intentId
      if (!this.intentId) {
        this.intentId = this.$store.getters.getIntentId
      }
      return this.intentId
    }
  },
  methods: {
    // 编辑某个场景
    gotoEdit (index) {
      let selectIntent = this.intentList[index].id
      this.$store.dispatch('setIntentId', this.intentList[index].id)
      this.$router.push({ name: 'EditIntents', params: { appId: this.getAppId } })
      this.getIntentsDetail(selectIntent)
    },
    saveCreate (name) {
      this.$refs[name].validate((valid) => {
        if (!valid) {
          this.$Message.error('提交失败')
        } else {
          this.$axios.post('intent/add', this.getSaveData()).then(response => {
            if (response.data === null) {
              this.$Message.success('提交成功')
            }
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
        rank: '',
        id: this.getIntentId
      }
      this._.each(this.slotList, (ele, index) => {
        data[`slotList[${index}].id`] = this.slotList[index].id
        data[`slotList[${index}].defValue`] = ele.defValue
        data[`slotList[${index}].dictName`] = ele.dictName
        data[`slotList[${index}].flag`] = ele.flag
        data[`slotList[${index}].message`] = ele.message
        data[`slotList[${index}].typeName`] = ele.typeName
      })
      // // asklist
      this._.each(this.askList, (ele, index) => {
        data[`askList[${index}].id`] = this.askList[index].id
        data[`askList[${index}].text`] = ele.text
        data[`askList[${index}].intent`] = this.createIntentsForm.name
        this._.each(ele.entitys, (ele2, index2) => {
          data[`askList[${index}].entitys[${index2}].value`] = ele.entitys[index2].value
          data[`askList[${index}].entitys[${index2}].entity`] = ele.entitys[index2].entity
        })
      })
      return data
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
    getIntentsDetail (selectIntent) {
      this.intentId = selectIntent
        // if (!this.intnetId) {
        //   this.intentId = this.getIntentId
        // }
      this.$axios.post('intent/detail', { id: this.getIntentId }).then(response => {
        if (response.data) {
          var data = response.data.intent
          this.createIntentsForm.name = data.name
          this.askList = data.askList
          // 由于后台没有返回这个值 三层嵌套啊 坑死 T T
          for (let index = 0; index < this.entitiesList.length; index++) {
            for (let i = 0; i < this.askList.length; i++) {
              for (let j = 0; j < this.askList[i].entitys.length; j++) {
                if (this.askList[i].entitys[j].entity === this.entitiesList[index].pinyin) {
                  this.askList[i].entitys[j].type = this.entitiesList[index].name
                }
              }
            }
          }
          if (this.askList.length < 1) {
            this.askList.push({ text: this.askList.text, entitys: [] })
          }
          this.slotList = data.slotList
          if (this.slotList.length < 1) {
            this.slotList.push({ defValue: this.slotList.defValue, typeName: this.slotList.typeName, dictName: this.slotList.dictName })
          }
          this.actionName = data.actionName
        }
      })
    },
    // 鼠标选中 表单中的文字
    selectText (index) {
      console.log('selectText', index)
      this.textIndex = index
      let selector = window.getSelection().toString()
      if (this.entitiesList.length > 0) {
        this.hasEntities = true
        if (selector) {
          this.selector = selector
        }
      }
      console.log('selectText', selector)
    },
    // 选中的Option变化时触发
    changeSelect (entityId) {
      this.hasEntities = false
      let entity, type, value
      for (let index = 0; index < this.entitiesList.length; index++) {
        if (this.entitiesList[index].id === entityId) {
          // this.hasSelected = true
          // this.showActionList = true
          entity = this.entitiesList[index].pinyin
          type = this.entitiesList[index].name
          value = this.selector
        }
        // this.hasSelected = true
      }
      this.askList[this.textIndex].entitys.push({ entity: entity, type: type, value: value })
      this.hasSelected = true
      console.log('hasSelected', this.hasSelected)
      // console.log(this.askList[this.textIndex])
      if (this.ifAddActionList(entity)) {
        this.slotList.push({ typeName: entity, dictName: type })
      }
    },
    // 判断用户提问中添加的slot 在动作列表中是否已经存在
    // 若已存在 就不重复添加
    ifAddActionList (entity) {
      console.log('ifAddActionList')
      for (let i = 0; i < this.slotList.length; i++) {
        if (this.slotList[i].typeName === entity) {
          return false
        }
      }
      return true
    },
    // 通过entitiesList的 id 获取其他值
    getEntitityType (entityId) {
      for (let index = 0; index < this.entitiesList.length; index++) {
        if (this.entitiesList[index].id === entityId) {
          let type = this.entitiesList[index].name
          console.log(type)
        }
      }
    },
    deleteAskList (index) {
      this.askList.splice(index, 1)
    },
    // 删除一行
    deleteEntityLine (index) {
      this.askList[this.textIndex].entitys.splice(index, 1)
      this.slotList.splice(index, 1)
      if (this.askList[this.textIndex].entitys.length < 1) {
        this.hasSelected = false
      }
      if (this.slotList.length < 1) {
        this.hasSelected = false
      }
    },
    // 添加一行 用户提问
    addAskList () {
      this.askList.push({ text: this.askList.text, entitys: [] })
      // this.askList[0].entitys.push({ entity: this.askList.entitys.entity, type: this.askList.entitys.type, value: this.askList.entitys.value })
    },
    // 输入框得到焦点
    focusInput (i) {
      this.textIndex = i
      if (this.askList[i].entitys) {
        if (this.askList[i].entitys.length > 0) {
          this.showAsk = true
        } else {
          this.showAsk = false
          this.hasSelected = false
        }
      }
    },
    blurInput () {
      this.showAsk = false
    },
    // 选中某一项
    onSelectAction (id) {
      let typeName, dictName
      console.log('onSelectAction', id)
      for (let i = 0; i < this.entitiesList.length; i++) {
        if (id === this.entitiesList[i].id) {
          dictName = this.entitiesList[i].name
          typeName = this.entitiesList[i].pinyin
        }
      }
      if (this.editActionIndex === '') {
        console.log('自定义参数')
        this.slotList.push({ typeName: typeName, dictName: dictName })
      } else {
        console.log('正在编辑')
        this.slotList[this.editActionIndex] = { typeName: typeName, dictName: dictName }
        this.editActionIndex = ''
      }
      this.hasEntities = false
    },
    // 添加动作列表
    addActionList () {
      this.slotList.push({ typeName: this.slotList.typeName, dictName: this.slotList.dictName })
    },
    // 编辑动作列表
    editActionList (index) {
      this.hasEntities = true
      this.editActionIndex = index
    },
    // 删除动作列表
    delSlotList (index) {
      this.slotList.splice(index, 1)
      if (this.slotList.length < 1) {
        this.slotList[0] = { typeName: this.slotList.typeName, dictName: this.slotList.dictName }
      }
    }
  },
  created () {
    this.getIntentsList()
    this.getIntentsDetail()
    this.getEntitiesList()
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
// 删除按钮
.del-btn {
  outline: none;
  border: none;
  padding: 2px 20px;
  
  &:hover {
    cursor: pointer;
  }
}
</style>
