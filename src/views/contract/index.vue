<template>
  <div class="app-container">
    <!--工具栏-->
    <div>
      <!-- 搜索条件 -->
      <el-form :inline="true">
        <el-form-item label="合同编号">
          <el-input
            placeholder="合同编号"
            size="medium"
            v-model="queryData.contractId"
            @keyup.enter="tableQuery"
            @clear="tableQuery"
            clearable
            @focus="contract_input"
          />
        </el-form-item>

        <el-form-item label="合同名称">
          <el-input
            size="medium"
            placeholder="合同名称"
            v-model="queryData.contractName"
            @keyup.enter.native="tableQuery"
            @clear="tableQuery"
            clearable
          />
        </el-form-item>

         <el-form-item label="合同类型">
          <el-select v-model="queryData.contractType" size="medium">
            <el-option
              v-for="(item,index) in contractTypes"
              :key="index"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item>
           <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-search"
          @click="tableQuery"
        >搜索</el-button>
        <el-button class="filter-item" size="mini" icon="el-icon-delete" @click="tableReset">重置</el-button>
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="tableAdd"
        >新增</el-button>
        </el-form-item>
      </el-form>
     
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
          展开/折叠
            <i class="header-icon el-icon-info"></i>
          </template>
           <el-form :inline="true">
         <el-form-item label="合同金额区间">
          <el-input
            @keyup.native="firstKeyUp"
            placeholder="合同金额区间"
            v-model="queryData.lowAmount"
            @keyup.enter="tableQuery"
            @clear="tableQuery"
             size="medium"
            clearable
          />
        </el-form-item>
        <span style="font-size:30px">～</span>
        <el-form-item>
          <el-input
           size="medium"
            @keyup.native="firstKeyUp('high')"
            @blur="moneyKey"
            v-model="queryData.highAmount"
            placeholder="合同金额区间"
          ></el-input>
        </el-form-item>
        <el-form-item label="结算类型">
          <el-select v-model="queryData.payCycleType" size="medium">
            <el-option
              v-for="(item,index) in periodType"
              :key="index"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
          <!-- <el-input
            placeholder="结算类型"
            
            @keyup.enter.native="tableQuery"
            @clear="tableQuery"
            clearable
          />-->
        </el-form-item>

      </el-form>
          
        <el-form :inline="true">
        
        <el-form-item label="结算模式">
          <el-select v-model="queryData.payCycleMode" size="medium">
            <el-option
              v-for="(item,index) in cashAsset"
              :key="index"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="甲方名称">
          <el-input
            size="medium"
            placeholder="甲方名称"
            v-model="queryData.partyAName"
            @keyup.enter.native="tableQuery"
            @clear="tableQuery"
            clearable
          />
        </el-form-item>
        

        <el-form-item label="乙方名称">
          <el-input
            placeholder="乙方名称"
            size="medium"
            v-model="queryData.partyBName"
            @keyup.enter.native="tableQuery"
            @clear="tableQuery"
            clearable
          />
        </el-form-item>
           
        </el-form>
          <el-form :inline="true">
        <el-form-item label="开始日期" prop="dateTime">
          <el-date-picker
            size="medium"
            style="width:100%;"
            type="daterange"
            v-model="dateTime"
            value-format="yyyy-MM-dd"
            start-placeholder="开始"
            range-separator="至"
            end-placeholder="结束"
            @keyup.enter.native="tableQuery"
            @clear="tableQuery"
            clearable
          />
        </el-form-item>

        <el-form-item label="结束日期" prop="endTime">
          <el-date-picker
            size="medium"
            style="width:100%;"
            type="daterange"
            v-model="endTime"
            value-format="yyyy-MM-dd"
            start-placeholder="开始"
            range-separator="至"
            end-placeholder="结束"
            @keyup.enter.native="tableQuery"
            @clear="tableQuery"
            clearable
          />
        </el-form-item>
        </el-form>
        <el-form :inline="true">
        </el-form>
       </el-collapse-item>
      
      </el-collapse>
    </div>
    <!--表格组件-->
    <el-table stripe border v-loading="tableLoading" :data="tableData" style="width: 100%;">
      <el-table-column align="center" label="序号" type="index" width="60" />
      <el-table-column align="center" label="合同编号" prop="contractId" />
      <el-table-column align="center" label="合同名称" prop="contractName" />
      <el-table-column align="center" label="合同类型" prop="contractType" />
      <el-table-column align="center" label="合同金额" prop="contractAmount" />
      <el-table-column align="center" label="甲方名称" prop="partyAName" />
      <el-table-column align="center" label="乙方名称" prop="partyBName" />
      <el-table-column align="center" label="结算模式" prop="payCycleMode" />
      <el-table-column align="center" label="结算周期类型" prop="payCycleType" width="120" />
      <el-table-column align="center" label="结算周期" prop="payCycle" />
      <el-table-column align="center" label="计费月天数" prop="billDays" />
      <el-table-column label="操作" width="140" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-view" @click="tableCheck(scope.row)">查看</el-button>
          <el-button type="text" size="mini" icon="el-icon-edit" @click="tableEdit(scope.row)">编辑</el-button>
          <!-- <el-button type="text" size="mini" icon="el-icon-delete" @click="submitDel(scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      align="center"
      style="margin-top:10px;"
      @size-change="tableSizeChange"
      @current-change="tableCurrentChange"
      :current-page="queryData.pageNum"
      :total="queryData.total"
      :page-sizes="[1, 10, 50, 100]"
      :page-size="queryData.pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!--表单组件-->
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      width="60%"
      :visible.sync="formVisible"
      @open="openDialog('formRule')"
      @close="formReset('formRule')"
      :title="formFlag == 'add' ? '新增' : (formFlag == 'check' ? '查看' : '编辑')"
    >
      <el-form :model="formRule" :rules="dFRules" ref="formRule" label-width="140px" label-position="right">
         <el-divider content-position="center">基本信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同编号" prop="contractId" required>
              <el-input size="medium" v-model="formRule.contractId" :disabled="formFlag=='check'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称" prop="contractName" required>
              <el-input
                size="medium"
                v-model="formRule.contractName"
                :disabled="formFlag=='check'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="起止日期" prop="dateTime">
              <el-date-picker
                size="medium"
                v-model="formRule.dateTime"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                range-separator="——"
                end-placeholder="结束日期"
                style="width:100%"
                :disabled="formFlag=='check'"
              ></el-date-picker>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="合同类型" prop="contractType">
              <el-select
                size="medium"
                v-model="formRule.contractType"
                :disabled="formFlag=='check'"
                style="width:100%"
              >
                <el-option
                  v-for="(item,index) in contractTypes"
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
            <el-form-item label="合同金额" prop="contractAmount">
              <el-input
                size="medium"
                v-model="formRule.contractAmount"
                :disabled="formFlag=='check'"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="结算模式" prop="payCycleMode">
              <el-select
                size="medium"
                v-model="formRule.payCycleMode"
                :disabled="formFlag=='check'"
                style="width:100%"
              >
                <el-option
                  v-for="(item,index) in cashAsset"
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
            <el-form-item label="结算周期类型" prop="payCycleType">
              <el-select
                size="medium"
                v-model="formRule.payCycleType"
                :disabled="formFlag=='check'"
                style="width:100%"
              >
                <el-option
                  v-for="(item,index) in periodType"
                  :key="index"
                  :label="item.value"
                  :value="item.label"
                ></el-option>
              </el-select>

              <!-- <el-input  :disabled="formFlag=='check'" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算周期" prop="payCycle">
              <el-input size="medium" v-model="formRule.payCycle" :disabled="formFlag=='check'" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结算天数" prop="billDays">
              <el-input size="medium" v-model="formRule.billDays" :disabled="formFlag=='check'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后结算日期" prop="lastSetDate">
              <el-date-picker
                v-model="formRule.lastSetDate"
                type="date"
                placeholder="选择日期"
                :disabled="formFlag=='check'"
                style="width:100%"
                size="medium"
              ></el-date-picker>
              <!-- </el-form-item> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">甲方信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="partyAName">
              <el-input size="medium" v-model="formRule.partyAName" :disabled="formFlag=='check'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法定代表人" prop="partyALegalPerson">
              <el-input
                size="medium"
                v-model="formRule.partyALegalPerson"
                :disabled="formFlag=='check'"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="地址" prop="partyAAddress">
              <el-input
                size="medium"
                v-model="formRule.partyAAddress"
                :disabled="formFlag=='check'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮编" prop="partyAPostallCode">
              <el-input
                size="medium"
                v-model="formRule.partyAPostallCode"
                :disabled="formFlag=='check'"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人" prop="partyAConName">
              <el-input
                size="medium"
                v-model="formRule.partyAConName"
                :disabled="formFlag=='check'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="partyAPhone">
              <el-input size="medium" v-model="formRule.partyAPhone" :disabled="formFlag=='check'" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Email" prop="partyAEmail">
              <el-input size="medium" v-model="formRule.partyAEmail" :disabled="formFlag=='check'" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="center">乙方信息</el-divider>

        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="partyBName">
              <el-input size="medium" v-model="formRule.partyBName" :disabled="formFlag=='check'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法定代表人" prop="partyBLegalPerson">
              <el-input
                size="medium"
                v-model="formRule.partyBLegalPerson"
                :disabled="formFlag=='check'"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="地址" prop="partyBAddress">
              <el-input
                size="medium"
                v-model="formRule.partyBAddress"
                :disabled="formFlag=='check'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮编" prop="partyBPostallCode">
              <el-input
                size="medium"
                v-model="formRule.partyBPostallCode"
                :disabled="formFlag=='check'"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人" prop="partyBConName">
              <el-input
                size="medium"
                v-model="formRule.partyBConName"
                :disabled="formFlag=='check'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="partyBPhone">
              <el-input size="medium" v-model="formRule.partyBPhone" :disabled="formFlag=='check'" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Email" prop="partyBEmail">
              <el-input size="medium" v-model="formRule.partyBEmail" :disabled="formFlag=='check'" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="节假日类别" prop="cateId">
              <el-select
                size="medium"
                v-model="formRule.cateId"
                :disabled="formFlag=='check'"
                style="width:100%"
              >
                <el-option
                  v-for="(item,index) in holiDay"
                  :key="index"
                  :label="item.value"
                  :value="item.label"
                ></el-option>
              </el-select>

               <el-input :disabled="formFlag=='check'" /> 
             </el-form-item>
          </el-col> -->
        <!-- </el-row> --> 

        <!-- 修改人与修改时间有的话展示，没有不展示 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建人" prop="createBy" v-if="formFlag=='check'">
              <el-input size="medium" v-model="formRule.createBy" :disabled="formFlag=='check'" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="创建时间" prop="createTime" v-if="formFlag=='check'">
              <el-input size="medium" v-model="formRule.createTime" :disabled="formFlag=='check'" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="修改人" prop="updateBy" v-if="formFlag=='check'">
              <el-input size="medium" v-model="formRule.updateBy" :disabled="formFlag=='check'" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="修改时间" prop="updateTime" v-if="formFlag=='check'">
              <el-input size="medium" v-model="formRule.updateTime" :disabled="formFlag=='check'" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          type="primary"
          @click="formFlag == 'add' ? submitAdd() : (formFlag == 'edit' ? submitEdit() : formClose())"
        >确 定</el-button>
        <el-button size="mini" @click="formClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  apiQuery,
  apiUpdate,
  apiDel,
  apiFindCusId
} from "@/biz/contract/contract_biz";
import {
  checkNumber,
  checkNoRequiredPhone,
  checkName,
  checkEmail,
  checkAddress,
  checkEmailNull,
  checkAmount,
  checkDay
} from "@/utils/validate.js";

