<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>{{ treeNode.name }}</el-col>
    <el-col :span="7">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span>
              Operation
              <i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="add"
                :disabled="!checkPermission('add-dept')"
              >
                Add department
              </el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">
                Edit department
              </el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">
                Del department
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDepts(type) {
      if (type === 'add') {
        // add sub department to current dept
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        // edit depts
        this.$emit('editDepts', this.treeNode)
      } else {
        // delete depts
        // No need to .catch, because in route.response.use already hanle if get failed response or failed to get response
        this.$confirm('Sure to delete this department? ').then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // inform father to refresh departments data
          this.$emit('delDepts')
          this.$message('Department Deleted! ')
        })
      }
    }
  }
}
</script>

<style>
</style>
