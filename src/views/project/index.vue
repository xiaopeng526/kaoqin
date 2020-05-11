<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" >
        <el-form-item label="项目编号" prop="projectId">
          <el-input size="medium" placeholder="项目名称" v-model="formData.projectId"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input size="medium" placeholder="项目名称" v-model="formData.projectName"></el-input>
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType">
          <el-select size="medium" placeholder="项目类型" v-model="formData.projectType">
            <el-option v-for="(item,index) in projectTypeList" :key="index" :label="item.value" :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
            <el-form-item>
           <el-button type="primary" icon="el-icon-search" size="mini" @click="telSearch">搜索</el-button>
           <el-button icon="el-icon-delete" @click="clearTable" size="mini">重置</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="add" size="mini">新增</el-button>

        </el-form-item>
        
      </el-form>

    

      <el-collapse accordion>
  <el-collapse-item>
    <template slot="title">
      折叠/展开<i class="header-icon el-icon-info"></i>
    </template>
      <el-form :inline="true" >
         <el-form-item label="项目状态" prop="projectSts" min-width="60%" >
          <el-select size="medium" v-model="formData.projectSts" placeholder="请选择" >
            <el-option
              v-for="(item,index) in dicData"
              :key="index"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="开始日期" prop="dateTime">
          <el-date-picker
           size="medium"
            type="daterange"
            v-model="dateTime"
            value-format="yyyy-MM-dd"
            start-placeholder="开始"
            range-separator="至"
            end-placeholder="结束"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="结束日期" prop="endTime" >
          <el-date-picker
            size="medium"
            type="daterange"
            v-model="endTime"
            value-format="yyyy-MM-dd"
            start-placeholder="开始"
            range-separator="至"
            end-placeholder="结束"
            clearable
          />
        </el-form-item>
      </el-form>

    <el-form :inline="true">
     
       <el-form-item label="合同编号" prop="contractId">
          <el-input size="medium" placeholder="合同编号" v-model="formData.contractId"></el-input>
        </el-form-item>
        <el-form-item label="项目所属部门" prop="ownDeptId">
          <el-select size="medium" v-model="formData.ownDeptId" placeholder="请选择">
            <el-option
            v-for="item in projectDepartment"
            :key="item.value"
            :label="item.value"
            :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="假期类别" prop="cateId">
          <el-select size="medium" v-model="formData.cateId" >
            <el-option
              v-for="(item,index) in holiDay"
              :key="index"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
 

</el-form>
  </el-collapse-item>
