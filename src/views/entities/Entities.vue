<template>
  <div>
    <div class="app-header">      
      <h1>词库</h1>
    </div>
    <Input placeholder="搜索" icon="search"></Input>
    <ul class="list-group">
      <li>hello</li>
      <li>跑鞋示例</li>
    </ul>
    <Button type="primary" size="large">创建词库</Button>
  </div>
</template>

<script>
export default {
  name: 'Entities'
}
</script>

<style lang="less">
  .app-header {
    float: left;
    margin-top: 20px;
    margin-bottom: 20px;
    h1 {
      float: left
    }
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
</style>

