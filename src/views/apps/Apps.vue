<template>
  <div>
    <div class="app-header">      
      <h1>
        <Icon type="cloud"></Icon>
        所有应用
      </h1>
      <Button type="primary" style="float: right;">创建应用</Button>
    </div>
    <Input placeholder="搜索" icon="search"></Input>
    <ul>
      <li>跑鞋示例</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  .app-header {
    float: left;
    margin-top: 20px;
    margin-bottom: 30px;
    h1 {
      float: left
    }
  }
</style>

