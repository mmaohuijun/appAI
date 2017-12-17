<template>
  <div class="layout">
    <Menu mode="horizontal" theme="dark" active-name="1" @on-select="selectMenu">
            <div class="layout-logo"></div>
            <div class="layout-nav">
              <MenuItem name="1">
                <Dropdown @on-click="selectApp">
                  <a>
                    跑鞋示例
                    <Icon type="arrow-down-b"></Icon>
                    <Icon type="plus"></Icon> 
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="createApp">
                      创建应用
                      <Icon type="plus-circled" class="drop-down-list"></Icon>
                    </DropdownItem>
                    <DropdownItem name="showApp">
                      查看所有应用
                      <Icon type="navicon" class="drop-down-list"></Icon>
                    </DropdownItem>
                    <DropdownItem name="showAppDetail" divided>
                      跑鞋示例
                      <Icon type="gear-a" class="drop-down-list"></Icon>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </MenuItem>
              <MenuItem name="2">
                场景
              </MenuItem>  
              <MenuItem name="3">
                词库
              </MenuItem>
            </div>
        </Menu>
  </div>
</template>

<script>
export default {
  name: 'layout',
  methods: {
    // 下拉菜单选择
    selectApp (name) {
      if (name === 'createApp') {
        this.$router.push('/createApp')
      } else if (name === 'showApp') {
        this.$router.push('/apps')
      } else {
        this.$router.push('/intents')
      }   
    },
    // 场景 词库 菜单
    selectMenu (name) {
      if (name === '2') {
        this.$router.push('/intents')
      } else if (name === '3') {
        this.$router.push('/entities')
      }
    }

  }
}
</script>

<style lang="">
  .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
    }
    .layout-logo {
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }
    .layout-nav {
        width: 420px;
        margin: 0 auto;
    }
    .drop-down-list { 
      float: right;
      padding-left: 150px;
      margin-top:-15px;
    }
</style>