export default {
  name: "contract",
  // computed: {
  //   hnum: function() {
  //     if (true) {
  //         

  //       return this.queryData.highAmount;
  //     }
  //   }
  // },
  data() {
    return {
      queryData: {
        startFrom: "",
        startTo: "",
        endFrom: "",
        endTo: "",
        contractId: "",
        contractName: "",
        partyAName: "",
        lowAmount: "", //低的合同金额；
        highAmount: "", //高的合同金额
        payCycleType: "",
        payCycleMode: "",
        contractType: "",
        partyBName: "",
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tempMoney: "",
      dateTime: ["", ""],
      endTime: ["", ""],
      tableData: [],
      tableLoading: false,
      // holiDay: [
      //   {
      //     label: "1",
      //     value: "中国假日"
      //   },
      //   {
      //     label: "2",
      //     value: "美国假日"
      //   },
      //   {
      //     label: "3",
      //     value: "日本假日"
      //   },
      //   {
      //     label: "4",
      //     value: "欧洲节假日"
      //   }
      // ],
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
      periodType: [
        { label: "1", value: "日" },
        { label: "2", value: "周" },
        { label: "3", value: "月" },
        { label: "4", value: "季度" },
        { label: "5", value: "年" }
      ],
      cashAsset: [
        { label: "1", value: "现金" },
        { label: "2", value: "支票" },
        { label: "3", value: "转账" }
      ],
      contractTypes: [
        { label: "1", value: "类型一" },
        { label: "2", value: "类型二" },
        { label: "3", value: "类型三" },
        { label: "4", value: "类型四" }
      ],
      typeOptions: [
        { key: "1", label: "类型一" },
        { key: "2", label: "类型二" }
      ],
      cusIdOptions: [],

      formFlag: "add",
      formVisible: false,
      formRule: {
        contractId: "", //合同编号
        contractName: "", //合同名称
        customerId: "", //客户Id
        partyAName: "", //甲方名称
        partyALegalPerson: "", //甲方法定代表人
        partyAAddress: "", //甲方地址
        partyAPostallCode: "", //甲方邮编
        partyAConName: "", //甲方联系人
        partyAPhone: "", //甲方联系电话
        partyAEmail: "", //甲方Email
        partyBName: "", //乙方名称
        partyBLegalPerson: "", //乙方法定代表人
        partyBAddress: "", //乙方地址
        partyBPostallCode: "", //乙方邮编
        partyBConName: "", //乙方联系人
        partyBPhone: "", //乙方联系电话
        partyBEmail: "", //乙方Email
        startDate: "", // 开始日期
        endDate: "", //结束日期
        payCycleType: "", // 结算周期类型
        payCycle: "", // 结算周期
        payCycleMode: "", //结算模式
        billDays: "", //计费月天数
        lastSetDate: "", // 最后结算日期
        cateId: "", // 节假日类别
        contractType: "", // 合同类型
        contractAmount: "", // 合同金额
        createBy: "", //创建人
        createTime: "", // 创建时间
        updateBy: "", //修改人
        updateTime: "", //修改时间
        remark: "", //备注,
        dateTime: "",
        lowAmount: "", //低的合同金额；
        highAmount: "" //高的合同金额
      },
      dFRules: {
        contractId: [
          {
            required: true,
            max: 20,
            message: "请输入合同编号,不得大于20个字符",
            trigger: "blur"
          }
        ],
        contractName: [
          {
            required: true,
            max: 20,
            message: "请输入合同名称,不得大于20个字符",
            trigger: "blur"
          }
        ],
        partyAName: [
          {
            required: false,
            message: "请输入甲方名称,不得大于20个字符",
            trigger: "change"
          }
        ],
        partyALegalPerson: [
          {
            required: false,
            max: 20,
            message: "请输入法人代表,不得大于20个字符",
            trigger: "change"
          }
        ],
        partyAAddress: [
          {
            required: false,
            trigger: "blur",
            max:20,
            validator: checkAddress
          }
        ],
        partyAPostallCode: [
          // { required: false, message: "请输入邮编", trigger: "change",validator: checkNumber},
          {
            required: false,
            max: 6,
            message: "请正确输入邮编格式",
            trigger: "blur",
            validator: checkNumber
          }
        ],
        partyAConName: [
          {
            required: false,
            message: "请正确输入",
            trigger: "blur",
            validator: checkName
          }
        ],
        partyAPhone: [
          {
            required: false,
            message: "请输入座机号码",
            trigger: "blur",
            validator: checkNoRequiredPhone
          }
        ],
        partyAEmail: [
          {
            required: false,
            message: "请正确输入邮箱格式",
            // max: 6,
            trigger: "blur",
            validator: checkEmailNull
          }
        ],
        partyBName: [
          {
            required: false,
            message: "请输入联系人",
            trigger: "blur",
            validator: checkName
          }
        ],
        partyBLegalPerson: [
          {
            required: false,
            // message: "请输入法人",
            max: 30,
            trigger: "blur",
            validator: checkName
          }
        ],
        partyBAddress: [
          {
            required: false,
            message: "请正确输入地址",
            trigger: "blur",
            max:20,
            validator: checkAddress
          }
        ],
        partyBPostallCode: [
          {
            required: false,
            message: "请正确输入邮编格式",
            trigger: "blur",
            validator: checkNumber
          }
        ],
        partyBConName: [
          {
            required: false,
            message: "请输入联系人",
            trigger: "blur",
            validator: checkName
          }
        ],
        partyBPhone: [
          {
            required: false,
            message: "请输入座机号码",
            trigger: "blur",
            validator: checkNoRequiredPhone
          }
        ],
        partyBEmail: [
          {
            required: false,
            message: "请正确输入邮箱格式",
            trigger: "blur",
            validator: checkEmailNull
          }
        ],
        dateTime: [{ required: true, message: "请选择日期", trigger: "blur" }],
        payCycleType: [
          { required: true, message: "请选择周期类型", trigger: "change" }
        ],
        payCycle: [
          { required: true, message: "请输入结算周期", trigger: "blur" }
        ],
        payCycleMode: [
          { required: true, message: "请选择结算模式", trigger: "change" }
        ],
        billDays: [
          {
            required: true,
            trigger: "change",
            validator: checkDay
           
          },
        ],
        lastSetDate: [
          { required: true, message: "请选择最后日期", trigger: "blur" }
        ],
        // cateId: [
        //   { required: true, message: "请选择节假日类别", trigger: "change" }
        // ],
        contractType: [
          { required: true, message: "请选择合同类型", trigger: "change" }
        ],
        contractAmount: [
          {
            required: true,
            max: 11,
            message: "请输入合同金额",
            trigger: "change",
            validator: checkAmount
          }
        ],

        createBy: [
          {
            required: true,
            message: "请输入创建人",
            trigger: "blur",
            validator: checkName
          }
        ],
        createTime: [
          { required: true, message: "请输入创建时间", trigger: "blur" }
        ],
        updateBy: [
          {
            required: true,
            message: "请输入修改人",
            trigger: "blur",
            validator: checkName
          }
        ],
        updateTime: [
          { required: true, message: "请输入修改时间", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.initData();
  },
  mounted() {
    this.tableQuery();
    

  },
  watch: {
    // 监听金额变化
    tempMoney: {
      handler(newV) {
        console.log(5555);
        if (newV < this.queryData.lowAmount) {
          console.log("this.dFRules:::", this.dFRules);
        }
      },
      deep: true
    }
  },
  methods: {
    contract_input(){
      this.tableQuery()

    },
    
    firstKeyUp(v) {
      // 金额计算
      if (v === "high") {
        this.queryData.highAmount = String(this.queryData.highAmount);
        this.queryData.highAmount = this.queryData.highAmount.replace(
          /\.{2,}/g,
          "."
        ); //两个连续的"."仅保留第一个"."
        this.queryData.highAmount = this.queryData.highAmount
          .replace(".", "$#*")
          .replace(/\./g, "")
          .replace("$#*", "."); //去除其他"."
        this.queryData.highAmount = this.queryData.highAmount.replace(
          /^(\d+)\.(\d\d).*$/,
          "$1.$2"
        ); //限制只能输入两个小数
        if (
          this.queryData.highAmount.indexOf(".") < 0 &&
          this.queryData.highAmount != ""
        ) {
          //首位是0的话去掉
          this.queryData.highAmount = parseFloat(this.queryData.highAmount);
        }
      } else {
        this.queryData.lowAmount = String(this.queryData.lowAmount);
        this.queryData.lowAmount = this.queryData.lowAmount.replace(
          /\.{2,}/g,
          "."
        ); //两个连续的"."仅保留第一个"."
        this.queryData.lowAmount = this.queryData.lowAmount
          .replace(".", "$#*")
          .replace(/\./g, "")
          .replace("$#*", "."); //去除其他"."
        this.queryData.lowAmount = this.queryData.lowAmount.replace(
          /^(\d+)\.(\d\d).*$/,
          "$1.$2"
        ); //限制只能输入两个小数
        if (
          this.queryData.lowAmount.indexOf(".") < 0 &&
          this.queryData.lowAmount != ""
        ) {
          //首位是0的话去掉
          this.queryData.lowAmount = parseFloat(this.queryData.lowAmount);
        }
      }
    },
    moneyKey() {
      if (
        !!this.queryData.highAmount &&
        this.queryData.highAmount > this.queryData.lowAmount
      ) {
        return;
      }
      this.$message.warning("请输入大于前区合同金额的值");
      this.tempMoney = this.queryData.highAmount;
    },
    initData() {
      // 客户id下拉框
      apiFindCusId()
        .then(res => {
          this.cusIdOptions = res;
        })
        .catch(err => {
          this.$message.error("请求失败");
        });
    },
    tableQuery() {
      if((!this.queryData.lowAmount && !this.queryData.highAmount) || (!!this.queryData.lowAmount && this.queryData.highAmount > this.queryData.lowAmount)){
        this.queryData.startFrom = this.dateTime[0];
        this.queryData.endFrom = this.dateTime[1];
        this.queryData.startTo = this.endTime[0];
        this.queryData.endTo = this.endTime[1];
        // 表格查询
        this.tableLoading = true;
        apiQuery(this.queryData)
          .then(res => {
            console.log(res);
            this.queryData.total = res.total;
            this.tableData = res.list;
            this.tableLoading = false;
            this.tableData.forEach(item => {
              this.periodType.forEach(ele => {
                if (item.payCycleType === ele.label) {
                  item.payCycleType = ele.value;
                }
              });
              this.cashAsset.forEach(ele => {
                if (item.payCycleMode === ele.label) {
                  item.payCycleMode = ele.value;
                }
              });
              this.contractTypes.forEach(ele => {
                if (item.contractType === ele.label) {
                  item.contractType = ele.value;
                }
              });
            });
          })
          .catch(err => {
            this.$message.error("请求失败");
            this.tableLoading = false;
          });
      }else{
        this.$message.error('合同金额错误')
        return
      }
      
    },
    tableSizeChange(val) {
      // 表格条数变化
      this.queryData.pageSize = val;
      this.tableQuery();
    },
    tableCurrentChange(val) {
      // 表格页码变化
      this.queryData.pageNum = val;
      this.tableQuery();
    },
    tableReset() {
      // 表格清空查询
      this.queryData = {
        startFrom: "",
        startTo: "",
        endFrom: "",
        endTo: "",
        contractId: "",
        contractName: "",
        partyAName: "",
        lowAmount: "", //低的合同金额；
        highAmount: "", //高的合同金额
        payCycleType: "",
        payCycleMode: "",
        contractType: "",
        partyBName: "",
        pageNum: 1,
        pageSize: 10,
        total: 0
      };
      this.tableQuery();
    },

    tableAdd() {
      // 新增弹框
      this.formFlag = "add";
      this.formVisible = true;
    },
    tableCheck(item) {
      // 查看弹框
      this.formFlag = "check";
      this.formVisible = true;
      this.formRule = item;
      if (this.formRule.startDate && this.formRule.endDate)
        this.$set(this.formRule, "dateTime", [
          this.formRule.startDate,
          this.formRule.endDate
        ]);
    },
    tableEdit(item) {
      // 编辑弹框
      this.formFlag = "edit";
      this.formVisible = true;
      this.formRule = item;
      if (this.formRule.startDate && this.formRule.endDate)
        this.$set(this.formRule, "dateTime", [
          this.formRule.startDate,
          this.formRule.endDate
        ]);
    },

    submitAdd() {
      // 新增提交
      this.$refs["formRule"].validate(valid => {
        if (valid) {
          this.formRule.startDate = this.formRule.dateTime[0];
          this.formRule.endDate = this.formRule.dateTime[1];
          apiUpdate(this.formRule)
            .then(res => {
              this.formVisible = false;
              this.$message.success("提交成功");
              this.tableQuery();
            })
            .catch(err => {
              this.$message.error("请求失败");
            });
        } else {
          console.log("error 校验失败");
        }
      });
    },
    submitEdit() {
      // 编辑提交
      this.$refs["formRule"].validate(valid => {
        if (valid) {
          this.formRule.startDate = this.formRule.dateTime[0];
          this.formRule.endDate = this.formRule.dateTime[1];
          apiUpdate(this.formRule)
            .then(res => {
              this.formVisible = false;
              this.$message.success("提交成功");
              this.tableQuery();
            })
            .catch(err => {
              this.$message.error("请求失败");
            });
        } else {
          console.log("error 校验失败");
        }
      });
    },
    // submitDel(item) {
    //   //  删除提交
    //   this.$confirm("确定删除此条数据?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   }).then(res => {
    //     apiDel(item.contractId)
    //       .then(res => {
    //         this.$message.success("删除成功");
    //         this.tableQuery();
    //       })
    //       .catch(err => {
    //         this.$message.error("请求失败");
    //       });
    //   });
    // },

    formClose() {
      // 弹框关闭
      this.formVisible = false;
      this.formReset();
      this.$refs["formRule"].clearValidate();
    },
    openDialog(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].clearValidate();
      }
    },
    formReset(formName) {
      //  表单校验重置
      this.formRule = {
        contractId: "", //合同编号
        contractName: "", //合同名称
        customerId: "", //客户Id
        partyAName: "", //甲方名称
        partyALegalPerson: "", //甲方法定代表人
        partyAAddress: "", //甲方地址
        partyAPostallCode: "", //甲方邮编
        partyAConName: "", //甲方联系人
        partyAPhone: "", //甲方联系电话
        partyAEmail: "", //甲方Email
        partyBName: "", //乙方名称
        partyBLegalPerson: "", //乙方法定代表人
        partyBAddress: "", //乙方地址
        partyBPostallCode: "", //乙方邮编
        partyBConName: "", //乙方联系人
        partyPhone: "", //乙方联系电话
        partyBEmail: "", //乙方Email
        startDate: "", // 开始日期
        endDate: "", //结束日期
        payCycleType: "", // 结算周期类型
        payCycle: "", // 结算周期
        payCycleMode: "", //结算模式
        billDays: "", //计费月天数
        lastSetDate: "", // 最后结算日期
        cateId: "", // 节假日类别
        contractType: "", // 合同类型
        contractAmount: "", // 合同金额
        createBy: "", //创建人
        createTime: "", // 创建时间
        updateBy: "", //修改人
        updateTime: "", //修改时间
        remark: "", //备注,
        dateTime: "",
        lowAmount: "", //低的合同金额；
        highAmount: "" //高的合同金额
      };
      // this.$refs[formName].clearValidate();
    }
  }
};
</script>

<style scoped>
</style>
