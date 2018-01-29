<template>
  <div class="content-body">
    <div class="content-body-header">
      <div class="">
        <span style="padding-right: 15px;">时间</span>
        <DatePicker 
          type="date" 
          @on-change="dateChange"
          placeholder="Select date" 
          style="width: 200px; margin-right: 50px;">
        </DatePicker>
        <Input 
          @on-click="getIntentsList"
          v-model="name"
          icon="search" 
          placeholder="应用名称" 
          style="width: 200px">
        </Input>
        <Button 
          @click="gotoCreateIntents"
          type="primary" 
          style="float: right;margin-right: 15px;">
        添加
        </Button>
      </div>
    </div>
    <div class="breadList">
      <span>{{ this.getAppName }}</span>
      <span>></span>
      <span>场景列表</span>
    </div>
      <Table 
        :columns="columnIntent" 
        :data="intentList">
      </Table>
      <Page 
        :total="total" 
        :current="pageNo" 
        :page-size="pageSize" 
        show-elevator 
        @on-change="pageChange"
        style="padding-top: 30px; text-align: center;">
      </Page>
      <Modal
        v-model="showModal"
        @on-ok="delIntents"
        title="删除场景">
          <p>确定删除场景吗</p>
          <p>删除后无法恢复</p>
        </Modal>
 
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Intents',
  data () {
    return {
      name: '', // 场景列表 搜索关键词
      appId: '', // 应用id
      ifIntents: 2, // 是否存在场景
      intentList: [],
      showModal: false, // 显示删除 模态框
      delId: '', // 删除场景id
      columnIntent: [
        {
          title: '场景名称',
          key: 'name'
        },
        {
          title: '修改时间',
          key: 'updateDate'
        },
        {
          title: '创建时间',
          key: 'createDate'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const that = this
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  icon: 'edit',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  color: '#999',
                  fontSize: '22px'
                },
                on: {
                  click () {
                    console.log(params)
                    that.gotoEditIntents(params.row)
                  }
                }
              }),
              h('Button', {
                props: {
                  type: 'text',
                  icon: 'trash-a',
                  size: 'small'
                },
                style: {
                  color: '#999',
                  fontSize: '22px'
                },
                on: {
                  click () {
                    console.log('delete')
                    that.del(params.row)
                  }
                }
              })
            ])
          }
        }
      ],
      date: '', // 日期
      pageSize: 10, // 每页显示行数
      pageNo: 1, // 显示页数
      total: 0, // 总信息条数
      appName: ''
    }
  },
  computed: {
    ...mapGetters([
      'getAppId',
      'getAppName'
    ])
    // getAppId () {
    //   this.appId = this.$store.state.apps.appId
    //   return this.appId
    // },
    // getAppName () {
    //   this.appName = this.$store.state.apps.appName
    //   return this.appName
    // }
  },
  methods: {
    gotoCreateIntents () {
      this.$router.push({ name: 'CreateIntents' })
    },
    gotoEditIntents (params) {
      console.log(params)
      let intentId = params.id
      // console.log(this.intentList[index].id)
      this.$store.dispatch('setIntentId', intentId)
      console.log('appId', this.appId)
      this.$router.push({ name: 'EditIntents', params: { appId: this.getAppId } })
    },
    // 获取场景列表
    getIntentsList () {
      let data = {
        appId: this.getAppId,
        name: this.name,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        date: this.date
      }
      this.$axios.post('intent/list', data).then(response => {
        // // console.log(response.data.list.length

        if (response.data.list.length > 0) {
          this.intentList = response.data.list
          // this.ifIntents = 0
        } else {
          // this.ifIntents = 1
          this.intentList = []
          // this.$router.push({ name: 'NoIntents', params: { appId: this.appId } })
        }
      })
    },
    // 编辑某个场景
    // 删除某个场景
    del (params) {
      this.showModal = true
      this.delId = params.id
    },
    delIntents () {
      this.$axios.post('intent/del', { appId: this.appId, id: this.delId }).then(response => {
        if (response.data === null) {
          this.$Message.success('提交成功！')
          this.getIntentsList()
        }
      })
    },
    dateChange (date) {
      this.date = date
      this.pageNo = 1
      this.getIntentsList()
    },
    pageChange (pageNo) {
      this.pageNo = pageNo
      this.getIntentsList()
    }
  },
  mounted () {  
    this.$store.dispatch('getAppIdFromStorage')
    console.log(this.$store.dispatch('getAppName'))
    console.log('appId', this.getAppId)
    this.getIntentsList()
    // console.log('appId', this.getAppId)
  },
  // 两个路由渲染同个组件 实例会被复用
  // 组件的生命周期钩子不会再被调用
  // 监控$route对象 对路由参数的变化做出响应
  watch: {
    '$route' (to, from) {
      console.log(to, from)
      this.getIntentsList()
    },
    'ifIntents' (newV, oldV) {
      console.log('newV', newV, 'oldVal', oldV)
    }
  }
}
</script>

<style lang="less">
  .breadList {
    margin-bottom: 15px;
  }
</style>

