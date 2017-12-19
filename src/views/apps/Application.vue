<template>
  <div>
    <div class="app-header">      
      <h1>所有应用</h1>
    </div>
    <Input placeholder="搜索" icon="search"></Input>
    <ul class="list-group">
      <li @click="gotoIntents">
        <a>应用1</a>
        <div class="rt">
          <a @click.stop="gotoEditApp">
            <Icon type="gear-a" class="app-icon"></Icon>
          </a>
        </div>
      </li>
      <!-- <li @click="gotoIntents">
        <a>应用2</a>
        <div class="rt">
          <a @click.stop="gotoEditApp">
            <Icon type="gear-a" class="app-icon"></Icon>
          </a>
        </div>
      </li> -->
    </ul>
    <Button type="primary" size="large" @click="gotoCreateApp">创建应用</Button>
  </div>
</template>

<script>
export default {
  name: 'Application',
  methods: {
    gotoIntents () {
      console.log('hello')
      this.$router.push('/intents')
    },
    gotoEditApp () {
      console.log('router')
      this.$router.push('/editApp')
    },
    gotoCreateApp () {
      this.$router.push('/createApp')
    }
  }
}
</script>

<style lang="less">
  .lf {
    float: left
  }
  .rt {
    float: right
  }
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

      a {
        color: #333;
      }

      &:hover {
      cursor: pointer
      }

      &:hover .app-icon {
        display: block;
      }
    }  
  }
  .app-icon {
    position: relative;
    top: 2px;
    display: none;
    font-size: 16px;
    color: #333;
  }
</style>

