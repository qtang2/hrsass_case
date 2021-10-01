<template>
  <div class="dashboard-container">
    <!-- 头部内容 -->
    <el-card class="header-card">
      <div>
        <div class="fl headL">
          <div class="headImg">
            <img v-imagerror="defaultImg" :src="staffPhoto" />
          </div>
          <div class="headInfoTip">
            <p class="firstChild">早安，{{ name }}，祝你开心每一天！</p>
            <!-- <p class="lastChild">
              {{ name }} | {{ $store.state.user.userInfo.company }} -
              {{ $store.state.user.userInfo.departmentName }}
            </p> -->
            <!-- or user createNamespacedHelper -->
            <p class="lastChild">
              {{ name }} | {{ userInfo.company }} -
              {{ userInfo.departmentName }}
            </p>
          </div>
        </div>
        <div class="fr" />
      </div>
    </el-card>
    <!-- 主要内容 -->
    <el-row type="flex" justify="space-between">
      <!-- 左侧内容 -->
      <el-col :span="13" style="padding-right: 26px">
        <!-- 工作日历 -->
        <el-card class="box-card">
          <div slot="header" class="header">
            <span>工作日历</span>
          </div>
          <!-- 放置日历组件 -->
          <work-calendar />
        </el-card>
        <!-- 公告 -->
        <el-card class="box-card">
          <div class="advContent">
            <div class="title">公告</div>
            <div class="contentItem">
              <ul class="noticeList">
                <li>
                  <div class="item">
                    <img src="@/assets/common/img.jpeg" alt="" />
                    <div>
                      <p>
                        <span class="col">朱继柳</span> 发布了
                        第1期“传智大讲堂”互动讨论获奖名单公布
                      </p>
                      <p>2018-07-21 15:21:38</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="item">
                    <img src="@/assets/common/img.jpeg" alt="" />
                    <div>
                      <p>
                        <span class="col">朱继柳</span> 发布了
                        第2期“传智大讲堂”互动讨论获奖名单公布
                      </p>
                      <p>2018-07-21 15:21:38</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="item">
                    <img src="@/assets/common/img.jpeg" alt="" />
                    <div>
                      <p>
                        <span class="col">朱继柳</span> 发布了
                        第3期“传智大讲堂”互动讨论获奖名单公布
                      </p>
                      <p>2018-07-21 15:21:38</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 右侧内容 -->
      <el-col :span="11">
        <el-card class="box-card">
          <div class="header headTit">
            <span>流程申请</span>
          </div>
          <div class="sideNav">
            <el-button class="sideBtn" @click="showDialog = true">
              加班离职
            </el-button>
            <el-button class="sideBtn">请假调休</el-button>
            <el-button
              class="sideBtn"
              @click="$router.push('/users/approvals')"
            >
              审批列表
            </el-button>
            <el-button class="sideBtn" @click="$router.push('/users/info')">
              我的信息
            </el-button>
          </div>
        </el-card>

        <!-- 绩效指数 -->
        <el-card class="box-card">
          <div slot="header" class="header">
            <span>绩效指数</span>
          </div>
          <!-- 放置雷达图 -->
          <radar />
        </el-card>
        <!-- 帮助连接 -->
        <el-card class="box-card">
          <div class="header headTit">
            <span>帮助链接</span>
          </div>
          <div class="sideLink">
            <el-row>
              <el-col :span="8">
                <a href="#">
                  <span class="icon iconGuide" />
                  <p>入门指南</p>
                </a>
              </el-col>
              <el-col :span="8">
                <a href="#">
                  <span class="icon iconHelp" />
                  <p>在线帮助手册</p>
                </a>
              </el-col>
              <el-col :span="8">
                <a href="#">
                  <span class="icon iconTechnology" />
                  <p>联系技术支持</p>
                </a>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible="showDialog" title="离职申请" @close="btnCancel">
      <el-form
        ref="ruleForm"
        label-width="110px"
        :model="ruleForm"
        :rules="rules"
      >
        <el-form-item label="期望离职时间" prop="exceptTime">
          <el-date-picker
            v-model="ruleForm.exceptTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="离职原因" prop="reason">
          <el-input
            v-model="ruleForm.reason"
            style="width: 70%"
            type="textarea"
            :rows="3"
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
import { mapGetters, createNamespacedHelpers } from 'vuex'
import WorkCalendar from './components/work-calendar.vue'
import Radar from './components/radar.vue'
import { startProcess } from '@/api/approvals'

