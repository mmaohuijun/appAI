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
      waitList: []
    }
  },
  props: {
    deptList: Object
  },
  methods: {
    selectDept () {
      this.$emit('selectDept', this.deptList.name)
    },
    selectChild (dept) {
      let data = {
        dept: dept,
        name: '',
        date: '',
        pageSize: 2000,
        pageNo: 1
      }
      this.$axios.post('user/list', data).then(response => {
        if (response.data) {
          this.waitList = response.data.userList
          this.$store.commit('SET_WAITLIST', this.waitList)
        }
      })
    }
  },
  components: { TreeNode }
}
</script>

