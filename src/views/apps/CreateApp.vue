<template>
  <div>
    <Form :model="createAppForm" ref="createAppForm" :rules="ruleAppForm">
      <Form-item label="应用名称" prop="name">
        <Input class="line-input" v-model="createAppForm.name"></Input>
      </Form-item>
      <Form-item label="是否公开">
        <Radio-group v-model="createAppForm.isPrivate">
          <Radio label="0">私密</Radio>
          <Radio label="1">公开</Radio>
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
        <Input placeholder="机器人回复" value="Oh my God！我竟然不知道你想说什么！" icon="trash-a" @on-click="delReply"></Input>
        <Input type="text" placeholder="机器人回复" :index=index v-for="(item,index) in defaultReplyList" :key="item.id" icon="trash-a" @on-click="delReply"></Input>
        <a href="" @click.prevent="addOneReply">添加一行</a>
      </Form-item>
      <Form-item label="知识库选择">
        <Select v-model="createAppForm.storage">
          <Option v-for="item in storageList" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" size="large" @click="saveCreate('createAppForm')">创建</Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'CreateApp',
  data () {
    return {
      createAppForm: {
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
      defaultReplyList: []
    }
  },
  methods: {
    addOneReply () {
      console.log('addOneReply')
      this.nextReplyId ++
      this.defaultReplyList.push({value: this.defaultReply, id: this.nextReplyId})
    },
    delReply () {
      console.log(this.nextReplyId)
      // this.defaultReplyList.splice(index, 1)
    },
    saveCreate (name) {
      console.log('saveCreate')
      this.$refs[name].validate((valid) => {
        if (!valid) {
          this.$Message.error('提交失败')
        } else {
          var data = {
            name: this.createAppForm.name,
            isPrivate: this.createAppForm.isPrivate,
            defReply: this.createAppForm.defReply,
            describe: this.createAppForm.describe,
            storage: this.createAppForm.storage
          }
          console.log('data', data)
          this.$axios.post('app/add', data).then(response => {
            console.log(response)
          })
          this.$Message.success('提交成功')
          this.$router.push({ name: 'Application' })
        }
      })
    }
  }
}
</script>
<style>
  .line-input {
    border: none;
  }
</style>
