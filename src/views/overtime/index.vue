<template>
  <div class="app-container">
    <div>
      <el-form :model="overData" :inline="true">
        <el-form-item label="日期">
          <el-date-picker v-model="dateTime" size="medium" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始日期" range-separator="至" end-placeholder="结束日期" style="width:100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="审批状态" prop="otSts">
          <el-select v-model="overData.otSts" size="medium">
            <el-option v-for="(item,index) in approveStatus" :key="index" :label="item.value" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryData" icon="el-icon-search">搜索</el-button>
          <el-button @click="clearTable" icon="el-icon-delete" size="mini">重置</el-button>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="addList">增加</el-button>

        </el-form-item>

      </el-form>
      <el-table border ref="multipleTable" v-loading="loading" :data="tableData">
        <el-table-column type="index" label="序号" width="60" align="center" fit />
        <el-table-column align="center" label="加班日期" prop="otDate" />>
        <el-table-column align="center" label="开始时间" prop="startTime" />
        <el-table-column align="center" label="结束时间" prop="endTime" />
        <el-table-column align="center" label="加班时长" prop="otLength" />
        <el-table-column align="center" label="项目名称" prop="projectName" />
        <el-table-column align="center" label="审批状态" prop="otStatus" />

        <!-- <el-table-column 
        v-for="(col,index) in listForm" 
        :key="index" 
        :prop="col.prop"
        :label="col.label"
        :type="index===0?'index':'text'"
         align="center" 

        /> -->
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope">
            <el-button icon="el-icon-view" size="mini" type="text" @click.native.prevent="handelView(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini" icon="el-icon-edit" type="text" @click.native.prevent="handelEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" :disabled="scope.row.otStatus !== '待审批'" size="mini" @click.native.prevent="submitDelete(scope.row)">删除</el-button>
          </template>
          <!-- ="scope.row.otStatus === '待审批'" -->

        </el-table-column>

        <!-- <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column align="center" prop="startTime" label="开始时间" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="endTime" label="结束时间" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="otLength" label="加班时长 " show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="projectName" label="项目名称" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="otStatus" label="审批状态" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="操作" show-overflow-tooltip min-width="80%">
          <template slot-scope="scope" v-if="tableData.otStatus !== '待审批'">
            <el-button
              icon="el-icon-view"
              size="mini"
              type="text"
              @click.native.prevent="handelView(scope.$index, scope.row)"
            >查看</el-button>
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="text"
              @click.native.prevent="handelEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              size="mini"
              @click.native.prevent="submitDelete(scope.row)"
            >删除</el-button>
          </template>
          <template slot-scope="scope" v-if="tableData.otStatus === '待审批'">
            <el-button
              icon="el-icon-view"
              size="mini"
              type="text"
              @click.native.prevent="handelView(scope.$index, scope.row)"
            >查看</el-button>
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="text"
              @click.native.prevent="handelEdit(scope.$index, scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column> -->
        <!-- 弹窗 -->
        <el-dialog :visible.sync="dialogFormVisible" :append-to-body="true" :close-on-click-modal="false" width="60%" @open="openDia('diaOverTime')" @close="resetForm('diaOverTime')" :title="overTimeDialogTitle[dialogField]">
          <el-form :model="diaOverTime" ref="diaOverTime" :rules="dFRules" label-width="80px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="加班日期" prop="otDate">
                  <el-date-picker v-model="diaOverTime.otDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :disabled="disabled" style="width:100%" size="medium"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="加班时间" prop="dateTimeList">
                  <el-time-picker is-range v-model="diaOverTime.dateTimeList" @change="sameDayTime()" range-separator="―" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" :disabled="disabled" style="width:100%" format="HH:mm" value-format="HH:mm" size="medium" @blur="onPick"></el-time-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="加班时长" prop="otLength">
                  <el-input v-model="diaOverTime.otLength" size="medium" :disabled="disabled" readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="加班事由" prop="reason">
              <el-input v-model="diaOverTime.reason" size="medium" :disabled="disabled" type="textarea" placeholder="请输入加班事由" :rows="4"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('diaOverTime')" size="mini" v-if="Btn===true">确定</el-button>
            <el-button size="mini" @click="resetForm('diaOverTime')">取 消</el-button>
          </div>
        </el-dialog>
      </el-table>
      <el-pagination align="center" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="diaOverTime.pageNum" :page-sizes="[1, 10, 50, 100]" :page-size="diaOverTime.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="diaOverTime.total"></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  reqOverTime,
  reqUpdateOverTime,
  reqDelOverTimeId,
  reqSameDay
} from "@/biz/overtime/overtime";
import { debounce } from "@/utils/index.js";
export default {
  data() {
    return {
      // listForm:[
      //   {label:'序号'},
      //   {label:'加班日期',prop:'otDate'},
      //   {label:'开始时间',prop:'startTime'},
      //   {label:'结束时间',prop:'endTime'},
      //   {label:'加班时长',prop:'otLength'},
      //   {label:'项目名称',prop:'projectName'},
      //   {label:'审批状态',prop:'otStatus'}
      // ],
      dFRules: {
        otDate: [
          { required: true, message: '请选择加班日期', trigger: 'change' }
        ],
        dateTimeList: [
          { required: true, message: '请选择加班时长', trigger: 'change' }
        ],
        reason: [
          { required: true, max: 80, message: '不能超过80个字符', trigger: 'blur' }
        ]
      },

      dateTime: ["", ""],
      overData: {
        dateFrom: "",
        dateTo: "",
        pageNum: "",
        pageSize: "",
        otSts: "",
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      approveStatus: [
        { label: "TS00", value: "待审批" },
        { label: "TS01", value: "审批中" },
        { label: "TS02", value: "已退回" },
        { label: "TS03", value: "已通过" }
      ],

      loading: false,
      overTimeDialogTitle: {
        add: "新增",
        edit: "编辑",
        look: "查看"
      },

      Btn: false,
      dialogFormVisible: false,
      tableData: [],

      disabled: false,
      dialogField: "",
      diaOverTime: {
        userId: "P111111", // 人员Id
        userName: "", //  姓名
        projectId: "", //     项目编号
        projectName: "", // 项目名称
        month: "", //     年月
        startTime: "", //     开始时间
        endTime: "", //       结束时间
        otId: "", //         加班编号
        otLength: "", //     加班时长
        reason: "", //         加班事由
        otSts: "", //         审批状态
        remark: "", //        备注
        insertTime: "", //      登记时间
        approveTime: "", //   审批时间
        checkId: "", //        审批Id
        priceId: "", //         单价ID
        priceDesc: "", //   单价描述
        lineManager: "", //   直线经理
        phoneNumber: "", //联系电话
        dateTimeList: "",
        otDate: ""
      },

    };
  },
  created() {
    this.queryData();
  },

  methods: {
    onPick() {
      if (!!this.diaOverTime.dateTimeList && this.diaOverTime.otLength < 1) {
        this.sameDayTime()
      }

    },
    handleSizeChange(val) {
      // 每页条数
      this.overData.pageSize = val;
      this.queryData();
    },
    handleCurrentChange(val) {
      // 页面总数
      this.overData.pageNum = val;
      this.queryData();
    },
    openDia(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].clearValidate()

      }

      // if (this.overTimeDialogTitle[this.dialogField] === "新增") {
      //   this.diaOverTime.dateTime = "";
      //   this.diaOverTime.otLength = "";
      //   this.diaOverTime.reason = "";
      //   this.diaOverTime.lineManager = "";
      //   this.diaOverTime.phoneNumber = "";
      //   // this.diaOverTime.dateTimeList = "";
      // }
    },
    queryData() {
      this.overData.dateFrom = this.dateTime[0]
      this.overData.dateTo = this.dateTime[1]
      //搜索
      this.loading = true;
      reqOverTime(this.overData)
        .then(res => {
          this.diaOverTime.total = res.total;
          this.tableData = res.list;
          this.loading = false;
          this.tableData.forEach(item => {
            this.approveStatus.forEach(ele => {
              if (item.otSts === ele.label) {
                item.otStatus = ele.value

              }
            })
          })
        })
        .catch(err => {
          this.$message.error("请求失败");
        });
    },
    addList() {
      //增加
      this.Btn = true, this.disabled = false;
      this.dialogFormVisible = true;
      this.dialogField = "add";
    },
    clearTable() {
      //清空
      this.overData = {
        dateFrom: "",
        dateTo: "",
        pageNum: "",
        pageSize: "",
        otSts: "",
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
      this.dateTime = ["", ""]
      this.$nextTick(() => {
        this.queryData()
      })
    },
    handelView(index, row) {
      //查看
      this.Btn = false;
      this.dialogFormVisible = true;
      this.dialogField = "look";
      this.disabled = true;
      this.diaOverTime = row;

      console.log(222, row);

      this.diaOverTime.dateTimeList = [row.startTime, row.endTime];
    },
    sameDayTime() {
      // 计算时长
      if (this.diaOverTime.dateTimeList.length > 0 && this.diaOverTime.otDate) {
        this.diaOverTime.startTime = this.diaOverTime.dateTimeList[0],
          this.diaOverTime.endTime = this.diaOverTime.dateTimeList[1];
        reqSameDay({ startTime: this.diaOverTime.startTime, endTime: this.diaOverTime.endTime, otDate: this.diaOverTime.otDate, userId: "P111111" }).then(res => {
          if (res === -3) {
            this.$message.error('请假时间已存在')
            return
          }
          this.diaOverTime.otLength = res;
        }).catch(err => {
          console.log(err);
          this.$message.error('error')
        })

      }
    },

    // introduce() {
    //   if (this.diaOverTime.startTime && this.diaOverTime.endTime) {
    //     this.$set(
    //       this.diaOverTime,
    //       "diaOverTime.dateTimeList",
    //       [this.diaOverTime.startTime, this.diaOverTime.endTime]
    //       // this.diaOverTime,"diaOverTime.dateTimeList", [
    //       //   this.diaOverTime.startTime,
    //       //   this.diaOverTime.endTime
    //       // ]
    //     );
    //     console.log(
    //       this.diaOverTime.diaOverTime.dateTimeList,
    //       "this.diaOverTime.diaOverTime.dateTimeList"
    //     );
    //   }
    // },
    handelEdit(index, row) {
      //编辑
      this.disabled = false;
      this.Btn = true;
      this.dialogFormVisible = true;
      this.dialogField = "edit";
      this.diaOverTime = row;
      // this.introduce();
      this.diaOverTime.dateTimeList = [row.startTime, row.endTime];
    },
    submitDelete(row) {
      //  删除提交
      this.$confirm("确定删除此条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        // this.introduce();
        reqDelOverTimeId(row.otId)
          .then(res => {
            this.$message.success("删除成功");
            this.queryData();
          })
          .catch(err => {
            this.$message.error("请求失败");
          });
      });
    },
    resetForm(formName) {
      this.chearForm();
      this.$refs[formName].clearValidate();
    },
    submitForm: debounce(
      function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.dialogField === "add" || this.dialogField === "edit") {
              this.insertStaff(formName);
            } else {
              console.log("查看");
            }
          }
        })
      },
      1000,
      true
    ),
    // 清除表单
    chearForm() {
      this.dialogFormVisible = false;
      this.diaOverTime = {
        userId: "", // 人员Id
        userName: "", //  姓名
        projectId: "", //     项目编号
        projectName: "", // 项目名称
        month: "", //     年月
        startTime: "", //     开始时间
        endTime: "", //       结束时间
        otId: "", //         加班编号
        otLength: "", //     加班时长
        reason: "", //         加班事由
        otSts: "", //         审批状态
        remark: "", //        备注
        insertTime: "", //      登记时间
        approveTime: "", //   审批时间
        checkId: "", //        审批Id
        priceId: "", //         单价ID
        priceDesc: "", //   单价描述
        lineManager: "", //   直线经理
        phoneNumber: "",//联系电话
        dateTimeList: "",
      };
      this.dateTime = ["", ""];
    },
    insertStaff(formName) {
      this.diaOverTime.startTime = this.diaOverTime.dateTimeList[0]
      this.diaOverTime.endTime = this.diaOverTime.dateTimeList[1]
      // //增加
      if (!this.diaOverTime.otLength) {
        this.$message.warning('请选择时间')
        return
      }
      if (this.diaOverTime.otLength === 0) {
        this.$message.warning('工作日时间从18:00开始，请重新选择')

      } else {
        reqUpdateOverTime(this.diaOverTime)
          .then(res => {
            this.$message.success("提交成功");
            this.queryData();
            this.chearForm();
          })
          .catch(error => {
            this.$message.error("请求失败");
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>