<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <el-form
      ref="deptForm"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <!-- prop is the name used for form validation -->
      <!-- which means this item should use validation rules called 'name' -->
      <el-form-item label="Name" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50 chars"
        />
      </el-form-item>
      <el-form-item label="Code" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50 chars"
        />
      </el-form-item>
      <el-form-item label="Manager" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="1-50 chars"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in people"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Introduction" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300 chars"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- fill footer slot -->
    <el-row type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">Cancel</el-button>
        <el-button size="small" type="primary" @click="btnOK">Add</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
import { addDepartments } from '@/api/departments'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkNameRepeat = async (rule, value, callback) => {
      // Need to set two sets of rules, one for add new department, one for edit
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // edit rule
        // name cannot be same as other departments which has same pid as mine
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }

      isRepeat ? callback(new Error(`Department name '${value}' aready exist`)) : callback()
    }
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // edit rule
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        isRepeat = depts.some(item => item.code === value && value)
      }

      isRepeat ? callback(new Error(`Department code '${value}' aready exist`)) : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: 'name cant be empty', trigger: 'blur' },
          { min: 1, max: 50, message: 'name must between 1-50 chars', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }],

        code: [
          { required: true, message: 'code cant be empty', trigger: 'blur' },
          { min: 1, max: 50, message: 'code must between 1-50 chars', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }],

        manager: [
          { required: true, message: 'manager cant be empty', trigger: 'blur' },
          { min: 1, max: 50, message: 'manager must between 1-50 chars', trigger: 'blur' }],

        introduce: [
          { required: true, message: 'introduce cant be empty', trigger: 'blur' },
          { min: 1, max: 50, message: 'introduce must between 1-300 chars', trigger: 'blur' }]
      },
      people: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? 'Edit Department ' : 'Add New Department'
    }
  },
  methods: {
    async getEmployeeSimple() {
      const result = await getEmployeeSimple()
      this.people = result
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    },
    btnOK() {
      this.$refs.deptForm.validate(async isOk => {
        if (isOk) {
          if (this.formData.id) {
            // edit form
            await updateDepartments(this.formData)
          } else {
            // add form
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          this.$emit('addDepts')
          this.$emit('update:showDialog', false)
          // when reset showDialog value, el-dialog will automatically call close method, which in this case, will call btnCancel method, so all form data will be reset
        }
      })
    },
    btnCancel() {
      // reset formData, clear all data passed from other component
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // reset input data and validation values
      // this will only clear what we defined in the form
      // but we have other information passed from other component
      this.$refs.deptForm.resetFields()
      this.$emit('update:showDialog', false)
    }
  }

}
</script>

<style>
</style>
