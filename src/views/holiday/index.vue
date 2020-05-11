<template>
  <div class="app-container">
    <!--搜索组件-->
    <div class="head-container2">
      <el-form :inline="true" :model="queryList">
        <el-form-item label="假期类别" prop="cateName">
          <el-input v-model="queryList.cateName" placeholder="请输入假期类别" :clearable="true" @clear="handleSearch()">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearch()">搜索</el-button>
          <el-button icon="el-icon-delete" size="mini" @click="ClearHandle()">重置</el-button>
          <el-button class="filter-item" @click="handleAdd" size="mini" type="success" icon="el-icon-plus">新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--表格组件-->
    <el-table
      border
      max-height="400"
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;">
      <el-table-column
        type="index"
        width="100"
        label="序号"
        align="center"
        fit>
      </el-table-column>
      <el-table-column
        prop="cateName"
        align="center"
        fit
        label="假期类别"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cateDesc"
        align="center"
        fit
        label="类别描述"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        fit
        label="假日维护">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit-outline" size="mini" type="text"
                     @click="goPage(scope.row.id,scope.row.cateId,scope.row.cateName)" plain>信息维护
          </el-button>
        </template>
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
    <el-dialog :title="formFlag=='add'?'新增':(formFlag=='edit'?'编辑':'查看')"
               :visible.sync="dialogFormVisible"
               :append-to-body="true"
               :close-on-click-modal="false"
               width="60%"
               :before-close="handleClose">
      <el-form label-width="100px" :model="customerForm" :rules="customerRules" ref="customerForm"
               style="padding:30px 50px;">
        <el-form-item label-width="0px">
          <el-col :span="12">
            <el-form-item label="假日类型" prop="cateName">
              <el-input v-model="customerForm.cateName" :disabled="formFlag=='check'" placeholder="请输入假日类型" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型描述" prop="cateDesc">
              <el-input v-model="customerForm.cateDesc" placeholder="请输入类型描述" :disabled="formFlag=='check'" clearable/>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="3"
                    maxlength="80"
                    show-word-limit
                    v-model="customerForm.remark" :disabled="formFlag=='check'" placeholder="请输入备注信息" clearable/>
        </el-form-item>
      </el-form>
      <div style="width:100%;display: flex;justify-content:flex-end">
        <div slot="footer" class="dialog-footer">
          <el-button v-if="Flag==1" type="primary"
                     @click="formFlag=='add'?save('customerForm'):(formFlag=='edit'?handleUpdate('customerForm'):handleClose() )"
                     size="mini">确定
          </el-button>
          <el-button @click="handleClose(formFlag)" size="mini" style="margin:0 30px;">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addHoliday, fetchList} from '@/biz/holiday/holiday_biz'

  export default {
    data() {
      return {
        formFlag: 'add',
        Flag: 1,
        dialogFormVisible: false,
        customerForm: {
          cateName:'',//假日类别
          cateDesc:'',//类型描述
          remark:''//备注
        },
        loading: false,
        queryList: {
          cateName: '',
        },
        tableData: [],//表格数据
        customerRules: {
          cateName: [{
            required: true, message: '请输入假日类型', trigger: 'blur'
             }],
        },
      };
    },
    methods: {
      //条件搜索列表
      handleSearch() {
        this.loading =true;
        fetchList(this.queryList
        ).then(res => {
          this.tableData = res;
          // console.log(res)
          this.loading = false;
        }).catch(err => {
          this.$message.error('请求失败');
        });
      },
      //查看
      handleClick(row) {
        this.formFlag = 'check'
        this.Flag = 0
        // console.log(row);
        this.dialogFormVisible = true
        this.customerForm = row;
      },
      //显示新增弹框
      handleAdd() {
        this.formFlag = 'add'
        this.Flag = 1
        this.dialogFormVisible = true
        //新增时清空表单
        this.customerForm = {
          cateName: '',
          cateDesc: '',
          remark: ''
        }
      },
      //新增保存
      save(customerForm) {
        this.$refs[customerForm].validate((valid) => {
          if (valid) {
            addHoliday(this.customerForm).then(res => {
              this.$message.success('保存成功');
              this.handleSearch()
            }).catch(err => {
              this.$message.error('保存失败');
            })
            this.dialogFormVisible = false
          }
        })
      },
      //显示修改弹框
      handleEdit(row) {
        this.formFlag = 'edit'
        this.Flag = 1
        this.dialogFormVisible = true
        this.$nextTick(function() {
          this.customerForm = Object.assign({}, row);
        });
      },
      //编辑修改
      handleUpdate(customerForm) {
        this.$refs[customerForm].validate((valid) => {
          if (valid) {
            addHoliday(this.customerForm).then(res => {
              this.$message.success('修改成功');
              this.handleSearch();
            }).catch(err => {
              this.$message.error('修改失败');
            })
            this.dialogFormVisible = false
          }
        })
      },
      //清空条件
      ClearHandle() {
        this.queryList.cateName = '',
          this.loading = true;
        this.handleSearch();
      },
      handleClose(formFlag) {
        if (formFlag == 'edit') {
          this.handleSearch();
        }
        this.dialogFormVisible = false
        this.$refs['customerForm'].clearValidate();//清除验证信息
        // this.$refs[formName].resetFields();

      },
      //各种假期  路由动态跳转
      goPage(id, cateId, cateName) {
        this.$router.options.routes[5].children[0].meta.title = cateName //改变tags的值
        let url = `/holiday/InfoMation/${id}`
        let query = {cateName: cateName, cateId: cateId}
        this.$router.push({path: url, query: query})
        // console.log(id,cateId,cateName)
      },
    },
    created() {
      this.handleSearch();
    },
  }

</script>
<style scoped>

</style>

