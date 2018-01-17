<template>
  <div class="content-body-header">
    <div>
      <span v-if="ifDatePicker" style="padding-right: 15px;">时间</span>
      <DatePicker 
        v-if="ifDatePicker"
        type="date" 
        @on-change="onDateChange"
        style="width: 200px; margin-right: 50px;">
      </DatePicker>
      <Input
        v-if="ifSearchCompany"
        @on-click="onSearchCompany"
        v-model="companyName"
        placeholder="公司名称"
        icon="search"
        style="width: 200px; margin-right: 50px;"
      ></Input>
      <Input 
        @on-click="onSearchName"
        v-model="name"
        icon="search"
        :placeholder="placeholder"
        style="width: 200px">
      </Input>
      <Button 
        v-if="ifAddBtn"
        @click="onAdd"
        type="primary" 
        style="float: right;margin-right: 15px;">
      添加
      </Button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SearchHeader',
  data () {
    return {
      name: '', // 关键词
      companyName: ''// 公司名称关键词
    }
  },
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    ifDatePicker: {
      type: Boolean,
      default: false
    },
    ifSearchCompany: {
      type: Boolean,
      default: false
    },
    ifAddBtn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onDateChange (date) {
      this.$emit('onDateChange', date)
    },
    onSearchName () {
      this.$emit('onSearchName', this.name)
    },
    onSearchCompany () {
      this.$emit('onSearchCompany', this.companyName)
    },
    onAdd () {
      this.$emit('onAdd')
    }
  }
}
</script>

