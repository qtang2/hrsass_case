<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- left total record -->
        <template v-slot:before>
          <span>Total {{ page.total }}</span>
        </template>

        <!-- right three buttons -->
        <template v-slot:after>
          <el-button
            size="small"
            type="success"
            @click="$router.push('/import')"
          >
            Import
          </el-button>
          <el-button size="small" type="danger" @click="exportData">
            Export
          </el-button>
          <el-button
            size="small"
            type="primary"
            :disabled="!checkPermission('POINT-USER-ADD')"
            @click="showDialog = true"
          >
            Add Employee
          </el-button>
        </template>
      </page-tools>

      <!-- table part start -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" sortable="" align="center">
            <template v-slot="{ row }">
              <img
                v-imageerror="require('@/assets/common/head.jpg')"
                :src="row.staffPhoto"
                alt=""
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
                @click="showQrCode(row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <templage slot-scope="{ row }">
              <el-switch :value="row.enableState === 1" />
            </templage>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail${row.id}`)"
              >
                查看
              </el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">
                角色
              </el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- table part end -->

      <!-- pagination start -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          @current-change="changePage"
        />
      </el-row>
      <!-- pagination end -->
    </div>
    <!-- sync will help to change father comp variable which is from son comp  -->
    <add-employee :show-dialog.sync="showDialog" />

    <!-- show qr code  -->
    <el-dialog title="QR Code" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>

    <!-- role assign -->
    <assign-role
      ref="assignRole"
      :show-role-dialog.sync="showRoleDialog"
      :user-id="userId"
    />
  </div>
</template>

<script>
import { delEmployee, getEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'

export default {
  date() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false,
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false
    }
  },
  components: {
    AddEmployee,
    AssignRole
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : 'Unknown'
    },
    async delEmployee(id) {
      try {
        await this.$confirm('Sure to delete this employee')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('Employee deleted! ')
      } catch (error) {
        console.log(error)
      }
    },
    exportData() {
      // this is lazy loading, which means when this method is called, then the Export2Excel.js will be loaded
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        // excel.export_json_to_excel({
        //   header: ['name', 'salary'],
        //   data: [],
        //   filename: 'salarytable'
        // })

        /**
         * 1. header can be extract form headers obj
         * 2. data can be get from api, give page number 1 and total as api params
         * 3. and data should match header order
         * 4. need to handle timeOfEntry correctionTime formEmployment format
         */
        const { rows } = await getEmployeeList({ page: 1, size: this.total })
        const data = this.formatJson(headers, rows)
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: 'empoyeesalary'
        })
      })
    },
    formatJson(headers, rows) {
      /**
       * data in rows(employeeObj): [{username:'andy',mobile:'123},{},{}]
       * headers is the map between Chinese name and english keys ['姓名'，'电话'，'','']
       * For each obj in rows, according to headers's keys order, find their values and combine them to an array which is ['andy','123']
       */
      return rows.map(employeeObj => {
        // headers keys array['姓名'，'电话'，'','']
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(employeeObj[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(item => item.id === employeeObj[headers[key]])
            return obj ? obj.value : 'Unknown'
          }
          return employeeObj[headers[key]]
        })
      })
    },
    showQrCode(url) {
      if (url) {
        this.showCodeDialog = true
        // QrCode.toCanva(this.$refs.myCanvas, url)
        // This wont work, because page render is async task, so there is no refs before the dialog rendered
        // But we can use nextTick whcih will be run when last time page updated
        this.$nextTick(() => {
          QrCode.toCanva(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('This employee has no profile photo')
      }
    },
    async editRole(id) {
      this.userId = id
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }

}
</script>

<style>
</style>