const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'Dashboard',
  components: {
    WorkCalendar,
    Radar
  },
  data() {
    return {
      defaultImg: require('@/assets/common/head.jpg'),
      showDialog: false,
      ruleForm: {
        exceptTime: '',
        reason: '',
        processKey: 'process_dimission', // 特定的审批
        processName: '离职'
      },
      rules: {
        exceptTime: [{ required: true, message: '离职时间不能为空' }],
        reason: [{ required: true, message: '离职原因不能为空' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'staffPhoto'
    ]),
    ...mapState(['userInfo'])
  },
  methods: {
    btnOK() {
      this.$refs.ruleForm.validate(async isOk => {
        if (isOk) {
          await startProcess({ ...this.ruleForm, userId: this.userInfo.userId, username: this.userInfo.username })
          this.$message.success('提交成功! ')
          this.showDialog = false
        }
      })
    },
    btnCancel() {
      this.ruleForm = {
        exceptTime: '',
        reason: '',
        processKey: 'process_dimission', // 特定的审批
        processName: '离职'
      }
      this.$refs.ruleForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 10px;
  li {
    list-style: none;
  }
  .headImg {
    float: left;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #999;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .headInfoTip {
    padding: 25px 0 0;
    margin-left: 120px;
    p {
      padding: 0 0 15px;
      margin: 0;
      &.firstChild {
        font-size: 24px;
      }
      &.lastChild {
        font-size: 20px;
        color: #7f8c8d;
      }
    }
  }
}

.box-card {
  padding: 5px 10px;
  margin-top: 20px;
  .header {
    span {
      color: #2c3e50;
      font-size: 24px;
    }
    .item {
      color: #97a8be;
      float: right;
      padding: 3px 0;
    }
  }
  .headTit {
    span {
      border-bottom: 4px solid #8a97f8;
      padding-bottom: 10px;
    }
  }
}
.header-card {
  position: relative;
  .header {
    position: absolute;
    right: 20px;
    top: 15px;
    z-index: 1;
  }
}

.advContent {
  background: #fff;
  border-radius: 5px 5px 0px 0px;
  .title {
    font-size: 16px;
    padding: 20px;
    font-weight: bold;
    border-bottom: solid 1px #ccc;
  }
  .contentItem {
    padding: 0 30px;
    min-height: 350px;
    .item {
      display: flex;
      padding: 18px 0 10px;
      border-bottom: solid 1px #ccc;
      .col {
        color: #8a97f8;
      }
      img {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        margin-right: 10px;
      }
      p {
        padding: 0 0 8px;
      }
    }
  }
}
.noticeList {
  margin: 0;
  padding: 0;
}
.sideNav,
.sideLink {
  padding: 30px 0 12px;
  .sideBtn {
    padding: 16px 26px;
    font-size: 16px;
    margin: 10px 5px;
  }
}
.sideLink {
  text-align: center;
  .icon {
    display: inline-block;
    width: 76px;
    height: 76px;
    background: url("./../../assets/common/icon.png") no-repeat;
  }
  .iconGuide {
    background-position: 0 0;
  }
  .iconHelp {
    background-position: -224px 0;
  }
  .iconTechnology {
    background-position: -460px 0;
  }
}
</style>

<!-- <template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <page-tools :show-before="true">
      <template v-slot:before>
        <span>Before</span>
      </template>
      <template v-slot:after>
        <el-button type="primary">Import Excel</el-button>
      </template>
    </page-tools>
    <el-button @click="showDialog = true">test add employee</el-button>
    <add-employee :show-dialog.sync="showDialog" />
    <el-button @click="$router.push('/import')">Import excel</el-button>
    <el-button @click="getEmployeeList">Get Emp List</el-button>
    <el-button @click="exportData">Export excel</el-button>
    <el-button @click="editRole(userId)">test assign role</el-button>
    <image-upload />
    <AssignRole
      ref="assignRole"
      :show-role-dialog.sync="showRoleDialog"
      :user-id="userId"
    />
  </div>
</template>
 -->

// import { mapGetters } from 'vuex'
// import AddEmployee from '@/views/employees/components/add-employee.vue'
// import AssignRole from '@/views/employees/components/assign-role.vue'
// import { getEmployeeList } from '@/api/employees'
// import EmployeeEnum from '@/api/constant/employees'
// import { formatDate } from '@/filters'

// export default {
//   name: 'Dashboard',
//   components: {
//     AddEmployee,
//     AssignRole
//   },
//   data() {
//     return {
//       showDialog: false,
//       showRoleDialog: false,
//       userId: '1063705989926227968'
//       // 孙财 mobile 13800000003 "1066370498633486336"
//       // admin id 1063705989926227968

//     }
//   },
//   computed: {
//     ...mapGetters([
//       'name'
//     ])
//   },
//   methods: {
//     async getEmployeeList() {
//       const result = await getEmployeeList()
//       console.log('=========dashboard============')
//       console.log(result)
//     },
//     exportData() {
//       // this is lazy loading, which means when this method is called, then the Export2Excel.js will be loaded
//       const headers = {
//         '姓名': 'username',
//         '手机号': 'mobile',
//         '部门': 'departmentName'
//       }
//       import('@/vendor/Export2Excel').then(excel => {
//         // excel.export_json_to_excel({
//         //   header: ['name', 'salary'],
//         //   data: [],
//         //   filename: 'salarytable'
//         // })

//         /**
//          * 1. header can be extract form headers obj
//          * 2. data can be get from api, give page number 1 and total as api params
//          * 3. and data should match header order
//          * 4. need to handle timeOfEntry correctionTime formEmployment format
//          */
//         const rows = [{ username: 'tom', mobile: '12345', departmentName: 'aaa' }, { username: 'Jerry', mobile: '99999', departmentName: 'bbb' }]
//         const data = this.formatJson(headers, rows)
//         const multiHeader = [['Name', 'Main info', '']]
//         const merges = ['A1:A2', 'B1:C1']
//         debugger
//         excel.export_json_to_excel({
//           header: Object.keys(headers),
//           data,
//           filename: 'empoyeesalary',
//           multiHeader,
//           merges
//         })
//       })
//     },
//     formatJson(headers, rows) {
//       /**
//        * data in rows(employeeObj): [{username:'andy',mobile:'123},{},{}]
//        * headers is the map between Chinese name and english keys ['姓名'，'电话'，'','']
//        * For each obj in rows, according to headers's keys order, find their values and combine them to an array which is ['andy','123']
//        */
//       return rows.map(employeeObj => {
//         // headers keys array['姓名'，'电话'，'','']
//         return Object.keys(headers).map(key => {
//           if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
//             return formatDate(employeeObj[headers[key]])
//           } else if (headers[key] === 'formOfEmployment') {
//             const obj = EmployeeEnum.hireType.find(item => item.id === employeeObj[headers[key]])
//             return obj ? obj.value : 'Unknown'
//           }
//           return employeeObj[headers[key]]
//         })
//       })
//     },
//     async editRole(id) {
//       this.userId = id
//       await this.$refs.assignRole.getUserDetailById(id)
//       this.showRoleDialog = true
//     }
//   }

// }
// </script>

// .dashboard {
//   &-container {
//     margin: 30px;
//   }
//   &-text {
//     font-size: 30px;
//     line-height: 46px;
//   }
// }
// </style>
