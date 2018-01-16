<template>
  <!-- <div>
    <div class="app-header">      
      <h1>所有应用</h1>
    </div>
    <div v-if="ifApps===0">
      <Input placeholder="搜索" icon="search" v-model="name" @on-click="getAppList"></Input>
      <ul class="list-group">
        <li @click="gotoIntents(index)" v-for="(item, index) in this.appList" :key="index">
          <a>{{item.name}}</a>
          <div class="rt">
            <a @click.stop="gotoEditApp(index)">
              <Icon type="gear-a" class="app-icon"></Icon>
            </a>
          </div>
        </li>
      </ul>
      <Button type="primary" size="large" @click="gotoCreateApp">创建应用</Button>
    </div>
    <div v-else-if="ifApps===1" class="no-list">
      <p>还没有词库，先<a href="" @click.prevent="gotoCreateApp">创建第一个</a>应用</p>
      <p>详细了解应用，<a href="">查看文档</a></p>
    </div>
    <div v-else></div>
  </div> -->
  <div class="content-body">
    <div class="content-body-header">
      <div class="">
        <span style="padding-right: 15px;">时间</span>
        <DatePicker 
          type="date" 
          @on-change="dateChange"
          placeholder="Select date" 
          style="width: 200px">
        </DatePicker>
        <Input 
          @on-click="getAppList"
          v-model="name"
          icon="ios-clock-outline" 
          placeholder="应用名称" 
          style="width: 200px">
        </Input>
        <Button 
          @click="gotoCreateApp"
          type="primary" 
          style="float: right;margin-right: 15px;">
        添加
        </Button>
      </div>
    </div>

      <Table 
        @on-row-click="gotoIntents"
        :columns="columnApp" 
        :data="appList">
      </Table>
      <Page 
        :total="total" 
        :current="pageNo" 
        :page-size="pageSize" 
        show-elevator 
        @on-change="pageChange"
        style="padding-top: 30px; text-align: center;">
      </Page>
 
  </div>
</template>

<script>

export default {
  name: 'Application',
  data () {
    return {
      appList: [], // 应用列表
      name: '' || null, // 搜索关键字
      ifApps: 2, // 是否有应用
      columnApp: [
        {
          title: '应用名称',
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
          title: '创建者',
          key: 'createBy'
        },
        {
          title: 'Action',
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
                    that.gotoEditApp(params.index)
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
      total: 0 // 总信息条数
    }
  },
  computed: {
    getAppId () {
      return this.$store.getters.getAppId
    }
  },
  methods: {
    // 跳转到场景
    gotoIntents (params) {
      console.log(params)
      // let appId = params.id
      // let appId = this.appList[index].id
      this.$store.dispatch('setAppId', params.id)
      this.$store.dispatch('setAppName', params.name)
      this.$router.push({ name: 'Intents', params: { appId: params.id } })
    },
    // 跳转到 编辑页面
    gotoEditApp (index) {
      let appId = this.appList[index].id
      this.$store.dispatch('setAppId', appId)
      this.$router.push({ name: 'EditApp', params: { appId: appId } })
    },
    gotoCreateApp () {
      this.$router.push({ name: 'CreateApp' })
    },
    getAppList () {
      let data = {
        name: this.name,
        date: this.date,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      this.$axios.post('app/list', data).then(response => {
        if (response.data) {
          if (response.data.list.length > 0) {
            this.appList = response.data.list
            this.total = response.data.total
            // this.ifApps = 0
          } else {
            this.appList = []
            // this.ifApps = 1
          }
        }
      })
    },
    dateChange (date) {
      this.date = date
      this.pageNo = 1
      this.getAppList()
    },
    pageChange (pageNo) {
      this.pageNo = pageNo
      this.getAppList()
    }
  },
  created () {
    this.getAppList()
  }
}
</script>

<style lang="less">

</style>

