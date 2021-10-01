<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <div>
      <svg-icon style="color: #fff; font-size: 20px" icon-class="language" />
    </div>
    <el-dropdown-menu>
      <el-dropdown-item :disabled="$i18n.locale === 'zh'" command="zh">
        中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="$i18n.locale === 'en'" command="en">
        Eng
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  methods: {
    changeLanguage(type) {
      Cookie.set('language', type)
      this.$i18n.locale = type
      this.$message.success('Language changed! ')
    }
  }
}
</script>

<style>
</style>
