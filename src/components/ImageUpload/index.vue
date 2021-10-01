<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :file-list="fileList"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress
      v-if="showPercent"
      style="width: 180px"
      :percentage="percent"
    />
    <el-dialog :visible.sync="showDialog" title="Image Preview">
      <img :src="imgUrl" alt="profile photo" style="width: 100%" />
    </el-dialog>
  </div>
  <!-- set action empty by using # -->
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKID1q69wTjiQr1uWjgPs51f39zXpqZ1D8m9',
  SecretKey: '80bvzmIXVChvsYx5xYsuf9NJyNVQ4RWL'
})
export default {
  data() {
    return {
      // Js will automatically add two attributes to the object, which are uid, status
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFielUid: null,
      percent: 0,
      showPercent: false
    }
  },
  computed: {
    fileComputed() {
      // if length is 1 means already has img, so no plus behind
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file, fileList) {
      // this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // or same as below
      this.fileList = fileList
    },
    changeFile(file, fileList) {
      // this on-change hook will be called when file is added, uploaded, upload failed
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      // check image type
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        this.$message.error('Image must be one of JPG,GIF,BMP,PNG!')
        return false
      }

      // check image size
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('Image must smaller than 5M')
        return false
      }

      this.currentFielUid = file.uid
      // show percent progress
      this.showPercent = true
      // must return true to continue upload
      return true
    },
    upload(params) {
      if (params.file) {
        // upload if file exist
        cos.putObject({
          Bucket: 'qiantang-ihrm-1307598197', /* 必须 */
          Region: 'ap-nanjing', /* 存储桶所在地域，必须字段 */
          Key: params.file.name, /* 必须 */
          StorageClass: 'STANDARD',
          Body: params.file, // 上传文件对象
          onProgress: (progressData) => {
            this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          // data.location is the file location
          if (!err && data.statusCode === 200) {
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFielUid) {
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
            // reset progress
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1500)
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
