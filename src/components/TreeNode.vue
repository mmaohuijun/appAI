<template>
  <li>
    <div @click="selectDept">{{ deptList.name }}</div>
    <ul v-if="deptList.children" style="margin-left:5px;">
      <tree-node
        @selectDept="selectChild"
        v-for="(item, index) in deptList.children" 
        :key="index"
        :dept-list="item">
      </tree-node>
    </ul>      
  </li>
</template>
<script>
import TreeNode from 'components/TreeNode'
export default {
  name: 'TreeNode',
  data () {
    return {
    }
  },
  props: {
    deptList: Object,
    waitList: Object
  },
  methods: {
    selectDept () {
      this.$emit('selectDept', this.deptList.name)
    },
    selectChild (dept) {
      // console.log('select', ele)
      let data = {
        dept: dept,
        name: '',
        date: '',
        pageSize: 0,
        pageNo: 0
      }
      this.$axios.post('user/list', data).then(response => {
        console.log(response)
        this.waitList = response.data.userList
      })
    }
  },
  components: { TreeNode }
}
</script>

