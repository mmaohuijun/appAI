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
      <Button type="primary" style="float:right;" @click="addParams">添加</Button>
      <Table :columns="microCol" :data="attrList" style="clear:both;"> </Table>
    </Form>
    <Modal v-model="showModal">
      <Form ref="attr" :model="attr" :closable="false" >
        <Form-item label="描述" prop="describe">
          <Input v-model="attr.describe"></Input>
        </Form-item>
        <Form-item label="属性名称" prop="attrName">
          <Input v-model="attr.attrName"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button @click="showModal=false">取消</Button>
        <Button type="primary" @click="saveParams">确定</Button>        
      </div>
    </Modal>
    <div>
      <Button type="primary" size="large" @click="saveData">保存</Button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EditMicro',
  data () {
    return {
      showModal: false,
      ifEdit: false,
      microForm: {
        name: '',
        describe: '',
        url: ''
      },
      attrList: [],
      attr: {
        describe: '',
        attrName: ''
      },
      microCol: [
        {
          title: '描述',
          key: 'describe'
        },
        {
          title: '参数名',
          key: 'attrName'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const that = this
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  icon: 'trash-a',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  color: '#999',
                  fontSize: '22px'
                },
                on: {
                  click () {
                    that.attrList.splice(params.index, 1)
                  }
                }
              }),
              h('Button', {
                props: {
                  type: 'text',
                  icon: 'edit',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  color: '#999',
                  fontSize: '22px'
                },
                on: {
                  click () {
                    that.showModal = true
                    that.ifEdit = true
                    that.attr = params.row
                  }
                }
              })
            ])
          }
        }
      ]
    }
  },
  methods: {
    // 获取微服务详情
    getMicroDetail () {
      let id = this.$store.getters.microId
      if (id) {
        this.$axios.post('mic_service/detail', { id: id }).then(response => {
          if (response.data) {
            this.microForm = response.data
            this.attrList = response.data.attrList
            console.log('attrList', this.attrList)
          }
        })
      }
    },
    addParams () {
      this.attr = {}
      this.showModal = true
    },
    // 添加参数
    saveParams () {
      console.log(this.ifEdit)
      if (this.ifEdit) {
        console.log(this.attr.describe, this.attr.attrName)
        this.attrList[this.attr._index].describe = this.attr.describe
        this.attrList[this.attr._index].attrName = this.attr.attrName
      } else {
        this.attrList.push({ describe: this.attr.describe, attrName: this.attr.attrName })
      }
      console.log(this.attrList)
      this.showModal = false
    },
    // 重置表单
    // resetForm (name) {
    //   this.$refs[name].resetFields()
    // },
    // 保存详情信息
    saveData () {
      let data = {
        id: this.microForm.id,
        name: this.microForm.name,
        url: this.microForm.url,
        describe: this.microForm.describe
        // attrList: this.attrList
      }
      this._.each(this.attrList, (ele, index) => {
        // data[`attrList[${index}].id`] = this.attrList[index].id
        data[`attrList[${index}].describe`] = ele.describe
        data[`attrList[${index}].attrName`] = ele.attrName
        // data[`attrList[${index}].value`] = ele.value
      })
      console.log(data)
      this.$axios.post('mic_service/save', data).then(response => {
        if (response.data === null) {
          this.$Message.success('保存成功！')
        } else {
          this.$Message.success('保存失败！')
        }
      })
    }
  },
  mounted () {
    this.$store.dispatch('setMicroId')
    console.log(this.$store.getters.microId)
    this.getMicroDetail()
  },
  watch: {
    'showModal' (newV, oldV) {
      // this.resetForm('attr')
      if (newV === false) {
        this.ifEdit = false
      }
    }
  }
}
</script>
