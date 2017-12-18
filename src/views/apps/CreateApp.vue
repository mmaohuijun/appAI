<template>
  <div>
    <Form :model="createAppItem">
      <Form-item label="">
        <Input class="line-input" placeholder="应用名称"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary">创建</Button>
        <Icon type="android-more-vertical"></Icon>
      </Form-item>
      <Form-item label="是否公开">
        <Radio-gruop>
          <Radio name="公开">公开</Radio>
          <Radio name="保密">保密</Radio>
        </Radio-gruop>
      </Form-item>
      <Form-item label="应用描述">
        <Input></Input>
      </Form-item>
      <Form-item label="语言">
        <Select disabled>
          <option>zhongwen </option>
        </Select>
      </Form-item>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'CreateApp'
}
</script>
<style>
  .line-input {
    border: none;
  }
</style>
