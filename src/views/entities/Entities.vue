<template>
  <div>
    <div class="app-header">      
      <h1>词库</h1>
    </div>
    <div v-if="ifEntities">
      <Input placeholder="搜索" icon="search"></Input>
      <ul class="list-group">
        <li>hello</li>
        <li>跑鞋示例</li>
      </ul>
      <Button type="primary" size="large">创建词库</Button>
    </div>
    <div class="no-entities" v-else>
      <p>还没有词库，先<a href="" @click.prevent="gotoCreateEntities">创建第一个</a>词库</p>
      <p>详细了解词库，<a href="">查看文档</a></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Entities',
  data () {
    return {
      ifEntities: false // 是否存在词库
    }
  },
  methods: {
    gotoCreateEntities () {
      this.$router.push({ name: 'CreateEntities' })
    }
  }
}
</script>

<style lang="less">
  .app-header {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .list-group {
    margin-top: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    li {
      border: 1px solid #ccc;
      border-bottom: none;
      font-size: 14px;
      padding:8px 10px;
    }
    li:hover {
      cursor: pointer;
    }
  }
  .no-entities {
      text-align: center;
      font-size: 16px;
      margin-top: 50px;
    }
</style>

