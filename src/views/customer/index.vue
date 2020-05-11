<template>
  <div class="app-container">
    <!--搜索组件-->
    <div class="header" v-show="IsShow">
      <div class="head-container2">
        <el-form :inline="true" :model="queryList">
          <el-form-item label-width="0px">
            <el-col :span="6">
              <el-form-item label="客户名称" prop="ownOrgName">
                <el-input v-model="queryList.customerName" placeholder="请输入客户名称" :clearable="true"
                          @clear="handleSearch()">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户简称" prop="customerShortName">
                <el-input v-model="queryList.customerShortName" placeholder="请输入客户简称" clearable @clear="handleSearch"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户类型" prop="customerType">
                <el-select v-model="queryList.customerType" clearable placeholder="请输入客户类型" @clear="handleSearch">
                  <el-option
                    v-for="item in customerTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户级别" prop="customerLevel">
                <el-select v-model="queryList.customerLevel" clearable placeholder="客户级别" @clear="handleSearch">
                  <el-option
                    v-for="item in customerLevels"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item style="margin-left:30px;">
            <el-col :span="24">
              <el-button type="primary" icon="el-icon-search" size="mini" @click.stop="handleSearch()">搜索</el-button>
              <el-button icon="el-icon-delete" size="mini" @click="ClearHandle()">重置</el-button>
              <el-button class="filter-item" @click="handleAdd" size="mini" type="success" icon="el-icon-plus">新增
              </el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <!--表格组件-->
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-table
            border
            max-height="319"
            ref="multipleTable"
            v-loading="loading"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              align="center"
              prop="customerName"
              fit
              label="客户名称"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              prop="customerShortName"
              fit
              label="客户简称"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              fit
              prop="orgCd"
              label="机构代码"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              prop="customerLevel2"
              fit
              label="客户级别"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              fit
              prop="customerType2"
              label="客户类型"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              fit
              prop="legalPerson"
              label="法定代表人"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              width="100"
              label="操作">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" icon="el-icon-view" size="mini" type="success">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content:center;align-items: center">
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
      </el-col>
    </div>
    <!--新增表单组件-->
    <CustomerForm :show="isShow" @close="close($event)" ref="CustomerForm"/>
  </div>
</template>

<script>
  import './customer.css'
  import {fetchList} from '@/biz/customer/customer_biz'
  import CustomerForm from './customerForm'

  export default {
    data() {
      return {
        total: 0,
        isShow: false,
        IsShow: true,
        loading: false,
        queryList: {
          customerName: '',//客户名称
          customerLevel: '',//客户级别
          customerShortName: '',//客户简称
          customerType: '',//客户类型
          pageCount: 1,//分页参数
          pageSize: 10,
        },
        tableData: [],//表格数据
        FormData: {//个人信息参数
          customerName: '',
          customerLevel: '',
          customerId: '',//客户id
          legalPerson: '',//法人代表
          orgCd: '',//组织机构代码
          customerType: '',
        },
        customerTypes: [{
          value: '01',
          label: '金融类'
        }, {
          value: '02',
          label: '银行类'
        }, {
          value: '03',
          label: '普通类'
        }],
        customerLevels: [{
          value: '01',
          label: '一级'
        }, {
          value: '02',
          label: '二级'
        }, {
          value: '03',
          label: '三级'
        }],
      }
    },
    components: {
      CustomerForm
    },
    methods: {
      // 条件搜索列表
      handleSearch() {
        this.loading = true;
        fetchList(this.queryList).then(res => {
          for (let i in res.list) {
            this.handleRefresh(res.list[i])
          }
          this.tableData = res.list;
          this.total = res.total
          this.loading = false;
        }).catch(err => {
          this.$message.error('请求失败');
        });
      },
      handleRefresh(row) {
        this.custType(row)
        this.custLevel(row)
      },
      custType(row) {
        switch (row.customerType) {
          case '03':
            row.customerType2 = '普通类'
            break;
          case '02':
            row.customerType2 = '银行类'
            break;
          case '01':
            row.customerType2 = '金融类'
            break;
        }
      },
      custLevel(row) {
        switch (row.customerLevel) {
          case '03':
            row.customerLevel2 = '三级'
            break;
          case '02':
            row.customerLevel2 = '二级'
            break;
          case '01':
            row.customerLevel2 = '一级'
            break;
        }
      },
      //编辑按钮
      handleClick(row) {
        this.isShow = true;
        this.IsShow = false;
        this.$refs['CustomerForm'].customerSearch(row)//调子组件方法
      },
      //新增按钮
      handleAdd() {
        this.isShow = true;
        this.IsShow = false;
        this.$refs['CustomerForm'].customerSearch(this.FormData)//调子组件方法
      },
      close(val) {//关闭弹框
        // alert(1)
        this.isShow = val;
        this.IsShow = !val;
        this.handleSearch()
      },
      //清空条件
      ClearHandle() {
        this.queryList.customerLevel = '',
          this.queryList.customerName = '',
          this.queryList.customerShortName = '',
          this.queryList.customerType = '',
        this.loading = true;
        this.handleSearch()
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

    },
    created() {
      this.handleSearch()

    }
  }


</script>
<style scoped>

</style>
