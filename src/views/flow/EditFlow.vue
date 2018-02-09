<template>
  <div class="content-body">
    <Form :model="flowForm">
      <Form-item label="流程名称">
        <Input v-model="flowForm.name"></Input>
      </Form-item>
      <Form-item label="描述">
        <Input v-model="flowForm.describe"></Input>
      </Form-item>
      <Form-item label="问题">
        <Input v-model="flowForm.ask"></Input>
      </Form-item>
      <Form-item label="肯定动作">
        <Input v-model="flowForm.yAction"></Input>
      </Form-item>
      <Form-item label="否定动作">
        <Input v-model="flowForm.nAction"></Input>
      </Form-item>
      <Form-item>
        <Button @click="saveFlow" type="primary">确定</Button>
      </Form-item>
    </Form>
    <div class="intent-wrapper">
      <div>
        <h3>所有场景</h3>
        <ul>
          <li 
            v-for="(item, index) in intentList"
            :key="index"
            @click="addIntent(index)"
            class="intent-card">
            {{ item.itName }}
          </li>
        </ul>
      </div>
      <div>
        <h3>选中场景</h3>
        <ul>
          <li
            class="intent-card"
            v-for="(item, index) in processBlockList"
            :key="index"
            @click="cancleIntent(index)"
          >{{ item.itName }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'EditFlow',
  data () {
    return {
      flowForm: {
        name: '',
        describe: '',
        ask: '',
        yAction: '',
        nAction: ''
      },
      intentList: [],
      processBlockList: [] // 选中场景
    }
  },
  computed: {
    ...mapGetters([
      'flowId'
    ])
  },
  methods: {
    getDetail () {
      if (this.flowId) {
        this.$axios.post('process/detail', { id: this.flowId }).then(response => {
          if (response.data) {
            this.flowForm = response.data
            this.processBlockList = response.data.processBlockList
          }
        })
      } else {
        this.flowForm = {}
      }
    },
    // 获取所有场景
    getIntentList () {
      this.$axios.post('process/getAllIntents').then(response => {
        if (response.data) {
          this.intentList = response.data
        }
      })
    },
    // 添加场景
    addIntent (index) {
      // 对象 浅拷贝
      let obj = Object.assign({}, this.intentList[index])
      console.log(JSON.stringify(this.processBlockList).indexOf(JSON.stringify(obj)))
      if (JSON.stringify(this.processBlockList).indexOf(JSON.stringify(obj) != -1)) {
        this.processBlockList.push(obj)
      }
    },
    // 取消场景
    cancleIntent (index) {
      this.processBlockList.splice(index, 1)
    },
    // 保存
    saveFlow () {
      let data = {
        id: this.flowForm.id || '',
        name: this.flowForm.name,
        describe: this.flowForm.describe,
        ask: this.flowForm.ask,
        yAction: this.flowForm.yAction,
        nAction: this.flowForm.nAction
      }
      this.processBlockList.forEach((val, index) => {
        data[`processBlockList[${index}].aid`] = this.processBlockList[index].aid
        data[`processBlockList[${index}].itName`] = this.processBlockList[index].itName
        data[`processBlockList[${index}].sort`] = this.processBlockList[index].sort
      })
      this.$axios.post('process/save', data).then(response => {
        if (response.data === null) {
          this.$Message.success('提交成功！')
          this.getDetail()
        } else {
          this.$Message.error('提交失败')
        }
      })
    }
  },
  watch: {
    'processBlockList' (newV, oldV) {
      console.log(this.processBlockList)
      for (let i = 0; i < this.processBlockList.length; i++) {
        this.processBlockList[i].sort = i+1
      }
    }
  },
  created () {
    this.$store.dispatch('setFlowId')
    this.getIntentList()
    this.getDetail()
  }
}
</script>
<style lang="less">
  .intent-wrapper {
    display: flex;
    justify-content: space-between;

    && >div {
      width: 40%;
      border: 1px solid #ccc;
      padding: 10px;

      ul {
        display: flex;
        flex-wrap: wrap;
        
        .intent-card {
          border: 1px solid rgb(23, 86, 204);
          padding: 3px 8px;
          margin: 5px 0 0 5px;
          cursor: pointer;

          &:hover {
            background: rgb(23, 86, 204);
            color: #fff;
            transition: .2s linear all;
          }
        }
      }
    }
  }
</style>


