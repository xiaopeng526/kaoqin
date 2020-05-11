<template>
  <div class="app-container">
    <!--搜索组件-->
    <div class="head-container2">
      <div>
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-back" @click="goBack">返回</el-button>
      </div>
      <el-form :inline="true" :model="queryList">
        <el-form-item label="年月" >
          <el-date-picker
            v-model="queryList.holidayDate"
            value-format="yyyy-MM"
            type="month"
            placeholder="选择年月"
            :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearch()">搜索</el-button>
          <el-button icon="el-icon-delete" size="mini" @click="ClearHandle()">重置</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-select placeholder="初始化年份" v-model="year">
          <el-option v-for="item in years" :key="item.value" :label="item.value" :value="item.value"></el-option>
        </el-select>
        <el-form-item style="margin-left:20px;">
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="ClearHoliday()">初始化日期
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--表格组件-->
    <el-table
      border
      max-height="370"
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;">
      <el-table-column
        type="index"
        width="100"
        label="序号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="cateName"
        align="center"
        fit
        label="假期类别"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="holidayDate"
        align="center"
        fit
        label="日期"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="dateWeek2"
        align="center"
        fit
        label="星期"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="dateType2"
        align="center"
        fit
        label="日期类型"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        width="250"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" icon="el-icon-view" size="mini" type="text">查看</el-button>
          <el-button size="mini" @click="handleEdit(scope.row)" icon="el-icon-edit" type="text">编辑</el-button>
          <!--<el-button type="text" icon="el-icon-delete"  size="mini" @click.native.prevent="deleteRow(scope.row)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--弹框组件 -->
    <el-dialog :title="formFlag=='edit'?'编辑':'查看'"
               :visible.sync="dialogFormVisible"
               :append-to-body="true"
               :close-on-click-modal="false"
               width="60%"
               :before-close="handleClose">
      <el-form label-width="100px" :model="customerForm" :rules="customerRules" ref="customerForm"
               style="padding:30px 50px;">
        <el-form-item label-width="0px">
          <el-col :span="12">
            <el-form-item label="类别名称" prop="cateName">
              <el-input v-model="customerForm.cateName" :disabled="disable=='check'" placeholder="请输入类别名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期" prop="holidayDate">
              <el-date-picker
                v-model="customerForm.holidayDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="请输入日期" :disabled="disable=='check'" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label-width="0px">
          <el-col :span="12">
            <el-form-item label="星期" prop="dateWeek">
              <el-select v-model="customerForm.dateWeek" clearable placeholder="请选择" :disabled="disable=='check'">
                <el-option
                  v-for="item in dateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期类型" prop="dateType">
              <el-select v-model="customerForm.dateType"
                         :clearable="false"
                         placeholder="请选择" :disabled="undisable=='check'">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="日期描述" prop="cateDesc">
          <el-input type="textarea" :rows="2"
                    maxlength="40"
                    show-word-limit
                    v-model="customerForm.dateDesc" placeholder="请输入日期描述" :disabled="undisable=='check'" clearable/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="2"
                    maxlength="80"
                    show-word-limit
                    v-model="customerForm.remark" :disabled="undisable=='check'" placeholder="请输入备注信息" clearable/>
        </el-form-item>
      </el-form>
      <div style="width:100%;display: flex;justify-content: flex-end">
        <div slot="footer" class="dialog-footer">
          <el-button v-if="Flag==1" type="primary"
                     @click.stop="formFlag=='edit'?handleUpdate('customerForm'):handleClose()" size="mini">确定
          </el-button>
          <el-button @click="handleClose(formFlag)" size="mini" style="margin:0 30px;">取 消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--分页组件-->
    <div style="display: flex;justify-content:center">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryList.pageCount"
        :page-sizes="[10, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {findHI, updateHCD, Initholiday} from '@/biz/holiday/holiday_biz.js'

  export default {
    data() {
      return {
        total: 0,
        Flag: 1,
        //切换编辑、查看
        formFlag: '',
        //编辑时是否禁用
        disable: '',
        undisable: '',
        //弹框的显示与隐藏
        dialogFormVisible: false,

        customerForm: {
          cateName:'',//类别名称
          holidayDate:'',//日期
          dateWeek:'',//星期
          dateType:'',//日期类型
          dateDesc:'',//日期描述
          remark:''//备注
        },
        loading: false,
        //接收路由传来的值
        cateName: this.$route.query.cateName ? this.$route.query.cateName : "",
        cateId: this.$route.query.cateId ? this.$route.query.cateId : "",
        //搜索条件
        queryList: {
          holidayDate: '',
          cateId: "",
          pageCount: 1,
          pageSize: 10,
        },
        years: [],
        year: new Date().getFullYear(),//获取当前年份
        options:
          [{
            value: 'DT00',
            label: '工作日'
          }, {
            value: 'DT01',
            label: '周末'
          }, {
            value: 'DT02',
            label: '节假日'
          },
            {
              value: 'DT03',
              label: '工作日->节假日'
            },
            {
              value: 'DT04',
              label: '周末->工作日'
            },
          ],
        dateOptions:
          [{
            value: '1',
            label: '周日'
          }, {
            value: '2',
            label: '周一'
          }, {
            value: '3',
            label: '周二'
          },
            {
              value: '4',
              label: '周三'
            },
            {
              value: '5',
              label: '周四'
            },
            {
              value: '6',
              label: '周五'
            },
            {
              value: '7',
              label: '周六'
            },
          ],
        tableData: [],
        customerRules: {
          holidayDate: [{
            required: true,
            message: '请输入星期',
            trigger: 'blur'
          }],
          dateType: [{
            required: true,
            message: '请输入日期类型',
            trigger: 'blur'
          }],
        },
        Holiday: {
          year: "",
          cateId: "",
        }
      };
    },
    methods: {
      //返回
      goBack() {
        this.$store.dispatch('delVisitedView', this.$route);//返回关闭tags
        this.$router.go(-1)
      },
      //条件搜索列表
      handleSearch() {
        this.loading = true;
        // console.log(this.cateName,this.cateId,)
        this.queryList.cateId = this.cateId
        findHI(this.queryList).then(res => {
          for (let i in res.list) {
            res.list[i].cateName = this.cateName
            this.getDateWeek(res.list[i])
            this.getDateType(res.list[i])
          }
          this.tableData = res.list;
          this.total = res.total
          this.loading = false;
        }).catch(err => {
          this.$message.error('请求失败');
        });
      },
      //星期的转换
      getDateWeek(res){
        switch (res.dateWeek) {
          case '1':
            res.dateWeek2='周日';
            break;
          case '2':
            res.dateWeek2='周一';
            break;
          case '3':
            res.dateWeek2='周二';
            break;
          case '4':
            res.dateWeek2='周三';
            break;
          case '5':
            res.dateWeek2='周四';
            break;
          case '6':
            res.dateWeek2='周五';
            break;
          case '7':
            res.dateWeek2='周六';
            break;
        }
      },
      //日期类型的转换
      getDateType(res) {
        switch (res.dateType) {
          case 'DT00':
            res.dateType2 = '工作日';
            break;
          case 'DT01':
            res.dateType2 = '周末';
            break;
          case 'DT02':
            res.dateType2 = '节假日';
            break;
          case 'DT03':
            res.dateType2 = '工作日->节假日';
            break;
          case 'DT04':
            res.dateType2 = '周末->工作日';
            break;
        }
      },
      //查看
      handleClick(row) {
        this.Flag = 0
        this.formFlag == ''
        this.disable = 'check'
        this.undisable = 'check',
          console.log(row);
        this.dialogFormVisible = true
        this.customerForm = row;
      },
      save() {

      },
      //显示修改弹框
      handleEdit(row) {
        console.log(row)
        this.Flag = 1
        this.formFlag = 'edit'
        this.disable = 'check'
        this.undisable = '',
          this.dialogFormVisible = true
        this.customerForm =Object.assign({},row) ;
      },
      //编辑修改
      handleUpdate(customerForm) {
        // console.log(this.customerForm)
        this.$refs[customerForm].validate((valid) => {
          if (valid) {
            updateHCD(this.customerForm).then(res => {
              console.log(res)
              this.$message.success('修改成功');
              this.handleSearch();
            }).catch(err => {
              this.$message.error('修改失败');
            })
            this.dialogFormVisible = false
          }
        })
      },
      //初始化日期
      ClearHoliday() {
        this.Holiday.cateId = this.cateId
        this.Holiday.year = this.year
        // console.log(this.Holiday)
        Initholiday(this.Holiday).then(res => {
          // console.log(res)
          this.$message.success(res.body);
          this.handleSearch()
        }).catch(err => {
          this.$message.error('初始化日期失败');
        })
        this.dialogFormVisible = false
      },

      //清空条件
      ClearHandle() {
        this.queryList.holidayDate = '',
          this.loading = true;
        this.handleSearch();
      },
      //分页
      handleSizeChange(val) {
        this.queryList.pageSize = val
        this.handleSearch();
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.queryList.pageCount = val
        this.handleSearch();
        // console.log(`当前页: ${val}`);
      },
      handleClose(formFlag) {//取消
        if (formFlag == 'edit') {
          this.handleSearch();
        }
        this.dialogFormVisible = false
        this.$refs['customerForm'].clearValidate();//清除验证信息
        this.handleSearch();
      },
    },
    created() {
      this.handleSearch();
      //初始化获取年份
      let preYear = this.year - 1;
      let nextYear = this.year + 1;
      this.years = [{
        label: preYear,
        value: preYear
      }, {
        label: this.year,
        value: this.year
      }, {
        label: nextYear,
        value: nextYear
      }]
    },

  }

</script>
<style scoped>
  .head-container2 {
    width: 90%;
    display: flex;
    justify-content: space-between
  }
</style>

