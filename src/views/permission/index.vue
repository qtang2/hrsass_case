<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template v-slot:after>
          <el-button
            type="primary"
            size="small"
            @click="addPermission('1', '0')"
            >Add Permission</el-button
          >
        </template>
      </page-tools>
      <el-table border="" :data="list" row-key="id">
        <el-table-column label="Name" prop="name" />
        <el-table-column align="center" label="Code" prop="code" />
        <el-table-column
          align="center"
          label="Description"
          prop="description"
        />
        <el-table-column align="center" label="Operation">
          <!-- Only two level of permission, 1 level access page, 2 level button action  -->
          <!-- for level 2 permission, should not have add button because we only have 2 levels -->
          <template v-slot="{ row }">
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermission('2', row.id)"
            >
              添加
            </el-button>
            <el-button type="text" @click="editPermission(row.id)">
              编辑
            </el-button>
            <el-button type="text" @click="delPermission(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="`${showText}`" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form
        ref="perForm"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, delPermission, addPermission, getPermissionDetail, updatePermission } from '@/api/permission'
import { transListToTreeData } from '@/utils/index'
export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '1'
      },
      rules: {
        name: [{ required: true, message: 'name cant be empty', trigger: 'blur' }],
        code: [{ required: true, message: 'code cant be empty', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? 'Edit Permission' : 'Add Permission'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      console.log('permission page use getPermissionList API,while role page use getRoleList API, why they are not same ???')
      this.list = transListToTreeData(await getPermissionList(), '0')
    },
    delPermission(id) {
      this.$confirm('Sure to delete the permission? ').then(() => {
        return delPermission(id)
      }).then(() => {
        this.$message.success('Permission deleted! ')
        this.getPermissionList()
      })
    },
    addPermission(type, pid) {
      // two level permission, level 1 type is 1, level 2 type is 2
      // level 1 permission is page access permission, level 2 is button action permission
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    btnOK() {
      this.$refs.perForm.validate().then(() => {
        if (this.formData.id) {
          // has id means edit permission
          return updatePermission(this.formData)
        }
        // no id means add permission
        return addPermission(this.formData)
      }).then(() => {
        this.$message.success('Action finidhed ! ')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    btnCancel() {
      this.formData = {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '1'
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    },
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  }
}
</script>

<style>
</style>
