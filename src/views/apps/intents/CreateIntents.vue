<template>
  <div class="content-body">
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
    <div class="list-header">场景列表</div>
    <div style="display: flex; position: relative;">
      <aside class="intent-aside">
        <ul v-if="hasIntents">
          <li 
            v-for="(item, index) in intentList" 
            :key="index"
            @click="gotoEdit(index)">
            <a :class="{intentList: sIndex===index}">{{item.name}}</a>
          </li>
        </ul>
        <p v-else class="empty-list">当前场景列表为空！</p>
      </aside>
      <Form class="form" ref="createIntentsForm" :model="createIntentsForm" :rules="ruleIntentsForm">
        <Form-item label="场景名称" prop="name">
          <Input v-model="createIntentsForm.name"></Input>
        </Form-item>
        <div class="state-box">
          <div>状态</div>
          <div class="state-type">
            <div class="input-type">
              <span>输入</span>
              <div>
                <ul class="list-card">
                  <li v-for="(item, index) in selectInputList" :key="index">
                    {{ item.name }}
                    <span @click="delInput(index)">x</span>
                    </li>
                </ul>
                <Select @on-change="changeInput" style="width: 300px;">
                  <Option
                  v-for="item in inputList"
                  :value="item.id" 
                  :label="item.name" :key="item.id"></Option>
                </Select>
              </div>
            </div>
            <div class="output-type">
              <span>输出</span>
              <div>
                <ul class="list-card">
                  <li v-for="(item, index) in output" :key="index" @click="getOutput(index)">
                    {{ item.name }}    
                    <span @click.stop="delOutput(index)">x</span>          
                  </li>
                </ul>
                <input type="text" placeholder="添加输出状态..." @focus="addOutput">
              </div>
              <Modal v-model="showOutput" @on-ok="saveOutput">
                <Form-item label="名称">
                  <Input v-model="out.name"></Input>
                </Form-item>
                <Form-item label="问题">
                  <Input v-model="out.ask"></Input>
                </Form-item>
                <Form-item label="生命周期">
                  <Input v-model="out.lifecycle"></Input>
                </Form-item>
                <Form-item label="肯定回答" class="sure-reply">
                  <Input placeholder="提示语" v-model="out.y_hint"></Input>
                  <Select @on-change="chooseSure" v-model="out.y_action">
                    <Option v-for="item in intentList" :value="item.name" :key="item.id"></Option>
                  </Select>
                </Form-item>
                <Form-item label="否定回答" class="refuse-reply">
                  <Input placeholder="输出提示语" v-model="out.on_hint"></Input>
                  <Select @on-change="chooseNo" v-model="out.on_action">
                    <Option v-for="item in intentList" :value="item.name" :key="item.id"></Option>
                  </Select>
                  <Input placeholder="输入提示语" v-model="out.in_hint"></Input>
                  <Select @on-change="chooseNo2" v-model="out.in_action">
                    <Option v-for="item in intentList" :value="item.name" :key="item.id"></Option>
                  </Select>
                </Form-item>
              </Modal> 
            </div>
          </div>
        </div>

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
          <input type="text" class="my-input" placeholder="请输入动作名称" v-model="actionName" @dblclick="editAcModal">
        </Form-item>
        <Modal
          :closable="false"
          v-model="showAcModal">
            <Form :model="acForm">
              <Form-item label="动作">
                <Input v-model="acForm.actionName"></Input>
              </Form-item>
              <Form-item label="微服务">
                <Select v-model="acForm.micId">
                  <Option v-for="item in microList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </Form-item>
              <Form-item label="判断类型">
                <Radio-group v-model="acForm.type">
                  <Radio label="1">按内容</Radio>
                  <Radio label="0">按结果</Radio>
                </Radio-group>
              </Form-item>
              <Form-item label="内容" v-if="acForm.type==1">
                <div v-for="(item, index) in acForm.cJson" :key="index" style="margin-bottom: 10px;" class="ask-box">
                  <div>
                    <div class="input-box">
                      <input 
                      class="my-input" 
                      type="text" 
                      placeholder="内容语料" 
                      v-model="item.message"/>
                      <input 
                      class="my-input" 
                      type="text" 
                      placeholder="执行动作" 
                      v-model="item.action"/>
                      <div @click="deleteAcService(index)">
                        <Icon v-show="index!==0" type="trash-a" class="trash-icon"></Icon>
                      </div>          
                    </div>    
                  </div>       
                </div>
                <a href="" @click.prevent="addAcService">添加一行</a> 
              </Form-item>
              <Form-item label="执行动作" v-else>
                <Input placeholder="有结果" v-model="acForm.yResult"></Input>
                <Input placeholder="无结果" v-model="acForm.nResult"></Input>
              </Form-item>
            </Form>
        </Modal>
        <Form-item style="margin-bottom:0;">
          <table class="action-tbl" v-if="showActionList">
            <thead>
              <tr>
                <td>是否必须</td>
                <td>参数名称</td>
                <td>类型</td>
                <td>取值</td>
                <td>提示语</td>
                <td>操作</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in slotList" :key="index">
                <td>
                  <div class="chkbox" @click="selectChk(index)" :class="{ checked:item.flag }">{{ item.flag }}</div>
                </td>
                <td>
                  <input type="text" placeholder="添加参数名称..." v-model="item.typeName">
                </td>
                <td @click="editActionList(index)">
                  <span>{{item.dictName || '请选择类型...'}}</span>
                </td>
                <td>{{'${ ' + item.typeName + '}'}}</td>
                  <!-- <input type="text" disabled v-model=" '${ ' + item.typeName + '}'"> -->
                <!-- </td> -->
                <td>
                  <input type="text" placeholder="编辑提示语" v-model="item.message" v-if="item.flag">
                  <span class="span-message" v-else>{{ item.message }}</span>
                </td>
                <td>
                  <button @click.prevent="delSlotList(index)" class="del-btn">删除</button>
                </td>
              </tr>         
            </tbody>
          </table>
          <Select v-if="hasEntities" @on-change="onSelectAction" :key="index">
              <Option v-for="item in entitiesList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
          <a href="" @click.prevent="addActionList">添加一行</a>
        </Form-item>
        <div class="validate">
          <div>后置检查</div>
            <div>
              <ul class="list-card">
                  <li v-for="(item, index) in checkList" :key="index">
                    {{ item.name }}    
                    <span @click.stop="delVali(index)">x</span>          
                  </li>
                </ul>
              <Select @on-change="changeCheck" style="width: 300px;">
                <Option
                v-for="item in inputList" 
                :value="item.id" 
                :label="item.name" :key="item.id"></Option>
              </Select>
            </div>
        </div>

        <Form-item>
          <Button type="primary" size="large" @click="saveCreate('createIntentsForm')">保存</Button>
        </Form-item>
      </Form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateIntents',
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
      index: '',
      input: '',
      check: '',
      inputList: [],
      checkList: [],
      out: {}, // 某一项输出对象
      output: [
        // {
        //   name: '',
        //   ask: '',
        //   lifecycle: ''
        // }
      ],
      showOutput: false,
      selectInputList: [],
      outIndex: '', // 选择输出项
      ifOutputDetail: false,
      editI: '', // 正在编辑第几项 输出
      showAcModal: false,
      acForm: {
        actionName: '',
        micId: '',
        type: '',
        nResult: '',
        yResult: '',
        cJson: [
          {
            message: '',
            action: ''
          }
        ]
      },
      microList: [],
      sIndex: '' // 场景列表被选中index
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
      // let selectIntent = this.intentList[index].id
      this.$store.dispatch('setIntentId', this.intentList[index].id)
      this.$router.push({ name: 'EditIntents', params: { appId: this.getAppId } })
    },
    saveCreate (name) {
      this.$refs[name].validate((valid) => {
        if (!valid) {
          this.$Message.error('提交失败')
        } else {
          this.$axios.post('intent/add', this.getSaveData()).then(response => {
            if (response.data === null) {
              this.$Message.success('提交成功')
              this.getIntentsList()
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
        id: ''
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
      this._.each(this.output, (ele, index) => {
        data[`output[${index}].id`] = this.output[index].id || ''
        data[`output[${index}].name`] = this.output[index].name
        data[`output[${index}].ask`] = this.output[index].ask
        data[`output[${index}].lifecycle`] = this.output[index].lifecycle
        data[`output[${index}].y_hint`] = this.output[index].y_hint
        data[`output[${index}].y_action`] = this.output[index].y_action
        data[`output[${index}].on_hint`] = this.output[index].on_hint
        data[`output[${index}].on_action`] = this.output[index].on_action
        data[`output[${index}].in_hint`] = this.output[index].in_hint
        data[`output[${index}].in_action`] = this.output[index].in_action
      })
      data[`actService.id`] = this.acForm.id || ''
      data[`actService.actionName`] = this.acForm.actionName
      data[`actService.micId`] = this.acForm.micId
      data[`actService.type`] = this.acForm.type
      data[`actService.nResult`] = this.acForm.nResult
      data[`actService.yResult`] = this.acForm.yResult
      this._.each(this.acForm.cJson, (ele, index) => {
        data[`actService[${index}].message`] = this.acForm.cJson[index].message
        data[`actService[${index}].action`] = this.acForm.cJson[index].action
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
          this.inputList = response.data.outputList
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
      this.selector = ''
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
      this.hasEntities = false
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
    },
    // 获取输出详情
    getOutput (index) {
      this.editI = index
      this.ifOutputDetail = true
      this.showOutput = true
      this.out.ask = this.output[index].ask
      this.out.name = this.output[index].name
      this.out.lifecycle = this.output[index].lifecycle
    },
    // 添加输出状态
    saveOutput () {
      if (!this.ifOutputDetail) {
        this.output.push({ name: this.out.name, ask: this.out.ask, lifecycle: this.out.lifecycle })
      } else {
        this.output[this.editI].name = this.out.name
        this.output[this.editI].ask = this.out.ask
        this.output[this.editI].lifecycle = this.out.lifecycle
      }
    },
    addOutput () {
      this.showOutput = true
      this.out.name = ''
      this.out.ask = ''
      this.out.lifecycle = ''
    },
    // 选择某项 输入
    changeInput (id) {
      for (let input of this.inputList) {
        if (input.id === id) {
          this.selectInputList.push({ id: id, name: input.name })
        }
      }
    },
    changeCheck (id) {
      for (let input of this.inputList) {
        if (input.id === id) {
          this.checkList.push({ id: id, name: input.name })
        }
      }
    },
    delInput (i) {
      this.selectInputList.splice(i, 1)
    },
    delOutput (i) {
      this.output.splice(i, 1)
    },
    delVali (i) {
      this.checkList.splice(i, 1)
    },
    // 输出模态框 肯定回答的下拉框选择
    chooseSure (value) {
      this.out.yAction = value
    },
    chooseNo (value) {
      this.out.onAction = value
    },
    chooseNo2 (value) {
      this.out.inAction = value
    },
    selectChk (index) {
      this.slotList[index].flag = !this.slotList[index].flag
      console.log('selectChk', index, this.slotList[index].flag)
      if (!this.slotList[index].flag) {
        this.slotList[index].message = ''
      }
    },
    editAcModal () {
      this.showAcModal = true
    },
    // 获取微服务下拉框 列表
    getMicroList () {
      let data = {
        name: '',
        date: '',
        pageSize: 10,
        pageNo: 1
      }
      this.$axios.post('mic_service/list', data).then(response => {
        if (response.data) {
          this.microList = response.data.mServiceList
        }
      })
    },
    // 动作弹框 按内容判断 添加一行
    addAcService () {
      this.acForm.cJson.push({ action: this.acForm.cJson.action, message: this.acForm.cJson.message })
    },
    // 删除一行
    deleteAcService (index) {
      this.acForm.cJson.splice(index, 1)
    }
  },
  created () {
    this.$store.dispatch('getAppIdFromStorage')
    this.getIntentsList()
    this.getEntitiesList()
  },
  watch: {
    'name' (newV, oldV) {
      this.getIntentsList()
    },
    'selector' (newV, oldV) {
      console.log(newV, oldV)
      if (!newV) {
        this.hasEntities = false
      }
    },
    'showOutput' (newV, oldV) {
      if (!newV) {
        this.ifOutputDetail = false
      }
    }
  }
}
</script>

<style lang="less" scope>
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
  border: 1px solid #0278cc;
  border-collapse: collapse;
  width: 100%;
  thead {
    text-align: center;
    background: #0278cc;
    color:#fff;
  }
  td {
    width: 15%;
    border-bottom: 1px solid #0278cc;
    padding: 5px 0;
    text-align: center;
    
    div.chkbox {
      display: inline-block;
      width: 15px;
      height: 15px;
      // background: #ccc;
      border: 1px solid #0278cc;
    }
    div.checked {
      background: #0278cc;
    }
  }
  input, .span-message {
    width: 116px;
    outline: none;
    border: none;
    padding: 10px 15px;
  }
}
// 删除按钮
.del-btn {
  outline: none;
  border: none;
  padding: 1px 15px;
  background: #0278cc;
  color: #fff;
  border-radius: 2px;
  
  &:hover {
    cursor: pointer;
    background: #0568af;
  }
}
  .my-input {
  outline: none;
  border: 1px solid #ccc;
  width: 100%;
  padding: 5px;
  margin-bottom: 1px;
}
// 状态
.state-box {
  .state-type {
    .input-type, .output-type{
      margin-top: 5px;
      display: flex;
      span {
        font-style: italic;
        margin-right: 5px;
      }
      & > div {
        margin-left: 5px;
      }
      ul.list-card {
        float: left;
        li {
          float: left;
          border: 1px solid #0278cc;
          background: #0278cc;
          color: #fff;
          padding: 5px 10px;
          cursor: pointer;
          margin: 0px 5px 5px 5px;
          &:hover {
            background: #0568af;
            border: 1px solid #0278cc;
            color: #fff;
          }
        }
      }
      input {
        border: none;
        outline: none;
        margin-top: 5px;
        padding-bottom: 8px;       
      }
    }
    .output-type ul li { border: 1px solid green; }
  }
}
.validate {
  ul.list-card {
    float: left;
    li {
      float: left;
      border: 1px solid #0278cc;
      background: #0278cc;
      color: #fff;
      padding: 5px 10px;
      cursor: pointer;
      margin: 0px 5px 5px 5px;
      &:hover {
        background: #0568af;
        border: 1px solid #0278cc;
        color: #fff;
      }
    }
  }  
}
// 肯定回答
.sure-reply, .refuse-reply {
  .ivu-form-item-content {
    display: flex;
    .ivu-input-wrapper {
      margin-left: 10px;
    }
  }
}
.intent-aside {
  left: 0px;
  top: 0px;
  bottom: -40px;
}
// 场景列表 选中变色
aside .intentList{
  background: #0278cc;
  color: #fff;
}
.form .ivu-form-item-label, .title {
  font-size: 18px;
}
</style>
