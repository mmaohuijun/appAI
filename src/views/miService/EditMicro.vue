<template>
  <div class="content-body">
    <Form :model="microForm">
      <Form-item label="名称">
        <Input v-model="microForm.name"></Input>
      </Form-item>
      <Form-item label="描述">
        <Input v-model="microForm.describe"></Input>
      </Form-item>
      <Form-item label="url">
        <Input v-model="microForm.url"></Input>
      </Form-item>
      <Form-item label="参数列表" style="float:left;"></Form-item>
      <Button type="primary" style="float:right;">添加</Button>
      <Table :columns="microCol" :data="microForm.attrList" style="clear:both;"> </Table>
    </Form>
  </div>
</template>
<script>
export default {
  name: 'EditMicro',
  data () {
    return {
      microForm: {
        name: '',
        describe: '',
        url: '',
        attrList: []
      },
      microCol: [
        {
          title: '描述',
          key: 'describe'
        },
        {
          title: '参数名',
          key: 'name'
        },
        {
          title: '参数值',
          key: 'value'
        },
        {
          title: '操作',
          
        }
      ]
    }
  },
  methods: {
    getMicroDetail () {
      this.$axios.post('mic_service/detail', { id: this.$store.getters.microId }).then(response => {
        if (response.data) {
          this.microForm = response.data
        }
      })
    }
  },
  mounted () {
    this.$store.dispatch('setMicroId')
    console.log(this.$store.getters.microId)
    this.getMicroDetail()
  }
}
</script>