</el-collapse>

           
      
    </div>

    <el-table v-loading="tableLoading" :data="tableData" border stripe>
      <el-table-column type="index" label="序号" width="60" align="center" fit />
      <el-table-column align="center" label="项目编号" prop="projectId"/>>
      <el-table-column align="center" label="项目名称" prop="projectName" />
      <el-table-column align="center" label="项目类型" prop="projectIdType" />
      <el-table-column align="center" label="项目状态" prop="projectStatus"/>
      <el-table-column align="center" label="所属部门" prop="ownDeptId"/>
      <el-table-column align="center" label="假期类别" prop="cateIdType"/>
      <el-table-column align="center" label="开始日期" prop="startDate" />
      <el-table-column align="center" label="结束日期" prop="endDate" />
      <el-table-column label="操作" width="160" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="text"
            size="small"
            @click="handelView(scope.$index, scope.row)"
          >查看</el-button>
          <el-button icon="el-icon-view" type="text" @click="handelEdit(scope.$index, scope.row)">编辑</el-button>
          <!-- <el-button
            type="text"
            icon="el-icon-delete"
            size="mini"
            @click.native.prevent="submitDelete(scope.row)"
          >删除</el-button> -->
        </template>
      </el-table-column>
      <!-- </el-table-column> -->
    </el-table>

    <el-pagination
      align="center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="dialogForm.pageNum"
      :page-sizes="[1, 10, 50, 100]"
      :page-size="dialogForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="dialogForm.total"
    ></el-pagination>
    <!--表单 -->
    <el-dialog
      :title="titleMap[dialogStatus]"
      :visible.sync="dialogTableVisible"
      :append-to-body="true"
      :close-on-click-modal="true"
      width="60%"
      @open="openDialog('dialogForm')"
      @close="resetForm('dialogForm')"
    >
      <el-form :model="dialogForm" ref="dialogForm" :rules="dFRules" label-width="120px">
        <el-row>
           <el-col :span="12">
            <el-form-item label="项目编号" prop="projectId">
              <el-input size="medium"
                placeholder="请输入项目编号"
                class="ele_input"
                :disabled="disabled"
                v-model.trim="dialogForm.projectId"
                
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input
              size="medium"
                placeholder="请输入项目名称"
                class="ele_input"
                :disabled="disabled"
                v-model.trim="dialogForm.projectName"
                :validate-event="false"
              ></el-input>
            </el-form-item>
          </el-col>
          
        </el-row>
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="合同编号" prop="contractId">
              <el-input size="medium"
                placeholder="请输入合同编号"
                class="ele_input"
                :disabled="disabled"
                v-model.trim="dialogForm.contractId"
                :validate-event="false"
              ></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="项目类型" prop="projectType">
              <el-select size="medium" style="width:100%" v-model="dialogForm.projectType" :disabled="disabled">
                <el-option
                  v-for="(item,index) in projectTypeList"
                  :key="index"
                  :label="item.value"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目状态" prop="projectSts">
              <el-select size="medium"
                :disabled="disabled"
                v-model.trim="dialogForm.projectSts"
                placeholder="请选择项目状态"
                style="width:100%"
              >
                <el-option
                  v-for="(item,index) in dicData"
                  :key="index"
                  :label="item.value"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
         
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="ownDeptId">
              <el-select size="medium" v-model.trim="dialogForm.ownDeptId" :disabled="disabled" style="width:100%">
                 <el-option
                  v-for="(item,index) in projectDepartment"
                  :key="index"
                  :label="item.value"
                  :value="item.label"
                ></el-option>
              </el-select>
              
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="假期类别" prop="cateId">
              <el-select size="medium"
                placeholder="请选择假日类别"
                :disabled="disabled"
                v-model.trim="dialogForm.cateId"
                style="width:100%"
              >
                <el-option
                  v-for="(item,index) in holiDay"
                  :key="index"
                  :label="item.value"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          
          
        </el-row>
        <el-form-item label="起止日期" prop="dateTime" >
          <el-date-picker size="medium"
          :validate-event="false"
            style="width:100%;"
            type="daterange"
            v-model="dialogForm.dateTime"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            range-separator="至"
            end-placeholder="结束日期"
            clearable
            :disabled="disabled"
          />
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="客户方负责人" prop="customerId">
              <el-input size="medium"
                placeholder="请输入客户方负责人"
                :disabled="disabled"
                v-model="dialogForm.customerId"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司方负责人" prop="ownerId" >
              <el-input size="medium" placeholder="请输入公司方负责人" :disabled="disabled" v-model="dialogForm.ownerId" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="项目说明" class="remark_dorm" prop="projectDesc">
              <el-input size="medium"
                placeholder="请输入项目说明"
                type="textarea"
                maxlength="80"
                show-word-limit
                :rows="4"
                :disabled="disabled"
                v-model.trim="dialogForm.projectDesc"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('dialogForm')" v-if="Btn===true" size="mini">确定</el-button>
        <el-button type="primary" @click="resetForm('dialogForm')" size="mini">取消</el-button>
      </div>
   
    </el-dialog>

  </div>
</template>


<script>

