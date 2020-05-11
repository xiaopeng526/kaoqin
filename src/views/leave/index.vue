<template>
  <div class="app-container">
    <div>
      <el-form :model="leaveData" :inline="true">
        <el-form-item label="日期">
          <el-date-picker
          size="medium"
            v-model="dateTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            range-separator="至"
            end-placeholder="结束日期"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="请假类型" prop="leaveType">
          <el-select size="medium" v-model="leaveData.leaveType" style="width:100%">
            <el-option
              v-for="(item,index) in leave"
              :key="index"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批状态">
          <el-select size="medium" v-model="leaveData.leaveSts">
            <el-option v-for="(item,index) in approveStatus" :key="index" :label="item.value" :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
           <el-button type="primary" size="mini" @click="queryData" icon="el-icon-search">搜索</el-button>
             <el-button @click="clearTable" icon="el-icon-delete" size="mini">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="addList">增加</el-button>
      

        </el-form-item>

       
      </el-form>

      <el-table border ref="multipleTable" v-loading="loading" :data="tableData">
        <el-table-column type="index" width="60" align="center" label="序号"></el-table-column>
        <el-table-column align="center" prop="vocationLeaveType" label="请假类型" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="startTime" label="开始时间" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="endTime" label="结束时间" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="leaveLength" label="请假时长" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="leaveSts" label="审批状态" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="操作" show-overflow-tooltip min-width="120">
          <template slot-scope="scope" >
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
              :disabled="scope.row.leaveSts!=='待审批'"
              icon="el-icon-delete"
              size="mini"
              @click.native.prevent="submitDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗 -->
      <el-dialog
        :visible.sync="dialogFormVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="60%"
        @open="openDialog('diaLeave')"
        @close="resetForm('diaLeave')"
        :title="leaveTitle[dialogField]"
      >
        <el-form :model="diaLeave" ref="diaLeave" :rules="dFRules" label-width="120px">
          <el-form-item label="请假时间" prop="dateLeave">
            <el-date-picker
              size="medium"
              v-model="diaLeave.dateLeave"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              :disabled="disabled"
              @blur="onPick"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="请假类型" prop="leaveType">
                <el-select
                size="medium"
                  v-model="diaLeave.leaveType"
                  @change="getChange(diaLeave.leaveType)"
                  style="width:100%"
                  :disabled="disabled"
                >
                  <el-option
                    v-for="(item,index) in leave"
                    :key="index"
                    :label="item.value"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请假时长" prop="leaveLength">
                <el-input size="medium" v-model="diaLeave.leaveLength" :disabled="disabled" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="请假事由" prop="reason">
            <el-input
            size="medium"
              type="textarea"
              :rows="4"
              v-model="diaLeave.reason"
              :disabled="disabled"
              placeholder="请输入请假事由"
            ></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="紧急联系人" prop="emergencyContact">
                <el-input
                size="medium"
                  v-model="diaLeave.emergencyContact"
                  :disabled="disabled"
                  placeholder="联系人"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人电话" prop="emergencyContactNum" >
                <el-input
                 size="medium"
                 
                  v-model="diaLeave.emergencyContactNum"
                  :disabled="disabled"
                  placeholder="紧急联系人电话"
                ></el-input>
                 <!-- maxlength="11" -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="请假附件">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
               multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :on-success="handleSuccess"
              :disabled="disabled"
              :before-upload="handleBefore"
            >
              <el-button size="small" type="primary" :disabled="upDisabled">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('diaLeave')" v-if="Btn===true" size="mini">确定</el-button>
          <el-button size="mini" @click="resetForm('diaLeave')">取 消</el-button>
        </div>
      </el-dialog>
      <el-pagination
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="diaLeave.pageNum"
        :page-sizes="[1, 10, 50, 100]"
        :page-size="diaLeave.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="diaLeave.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  reqLeave,
  reqUpdateLeave,
  reqDelLeaveId,
  reqCntLeavesLength,
  reqUploadFile
} from "@/biz/leave/leave_biz";
import { debounce } from "@/utils/index.js";
import {checkNumPhone} from "@/utils/validate.js"
export default {
  data() {
    return {
      //  fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      fileList: [],
      upDisabled:false,
      dFRules:{
        dateLeave:[
           { required: true, message: '请选择请假时间',trigger: 'change' },
        ],
        leaveType:[
           { required: true, message: '请选择请假类型',trigger: 'change'},
        ],
        reason:[
          { required: true, message: '请输入请假事由', trigger: 'blur' },
          { max: 80, message: '不能超过80个字符', trigger: 'blur'}
        ],
        emergencyContact:[
          { required: true, message: '请输入紧急联系人', trigger: 'blur' },
          { max:20,message: '不能超过20个字符',trigger: 'blur'},
        ],
        emergencyContactNum:[
          { required: true, message: '请输入正确的手机号码',trigger: 'blur' },{validator:checkNumPhone,trigger: 'blur' }
        ]
      },
      leave: [
        {
          label: "LT00",
          value: "有薪休假"
        },
        {
          label: "LT01",
          value: "事假"
        },
        {
          label: "LT02",
          value: "病假"
        },
        {
          label: "LT03",
          value: "出差"
        },
        {
          label: "LT04",
          value: "婚假"
        },
        {
          label: "LT05",
          value: "生育产假"
        },
        {
          label: "LT06",
          value: "哺乳假"
        },
        {
          label: "LT07",
          value: "护理假"
        },
        {
          label: "LT08",
          value: "流产假"
        },
        {
          label: "LT09",
          value: "产前检查"
        },
        {
          label: "LT10",
          value: "丧假"
        },
        {
          label: "LT11",
          value: "调休假"
        },
        {
          label: "LT12",
          value: "特殊"
        }
      ],
      dateTime: ["", ""],
      leaveData: {
        dateFrom: "",
        dateTo: "",
        leaveType: "",
        leaveSts: "", //     请假状态
        pageNum: 1,
        pageSize: 10,
        // total: 0 
      },
      loading: false,
      leaveTitle: {
        add: "新增",
        edit: "编辑",
        look: "查看"
      },
      Btn: false,
      dialogFormVisible: false,
      tableData: [],
      disabled: false,
      dialogField: "",
      
         approveStatus: [
        { label: "TS00", value: "待审批" },
        { label: "TS01", value: "审批中" },
        { label: "TS02", value: "已退回" },
        { label: "TS03", value: "已通过" }
      ],
      diaLeave: {
        dateLeave: "",
        leaveId: "", //          请假编号
        userId: "P111111", //         人员Id
        userName: "", // 姓名
        projectId: "", //   项目编号
        projectName: "", // 项目名称
        leaveType: "", //  请假类型
        month: "", //     年月
        startTime: "", //    开始时间
        endTime: "", //     结束时间
        leaveLength: "", //请假时长
        reason: "", //       请假事由
        leaveSts: "", //     请假状态
        fileId: "", //           附件Id
        fileName: "", //    附件名称
        remark: "", //         备注
        insertTime: "", //    登记时间
        approveTime: "", //   审批日期
        checkId: "", //        审批Id
        priceId: "", //         单价ID
        priceDesc: "", //   单价描述
        emergencyContact: "", //           紧急联系人
        emergencyContactNum: "", //紧急人联系方式
    
      }
    };
  },
  mounted() {
    this.queryData();
  },
  
  methods: {
    onPick() {
      if(!! this.diaLeave.dateLeave){ 
        if(this.diaLeave.leaveType !== 'undefined'){
          this.getChange(this.diaLeave.leaveType)
        }
      }
    },
    openDialog(formName){
      if(this.$refs[formName] !== undefined){
        this.$refs[formName].clearValidate()
      }
    },
    handleSizeChange(val) {//页面条数
      this.leaveData.pageSize = val;
      this.queryData();
    },
    handleCurrentChange(val) {//页面总数
      this.leaveData.pageNum = val;
      this.queryData();
    },
    queryData() {
      this.leaveData.dateFrom = this.dateTime[0]
        this.leaveData.dateTo = this.dateTime[1]
      //搜索
      this.loading = true;
      reqLeave(this.leaveData)
        .then(res => {
          this.diaLeave.total = res.total;
          this.tableData = res.list;
          this.tableData.forEach(item => {
            this.leave.forEach(ele => {
              if (ele.label === item.leaveType) {
                item.vocationLeaveType = ele.value;
              }
            });
            this.approveStatus.forEach(ele =>{
              if(item.leaveSts === ele.label){
                item.leaveSts = ele.value
              }
            })
            
          });
          this.loading = false;
        })
        .catch(err => {
          this.$message.error("请求失败");
        });
    },
    addList() {
      //增加
      this.Btn = true
      this.upDisabled = false
      this.disabled = false;
      this.dialogFormVisible = true;
      this.dialogField = "add";
    },
    clearTable() {
      //清空

      this.leaveData = {
        dateFrom: "",
        dateTo: "",
        leaveType: "",
        leaveSts: "", //     请假状态
        pageNum: 1,
        pageSize: 10,
        // total: 0
      };
      this.dateTime = ["", ""];
      this.$nextTick(()=> {
        this.queryData()
      })
    },
    handelView(index, row) {//查看
      this.upDisabled = true
      this.Btn = false;
      this.dialogFormVisible = true;
      this.dialogField = "look";
      this.disabled = true;
      this.diaLeave = row;
      this.diaLeave.dateLeave = [row.startTime, row.endTime];
    },
    getChange(v) {//计算请假时长
      if (v && this.diaLeave.dateLeave.length > 0) {
        this.diaLeave.startTime = this.diaLeave.dateLeave[0];
        this.diaLeave.endTime = this.diaLeave.dateLeave[1];
        reqCntLeavesLength({startTime:this.diaLeave.startTime,endTime:this.diaLeave.endTime,leaveType:this.diaLeave.leaveType, userId: "P111111"}).then(res => {
          if(res === -3){
            this.$message.error('请假时间已存在')
            return
          }
            this.diaLeave.leaveLength = res;
          
      
       
      });
      }
    },
    handelEdit(index, row) {
      //编辑
      this.upDisabled = false
      this.disabled = false;
      this.Btn = true;
      this.dialogFormVisible = true;
      this.dialogField = "edit";
      this.diaLeave = row;
      this.diaLeave.dateLeave = [row.startTime, row.endTime];

      // this.introduce();
    },
    submitDelete(row) {
      //  删除提交
      this.$confirm("确定删除此条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        // this.introduce();
        reqDelLeaveId(row.leaveId)
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
      // this.dialogFormVisible = false;
      this.chearForm();
      this.$refs[formName].clearValidate()
    },
    submitForm: debounce(
      function(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
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
      this.diaLeave = {
        // dateTime: "",
        leaveId: "", //          请假编号
        userId: "", //         人员Id
        userName: "", // 姓名
        projectId: "", //   项目编号
        projectName: "", // 项目名称
        leaveType: "", //  请假类型
        month: "", //     年月
        startTime: "", //    开始时间
        endTime: "", //     结束时间
        leaveLength: "", //请假时长
        reason: "", //       请假事由
        leaveSts: "", //     请假状态
        fileId: "", //           附件Id
        fileName: "", //    附件名称
        remark: "", //         备注
        insertTime: "", //    登记时间
        apprTime: "", //   审批日期
        checkId: "", //        审批Id
        priceId: "", //         单价ID
        priceDesc: "", //   单价描述
        emergencyContact: "", //           紧急联系人
        emergencyContactNum: "", //紧急人联系方式
        dateLeave:""
      }; 

      this.dateTime=["",""]
  
    },
    insertStaff(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid){
      this.diaLeave.startTime = this.diaLeave.dateLeave[0];
      this.diaLeave.endTime = this.diaLeave.dateLeave[1];

      //增加
      if(!this.diaLeave.leaveLength){
        this.$message.warning('请选择时间')
        return
      }
      reqUpdateLeave(this.diaLeave)
        .then(result => {
          this.$message.success("提交成功");
          this.queryData();
          this.chearForm();
        
        })
        .catch(error => {
          this.$message.error("请求失败");
        })
          
        }else{
          console.log("效验失败！");
          
        }
      })
     
    },



    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleSuccess(res,file){
      // alert("上传成功")
      console.log("上传成功");
      this.$message.success('上传成功')
      

    },
    handleBefore(){
      if(this.diaLeave.leaveType==="病假"){
        this.$message.warning('病假请上传附件')
      }

    },

    handlePreview(file) {
      console.log(file,1111111111111);
      // reqUploadFile(file).then(res => {
      //   console.log(res,'上传成功');
        
      // }).catch(error =>{
      //   console.log(error,'哪里错了');
        
      // })
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>