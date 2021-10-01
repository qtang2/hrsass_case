<template>
  <div>
    <upload-excel :on-success="success" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async success({ header, results }) {
      // header and results data is Chinese, need to change key value to English
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // var arr = []
      // results.forEach(obj => {
      //   var userInfo = {}
      //   Object.keys(obj).forEach(key => {
      //     userInfo[userRelations[key]] = obj[key]
      // })
      //   arr.push(userInfo)
      // })
      // Or use map which will return a new array
      const newArr = results.map(obj => {
        var userInfo = {}
        Object.keys(obj).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            // backend require time must be a Date type, so change it to date
            userInfo[userRelations[key]] = new Date(this.formatDate(obj[key], '/'))
          } else {
            userInfo[userRelations[key]] = obj[key]
          }
        })
        return userInfo
      })
      await importEmployee(newArr)
      this.$message.success('Import success')

      // after successfully imported, need to back to the previous page
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }

}
</script>

<style>
</style>