import {
  reqQuery,
  reqUpdateProject,
  reqDelete
} from "@/biz/project/project_biz";
import { debounce } from "@/utils/index.js"; //按钮防抖，间隔1秒
import {checkName} from "@/utils/validate.js"
export default {
  data() {
    return {
      leaveType: "",
      holiDay: [
        {
          label: "1",
          value: "中国假日"
        },
        {
          label: "2",
          value: "美国假日"
        },
        {
          label: "3",
          value: "日本假日"
        },
        {
          label: "4",
          value: "欧洲节假日"
        },
        
      ],
      dFRules:{
        projectId:[
          {required:true,max: 20, message: '不能超过20个字符', trigger: 'blur'}
        ],
        projectName:[
          { required:true,max: 20, message: '不能超过20个字符', trigger: 'blur'}
        ],
        projectType:[
          { required:true,max: 20, message: '请选择项目类型', trigger: 'blur'}
        ],
        cateId:[
          { required:true,max: 20, message: '请选择节假日类别', trigger: 'change'}
        ],
        projectSts:[
          { required:true,max: 20, message: '请选择项目状态', trigger: 'change'}
        ],
        ownDeptId:[
          { required:true,max: 20, message: '请选择所属部门', trigger: 'change'}
        ],
        dateTime:[
          { required:true, message: '请选择项目时间', trigger: 'change'}
        ],
        contractId:[
          { required:true,max: 20, message: '不能超过20个字符', trigger: 'change'}
        ],


        remark_dorm:[
          { required:true,max: 40, message: '不能超过40个字符', trigger: 'change'}
        ],
        customerId:[
          { required:false,max:30,trigger: 'blur',message: '请输入客户方负责人',},
          // {
          //   validator:checkName
          // }
        ],
        ownerId:[
          { required:false,max:30,trigger: 'blur',message: '请输入公司方负责人',},
          // {
          //   validator:checkName
          // }
        ],
      },
      titleMap: {
        addEquipment: "新增",
        editEquipment: "编辑",
        viewEquipment: "查看"
      },
      disabled: false,
      dialogStatus: "",
      Btn: true,
      dialogTableVisible: false,
      tableLoading: false,
      dateTime: ["", ""],
      endTime: ["", ""],
      formData: {
        projectId:"",
        projectName: "",
        projectType: "",
        ownDeptId: "",
        projectSts: "",
        contractId: "",
        cateId: "",
        //     dateTime:"",
        // endTime:"",
        startFrom: "", //开始日期：、
        startTo: "",
        endFrom: "", //结束日期：
        endTo: "",

        pageNum: 1,
        pageSize: 10
        // total: 0
      },
      projectDepartment:[
        {label:"1",value:"部门1"},
        {label:"2",value:"部门2"},
        {label:"3",value:"部门3"},
        {label:"4",value:"部门4"}

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
      projectTypeList: [
        {
          label: "xxxm1",
          value: "项目类型1"
        },
        {
          label: "xxxm2",
          value: "项目类型2"
        }
      ],
      dialogForm: {
        projectId: "", //   项目Id
        projectName: "", // 项目名称
        projectDesc: "", // 项目说明
        projectType: "", // 项目类型
        cateId: "", // 节假日类别
        contractId: "", // 合同编号
        projectSts: "", // 项目状态
        ownDeptId: "", // 项目所属部门Id
        customerId: "", // 客户方项目负责人
        ownerId: "", // 公司方项目负责人
        startDate: "", // 开始日期
        endDate: "", // 结束日期
        dateTime: []
      },
      tableData: []
    };
  },
  created() {
    this.telSearch();
  },
  methods: {
    handleSizeChange(val) {
      // 每页条数
      this.formData.pageSize = val;
      this.telSearch();
    },
    handleCurrentChange(val) {
      // 页面总数
      this.formData.pageNum = val;
      this.telSearch();
    },
    add() {
      //新增
      this.Btn = true;
      this.disabled = false;
      this.dialogTableVisible = true;
      this.dialogStatus = "addEquipment";
      //  this.introduce()
    },
    handelEdit(index, row) {
      //编辑
      this.disabled = false;
      this.Btn = true
      this.dialogTableVisible = true;
      this.dialogStatus = "editEquipment";
      this.dialogForm = row;
      // this.dialogForm.dateTime = [row.startDate,row.endDate]
      this.introduce();
    },
    handelView(index, row) {
      //查看
      this.Btn = false;
      this.dialogTableVisible = true;
      this.dialogStatus = "viewEquipment";
      this.disabled = true;
      this.dialogForm = row;
      this.introduce();
      // this.dialogForm.dateTime = [row.startDate,row.endDate]
    },
    // submitDelete(row) {
    //   //  删除提交
    //   this.$confirm("确定删除此条数据?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   }).then(res => {
    //     this.introduce();
    //     reqDelete(row.projectId)
    //       .then(res => {
    //         this.$message.success("删除成功");
    //         this.telSearch();
    //       })
    //       .catch(err => {
    //         this.$message.error("请求失败");
    //       });
    //   });
    // },
    introduce() {
      if (this.dialogForm.startDate && this.dialogForm.endDate) {
        this.$set(this.dialogForm, "dateTime", [
          this.dialogForm.startDate,
          this.dialogForm.endDate
        ]);
      }
    },
    submitForm: debounce(
      function(formName) {
        //确定按钮
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (
              this.dialogStatus === "addEquipment" ||
              this.dialogStatus === "editEquipment"
            ) {
              this.insertStaff(formName);
            } else {
              console.log("submitForm editStaff查看:::", this.dialogForm);
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      1000,
      true
    ),
    resetForm(formName) {
      this.chearForm();
      this.$refs[formName].clearValidate()
    },
    openDialog(formName){
      if(this.$refs[formName] !==undefined){
        this.$refs[formName].clearValidate()
      }

    },
    insertStaff(formName) {
      this.dialogForm.startDate = this.dialogForm.dateTime[0];
      this.dialogForm.endDate = this.dialogForm.dateTime[1];
      console.log(this.dialogForm.startDate , this.dialogForm.endDate);
      //增加
      reqUpdateProject(this.dialogForm)
        .then(result => {
          this.$message.success("提交成功");
          this.telSearch();
          this.chearForm();
        })
        .catch(error => {
          this.$message.error("请求失败");
        });
    },
    // 清除表单
    chearForm() {
      this.dialogTableVisible = false;
      this.dialogForm = {
        projectId: "", //项目编号 （非空
        contractId: "", //合同编号
        projectName: "", //项目名称
        ownDeptId: "", //所属部门
        cateId: "", //节假日类别
        startDate: "", //开始日期
        endDate: "", //结束日期
        projectDesc: "", //（文本框 )项目说明
        projectSts: "", //项目状态
        dateTime: ""
      };
    },
    clearTable() {
      //清空
      this.formData = {
        project: "",
        projectNa: "",
        ownDeptId: "",
        projectSts: "",
        pageNum: 1,
        pageSize: 10
      },
      this.dateTime=["",""],
      this.endTime=["",""]
       this.$nextTick(()=> {
        this.telSearch()
      })
      
    },
    telSearch() {
      this.formData.startFrom = this.dateTime[0];
      this.formData.startTo = this.dateTime[1];
      this.formData.endFrom = this.endTime[0];
      this.formData.endTo = this.endTime[1];

      // 搜索
      this.tableLoading = true;
      reqQuery(this.formData)
        .then(res => {
          this.dialogForm.total = res.total;
          this.tableData = res.list;
          this.tableLoading = false;
          this.tableData.forEach(item => {
            this.dicData.forEach(ele => {
              if (item.projectSts === ele.label) {
                item.projectStatus = ele.value;
              }
            });
            this.holiDay.forEach(ele => {
              if (item.cateId === ele.label) {
                item.cateIdType = ele.value;
              }
            });
            this.projectTypeList.forEach(ele => {
              if (item.projectType === ele.label) {
                item.projectIdType = ele.value;
              }
            });
            this.projectDepartment.forEach(ele =>{
              if(item.ownDeptId === ele.label){
                item.ownDeptId= ele.value
              }
            })
          });
        })
        .catch(error => {
          this.$message.error("请求失败");
          this.tableLoading = false;
        });
    }
  }
};
</script>
<style  scope>
.el_select {
  width: 94%;
}
.project_select{
  width: 30%;
}
</style>