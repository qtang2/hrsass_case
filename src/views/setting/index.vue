<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- role management panel start -->
          <el-tab-pane label="Roles Management">
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >
                Add New Role
              </el-button>
            </el-row>
            <el-table border="" :data="list">
              <el-table-column
                align="center"
                type="index"
                label="No."
                width="120"
              />
              <el-table-column
                align="center"
                prop="name"
                label="Role"
                width="240"
              />
              <el-table-column
                align="center"
                prop="description"
                label="Description"
              />
              <el-table-column label="Operation">
                <template slot-scope="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                  >
                    分配权限
                  </el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >
                    Edit
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                  >
                    Del
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- page number -->
              <el-pagination
                :page-size="page.pagesize"
                :current-page="page.page"
                :total="page.total"
                layout="prev,pager,next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <!-- role management panel end -->

          <!-- about company panel start -->
          <el-tab-pane label="About Company">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form
              v-model="formData"
              label-width="120px"
              style="margin-top: 50px"
            >
              <el-form-item label="Company">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="Address">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="Contact">
                <el-input
                  v-model="formData.companyPhone"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="Email">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="Remarks">
                <el-input
                  v-model="formData.remarks"
                  disabled
                  style="width: 400px"
                  type="textarea"
                  rows="3"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!-- about company panel end -->
        </el-tabs>
      </el-card>
    </div>
    <el-dialog title="Edit Role" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="roleForm"
        label-width="120px"
        :model="roleForm"
        :rules="rules"
      >
        <el-form-item label="Role" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCancel">Cancel</el-button>
          <el-button size="small" type="primary" @click="btnOK">
            Confirm
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- assign permission dialog -->
    <el-dialog
      :visible="showPermDialog"
      title="Assign Permission"
      @close="btnPermCancel"
    >
      <!-- need to show all level permissions -->
      <!-- check strictly means father son check box not same select -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :check-strictly="true"
        node-key="id"
        :default-checked-keys="selectCheck"
      />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">
            Confirm
          </el-button>
          <el-button size="small" @click="btnPermCancel">Cancel</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/settings'
import { mapGetters } from 'vuex'
import { getPermissionList, assignPerm } from '@/api/permission'
import { transListToTreeData } from '@/utils/index'
export default {
  data() {
    return {
      list: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      formData: {},
      showDialog: false,
      showPermDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, trigger: 'blur', message: 'Name cant be empty' }]
      },
      permData: [],
      defaultProps: { label: 'name' },
      roleId: '',
      selectCheck: []
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      // its ok to pass more params
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async deleteRole(id) {
      try {
        await this.$confirm('Sure to delete this role? ')
        await deleteRole(id)
        this.getRoleList()
        this.$message.success('Role deleted! ')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      // write data back
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    async btnOK() {
      // this.$refs.roleForm.validate(isOk = > {
      // })

      // if no callback for validate, it will return a Promise
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          // edit role
          await updateRole(this.roleForm)
        } else {
          // add role
          console.log('adddddd roleee', this.roleForm)
          await addRole(this.roleForm)
        }

        this.getRoleList()
        this.$message.success('Updated role! ')
        this.showDialog = false // this will indirectly call btnCancel because form close event is bind to btnCancel
      } catch (error) {
        // validation failed
        console.log(error)
      }
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    async assignPerm(id) {
      // id is the role id
      this.permData = transListToTreeData(await getPermissionList(), '0')

      // roleId is current role id
      this.roleId = id
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds
      this.showPermDialog = true
    },
    async btnPermOK() {
      // when server is not working properly, then catch block will be run and dialog will be closed
      try {
        await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys, id: this.roleId })
        this.$message.success('Permission assigned! ')
        this.showPermDialog = false
      } catch (error) {
        console.log(error)
        this.showPermDialog = false
      }
    },
    btnPermCancel() {
      this.selectCheck = []
      this.showPermDialog = false
    }
  }

}
</script>

<style>
</style>
