<template>
  <div>
    <Form :model="createAppForm" ref="createAppForm" :rules="ruleAppForm">
      <Form-item label="应用名称" prop="name">
        <Input class="line-input" v-model="createAppForm.name"></Input>
      </Form-item>
      <Form-item label="是否公开">
        <Radio-group v-model="createAppForm.isPrivate">
          <Radio label="0">公开</Radio>
          <Radio label="1">保密</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="应用描述">
        <Input v-model="createAppForm.describe"></Input>
      </Form-item>
      <Form-item label="语言">
        <Select placeholder="中文(简体)" disabled></Select>
      </Form-item>
      <Form-item label="时区">
        <Select placeholder="(GMT + 8:00) Asia/Shanghai" disabled></Select>
      </Form-item>
      <Form-item label="默认回复" prop="defaultReply">
        <Input placeholder="机器人回复" value="Oh my God！我竟然不知道你想说什么！" icon="trash-a" ></Input>
        <!-- <Input type="text" placeholder="机器人回复" :index=index v-for="(item,index) in defaultReplyList" :key="item.id" icon="trash-a" @on-click="delReply"></Input> -->
        <a href="" >添加一行</a>
      </Form-item>
      <Form-item label="知识库选择">
        <Select v-model="createAppForm.storage">
          <Option v-for="item in storageList" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" size="large" @click="saveCreate('createAppForm')">保存</Button>
      </Form-item>
    </Form>
    <div class="del-app">
      <table class="del-app-tbl">
        <tr class="tbl-head">
          <td>删除应用</td>
          <td></td>
        </tr>
        <tr>
          <td>
            <h1>删除应用</h1>
          </td>  
          <td></td>
        </tr>
        <tr>
          <td>
            <p>你确定要删除这个应用吗？删除后无法恢复！</p>
          </td>
          <td>
            <Button size="large" @click="showModal=true">删除应用</Button>
          </td>
        </tr>
      </table>
      <Modal
        v-model="showModal"
        title="删除应用"
        @on-ok="deleteApp">
        <p>确定删除应用吗？</p>
        <p>删除后无法恢复</p>
      </Modal>
    </div>
  </div>
</template>

<script>
import $Storage from '../../api/storage.js'
export default {
  name: 'EditApp',
  data () {
    return {
      createAppForm: {
        id: 0,
        name: '', // 应用名称 必填
        isPrivate: '', // 是否公开 0/1
        defReply: 'hello', // 默认回复
        describe: '', // 应用描述
        storage: '' // 知识库选择
      },
      storageList: [
        {
          value: '搜索引擎',
          label: '搜索引擎'
        },
        {
          value: '知识中心库',
          label: '知识中心库'
        }
      ],
      ruleAppForm: {
        appName: [
          { required: true, message: '应用名称不得为空', trigger: 'blur' }
        ]
      },
      nextReplyId: 0,
      defaultReply: '',
      defaultReplyList: [],
      showModal: false
    }
  },
  computed: {
    // appId () {
    //   return this.$store.getters.getAppId
    // }
  },
  methods: {
    // 获取应用详情
    getAppDetail () {
      this.appId = $Storage.sessionStorage.getItem('appId')
      this.$axios.post('app/detail', { id: this.appId }).then(response => {
        if (response.data) {
          let data = response.data
          this.createAppForm.id = data.id
          this.createAppForm.name = data.name
          this.createAppForm.isPrivate = data.isPrivate
          this.createAppForm.defReply = data.defReply
          this.createAppForm.describe = data.describe
          this.createAppForm.storage = data.storage
        }
      })
    },
    // 保存修改
    saveCreate (name) {
      console.log('saveCreate')
      this.$refs[name].validate((valid) => {
        if (!valid) {
          this.$Message.error('提交失败')
        } else {
          this.$axios.post('app/add', this.createAppForm).then(response => {
            if (response.data === null) {
              this.$Message.success('提交成功')
              this.$router.push({ name: 'Application' })
            }
          })
        }
      })
    },
    // 删除应用
    deleteApp () {
      this.$axios.post('app/del', { id: this.appId }).then(response => {
        if (response.data === null) {
          this.$router.push({ name: 'Application' })
        }
      })
    }
  },
  created () {
    this.getAppDetail()
  }
}
</script>

<style lang="less">
  .del-app-tbl {
    border-collapse: collapse;
    border: 1px solid #ccc;
    width: 100%;
    // 表头部分
    .tbl-head {
      background: #eee;
      height: 50px;
      font-size: 18px;
    }
    td {
      // border: 1px solid #ccc;
      padding-left: 15px;
      padding: 10px 15px;
    }
  }
</style>


