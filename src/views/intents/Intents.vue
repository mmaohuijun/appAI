<template>
  <div>
    <div class="app-header">      
      <h1>场景</h1>
    </div>
    <div v-if="ifIntents">
      <Input placeholder="搜索" icon="search"></Input>
      <ul class="list-group">
        <li>hello</li>
        <li>跑鞋示例</li>
      </ul>
      <Button type="primary" size="large">创建场景</Button>
    </div> 
    <div class="no-intents" v-else>
      <p>还没有场景，先<a href="" @click.prevent="gotoCreateIntents">创建第一个</a>场景</p>
      <p>详细了解场景，<a href="">查看文档</a></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Intents',
  data () {
    return {
      ifIntents: false // 是否存在场景
    }
  },
  methods: {
    gotoCreateIntents () {
      this.$router.push('/createIntents')
    }
  }
}
</script>

<style lang="less">
  .app-header {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 100%;
    height: 50px;
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
  .no-intents {
    text-align: center;
    font-size: 16px;
    margin-top: 50px;
  }
</style>

