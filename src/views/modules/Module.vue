<template>
  <div>
    所有应用
    <Select style="width:500px;">
      <Option v-for="item in appList" :value="item.value" :key="item.id">{{item.value}}</Option>
    </Select>
    <Button>训练</Button>
    <div>
      <Table :columns="column" :data="data"></Table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Module',
  data () {
    return {
      appList: [],
      column: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }
      ],
      data: [
        {
          name: 'aaa',
          age: 18,
          address
        }
      ]
    }
  }
}
</script>

<style>

</style>

