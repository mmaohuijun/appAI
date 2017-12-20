<template>
  <div>
    <Form :model="createAppForm" ref="createAppForm" :rules="ruleAppForm">
      <Form-item label="应用名称" prop="appName">
        <Input class="line-input" v-model="createAppForm.appName"></Input>
      </Form-item>
      <Form-item label="是否公开">
        <Radio-group>
          <Radio name="公开">公开</Radio>
          <Radio name="保密">保密</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="应用描述">
        <Input></Input>
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
        <Select>
          <Option value="searchEngin" label="搜索引擎"></Option>
          <Option value="centerLib" label="知识中心库"></Option>
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
            <Button size="large">删除应用</Button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditApp',
  data () {
    return {
      createAppForm: {
        appName: ''
      },
      ruleAppForm: {
        appName: [
          { required: true, message: '应用名称不得为空', trigger: 'blur' }
        ]
      },
      nextReplyId: 0,
      defaultReply: '',
      defaultReplyList: []
    }
  },
  computed: {
    getAppId () {
      return this.$store.state.APP_ID
    }
  },
  methods: {
    // 获取应用详情
    getAppDetail () {
      console.log('appid', this.getAppId)
      this.$axios.post('app/detail', { id: this.getAppId }).then(response => {
        if (response.data) {
          console.log(response.data)
        }
      })
    },
    saveCreate (name) {
      console.log('saveCreate')
      this.$refs[name].validate((valid) => {
        if (!valid) {
          this.$Message.error('提交失败')
        } else {
          this.$Message.success('提交成功')
          this.$router.push('/intents')
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


