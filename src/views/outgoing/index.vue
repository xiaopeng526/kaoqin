<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="outGoing">
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

        <el-form-item label="审批状态" prop="ogSts">
          <el-select v-model="outGoing.ogSts" size="medium">
            <el-option
              v-for="(item,index) in approveStatus"
              :key="index"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="queryData">搜索</el-button>
        <el-button @click="clearTable" icon="el-icon-delete" size="mini">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="addList">增加</el-button>
        
         </el-form-item>
      </el-form>
      <!--表格组件-->
      <el-table
        border
        stripe
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        style="width:100%"
      >
        <el-table-column align="center" type="index" width="60" label="序号"></el-table-column>
        <el-table-column align="center" prop="startTime" label="开始时间" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="endTime" label="外出结束日期 " show-overflow-tooltip></el-table-column> -->
        <el-table-column align="center" prop="endTime" label="结束时间 " show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="ogLength" label="时长" show-overflow-tooltip></el-table-column>
         <!-- <el-table-column align="center" prop="customerId" label="客户名称" show-overflow-tooltip></el-table-column> -->
        <el-table-column align="center" prop="ogStatus" label="审批状态" show-overflow-tooltip></el-table-column>
       
        <el-table-column align="center" label="操作" show-overflow-tooltip>
          <template slot-scope="scope" min-width="80%">
            <el-button icon="el-icon-view" size="mini" type="text" @click="handelView(scope.$index, scope.row)">查看</el-button>
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
              :disabled="scope.row.ogStatus!=='待审批'"
              @click.native.prevent="submitDelete(scope.row)"
            >删除</el-button>
          </template>

          <!--弹框组件 -->
          <el-dialog
            :visible.sync="dialogFormVisible"
            :append-to-body="true"
            :close-on-click-modal="false"
            width="60%"
            @open="openDialog('diaOutgoing')"
            @close="resetForm('diaOutgoing')"
            :title="titleOutgoing[dialogChange]"
          >
            <el-form :model="diaOutgoing" ref="diaOutgoing" :rules="dFRules" label-width="80px">
              <el-form-item label="外出时间" prop="sumTime" >
                <el-date-picker
                  v-model="diaOutgoing.sumTime" @change="dateChange()"
                  size="medium"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  :disabled="disabled"
                  style="width:100%"
                  @blur="onPick"

                ></el-date-picker>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="外出时长" prop="ogLength">
                    <el-input
                      v-model="diaOutgoing.ogLength"
                      size="medium"
                      :disabled="disabled"
                      readonly 
                      clearable
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="外出地点" prop="point">
                    <el-input
                      v-model="diaOutgoing.point"
                      size="medium"
                      :disabled="disabled"
                      placeholder="请输入外出地点"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="客户名称" prop="customerId">
                    <el-input placeholder="请输入客户名称" size="medium" v-model="diaOutgoing.customerId"  :disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="外出说明" prop="remark">
                <el-input
                  size="medium"
                  v-model="diaOutgoing.remark"
                  :disabled="disabled"
                  placeholder="请输入外出说明"
                  clearable
                  type="textarea"
                  :rows="4"
                />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                @click="submitForm('diaOutgoing')"
                size="mini"
                v-if="Btn===true"
              >确定</el-button>
              <el-button size="mini" @click="resetForm('diaOutgoing')">取 消</el-button>
            </div>
          </el-dialog>
        </el-table-column>
      </el-table>
      <el-pagination
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="diaOutgoing.pageNum"
        :page-sizes="[1, 10, 50, 100]"
        :page-size="diaOutgoing.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="diaOutgoing.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  reqOutGoing,
  reqUpdateOutGoing,
  reqDeleteOutGoing,
  reqDuration
} from "@/biz/outgoing/outgoing_biz";
import { debounce,validateName } from "@/utils/index.js"; //按钮防抖，间隔1秒
export default {
  data() {
    return {
      dateTime: ["", ""],
      outGoing: {
        ogSts:"", //外出状态
        dateFrom:"",
        dateTo:"",
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      dFRules:{
       sumTime:[
          {required:true,message:'请输入外出时间',trigger:'change'}
        ],
        remark:[   
          { required:true,max: 20, message: '不能超过40个字符', trigger: 'blur'}
        ],
        point:[
          { required:true,max: 20, message: '不能超过40个字符', trigger: 'blur'}
        ],
        customerId:[
          { required:true,message: '只能输入汉字',trigger: 'blur'},
          {pattern: /^[\u4E00-\u9FA5]+$/,  //正则
            message: '用户名只能为中文'
          }
        ]
      },
      // diaOutgoing.sumTime:["",""],
      diaOutgoing: {
        ogId: "", //外出Id
        userId: "P111111", //    用户Id
        userName: "", //用户名
        startTime: "", // 开始时间
        endTime: "", //  结束时间
        point: "", //   外出地点
        customerId: "", // 客户Id（不必输入）
        remark: "", //   外出说明
        ogSts: "", //外出状态
        insertTime: "", //    登记时间
        approveTime: "", //   审批日期
        checkId: "", //    审批Id
        ogLength:"" ,    //外出时长
        sumTime:"",
      },
      approveStatus:[
        {label:"TS00",value:"待审批"},
        {label:"TS01",value:"审批中"},
        {label:"TS02",value:"已退回"},
        {label:"TS03",value:"已通过"},
    
        ],
      dicData: [
        {
          label: "IS00",
          value: "执行中"
        },
        {
          label: "IS01",
          value: "已结束"
        }
      ],
      loading: false,
      tableData: [],
      dialogFormVisible: false,
      disabled: false,
      Btn: true,
      titleOutgoing: {
        add: "新增",
        edit: "编辑",
        look: " 查看"
      },
      dialogChange: ""
    };
  },
  created() {
    this.queryData();
  },
  methods: {
     onPick() {
      if(!! this.diaOutgoing.sumTime&& this.diaOutgoing.sumTime.length<1){ 
        this.dateChange()
      }
    },
    handleSizeChange(val) {//页面多少条
      this.outGoing.pageSize = val;
      this.queryData()
    },
    handleCurrentChange(val) {//页面总数
      this.outGoing.pageNum = val;
      this.queryData()
    },
    queryData() {
      this.outGoing.dateFrom = this.dateTime[0];
      this.outGoing.dateTo = this.dateTime[1];
      //搜索
      this.loading = true;
      reqOutGoing(this.outGoing)
        .then(res => {
          this.diaOutgoing.total = res.total;
          this.tableData = res.list;
          this.loading = false;
          this.tableData.forEach(item =>{
            this.approveStatus.forEach(ele =>{
              if(item.ogSts === ele.label){
                item.ogStatus = ele.value
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
      this.Btn = true;
      this.disabled = false;
      this.dialogFormVisible = true;
      this.dialogChange = "add";
    },
    handelEdit(index, row) {
      //编辑
      this.disabled = false;
      this.Btn = true;
      this.dialogFormVisible = true;
      this.dialogChange = "edit";
      this.diaOutgoing = row;
      // this.introduce();
      this.diaOutgoing.sumTime=[row.startTime,row.endTime]
    },
       handelView(index, row) {
      //查看
      this.Btn = false;
      this.dialogFormVisible = true;
      this.dialogChange = "look";
      this.disabled = true;
      this.diaOutgoing = row;
      this.diaOutgoing.sumTime=[row.startTime,row.endTime]
      // this.introduce();
    },
    dateChange(){
      // if(this.diaOutgoing.sumTime){计算时长
        if(this.diaOutgoing.sumTime && this.diaOutgoing.sumTime.length>0){
         this.diaOutgoing.startTime = this.diaOutgoing.sumTime[0];
         this.diaOutgoing.endTime = this.diaOutgoing.sumTime[1];
        reqDuration({startTime:this.diaOutgoing.startTime,endTime:this.diaOutgoing.endTime,userId: "P111111"}).then(res => {
           if(res === -3){
            this.$message.error('请假时间已存在')
            return
          }
         this.diaOutgoing.ogLength=res
        })
        
      }

    },
    // introduce() {
    //   if (this.diaOutgoing.startTime && this.diaOutgoing.endTime) {
    //     this.$set(this.diaOutgoing, "dateTime", [
    //       this.diaOutgoing.startTime,
    //       this.diaOutgoing.endTime
    //     ]);
    //     console.log(this.diaOutgoing, "dateTime",'res');
        
    //   }
    // },
    openDialog(formName){
      if(this.$refs[formName] !== undefined){
        this.$refs[formName].clearValidate()
      }
    },
    handelView(index, row) {
      //查看
      this.Btn = false;
      this.dialogFormVisible = true;
      this.dialogChange = "look";
      this.disabled = true;
      this.diaOutgoing = row;
      // this.introduce();
         this.diaOutgoing.sumTime=[row.startTime,row.endTime]
    },
    submitDelete(row) {
      //  删除提交
      this.$confirm("确定删除此条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        // this.introduce();
        reqDeleteOutGoing(row.ogId)
          .then(res => {
            this.$message.success("删除成功");
            this.queryData();
          })
          .catch(err => {
            this.$message.error("请求失败");
          });
      });
    },

    submitForm: debounce(
      function(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            if (this.dialogChange === "add" || this.dialogChange === "edit") {
              this.insertStaff(formName);
            } else {
              console.log("submitForm editStaff查看:::", this.diaOutgoing);
            }
          }else{
            console.log('error submit!!');
          }
        })
      },
      1000,
      true
    ),

    resetForm(formName) {
      this.chearForm();
      this.$refs[formName].clearValidate()
    },
    insertStaff(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.diaOutgoing.startTime = this.diaOutgoing.sumTime[0];
          this.diaOutgoing.endTime = this.diaOutgoing.sumTime[1];
          //增加
          if(!this.diaOutgoing.ogLength){
            this.$message.warning('请选择时间')
            return
          }
          reqUpdateOutGoing(this.diaOutgoing)
            .then(result => {
              this.$message.success("提交成功");
              this.queryData();
              this.chearForm();
            })
            .catch(error => {
              this.$message.error("请求失败");
            });
          }else{
            console.log('校验失败');
            
          }
      })
       
    },
    // 清除表单
    chearForm() {
      this.dialogFormVisible = false;
       this.diaOutgoing={
        ogId: "", //外出Id
        userId: "", //    用户Id
        userName: "", //用户名
        startTime: "", // 开始时间
        endTime: "", //  结束时间
        point: "", //   外出地点
        customerId: "", // 客户Id（不必输入）
        remark: "", //   外出说明
        ogSts: "", //外出状态
        insertTime: "", //    登记时间
        approveTime: "", //   审批日期
        checkId: "", //    审批Id
        ogLength:"" ,    //外出时长
        sumTime:"",
      },
      this.dateTime=["",""]
      // this.diaOutgoing.sumTime=["",""]
    },
    clearTable() {
      //清空
      this.outGoing = {
        ogSts: "", //外出状态
        dateFrom:"",
        dateTo:"",
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      this.dateTime=["",""]
      
      this.$nextTick(()=> {
        this.queryData()
      })
      
      
  
    }
  }
};
</script>

<style lang="scss" scoped>
</style>