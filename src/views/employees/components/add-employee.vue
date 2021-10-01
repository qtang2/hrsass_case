<template>
  <el-dialog :visible="showDialog" title="Add New Employee" @close="btnCancel">
    <el-form
      ref="addEmployee"
      label-width="140px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="name" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 50%"
          placeholder="Input Name"
        />
      </el-form-item>
      <el-form-item label="Mobile" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 50%"
          placeholder="Input Mobile"
        />
      </el-form-item>
      <el-form-item label="Entry Time" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="Choose Date"
        />
      </el-form-item>
      <el-form-item label="Employed Form" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="Choose"
        >
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Work Number" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 50%"
          placeholder="Input Work Number"
        />
      </el-form-item>
      <el-form-item label="Department" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width: 50%"
          placeholder="Choose Department"
          @focus="getDepartments"
        />
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeData"
          :props="{ label: 'name' }"
          :default-expand-all="true"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="Correction Time" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 50%"
          placeholder="Input Date"
        />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">Cancel</el-button>
          <el-button size="small" type="primary" @click="btnOK">
            Confirm
          </el-button>
        </el-col>
      </el-row>
    </template>
    <!-- <span>my add: mobile:13555555559 pw:666666 id:1441605927262687232</span> -->
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, trigger: 'blur', message: 'username cant be empty' },
          { min: 1, max: 4, message: 'username must between 1-4' }
        ],
        mobile: [
          { required: true, message: 'mobile cant be emoty', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: 'mobile format incorrect', trigger: 'blur' }
        ],
        formOfEmployment: [{ required: true, message: 'employment form cant be empty', trigger: 'blur' }],
        workNumber: [{ required: true, message: 'work number cant be empty', trigger: 'blur' }],
        departmentName: [{ required: true, message: 'department cant be empty', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: 'time of entry', trigger: 'blur' }]
      },
      treeData: [],
      showTree: false,
      loading: false
    }
  },
  methods: {
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      this.treeData = transListToTreeData(depts, '')
      this.loading = false
    },
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    async btnOK() {
      try {
        await this.$refs.addEmployee.validate()
        // this result will be null if add success
        await addEmployee(this.formData)
        /**
         * this.$parent can get parent component, then can call method in parent component instance
         */
        // TODO: because cannot get employee list,once can ,uncomment line below
        // this.$parent.getEmployeeList && this.$parent.getEmployeeList()
        this.$parent.showDialog = false
        this.$message.success('Employee Added! ')
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields()
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>
</style>
