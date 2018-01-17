<template>
  <div>
    <p></p>
    <button @click="test">权限</button>
  </div>
</template>
<script>
export default {
  name: 'Auth',
  data () {
    return {
      name: '',
      date: '',
      pageSize: 10,
      pageNo: 1
    }
  },
  methods: {
    test () {
      console.log('test')
      let data = {
        name: '',
        date: '',
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      console.log('data', data)
      this.$axios.post('user/list', data).then(response => {
        console.log(response)
      })
    }
  },
  created () {
    // this.test()
  }
}
</script>
