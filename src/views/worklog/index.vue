<template>
  <div class="app-container">
    <div class="head-container" v-if="IsShow" style="margin-top: 20px;">
      <!-- 搜索 -->
      <el-form :inline="true" :model="queryList" style="display: flex;justify-content: space-between">
        <el-col :span="6">
        <el-date-picker style="width:100%;margin-bottom: 30px;"
                        type="daterange"
                        v-model="dateTime"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        range-separator="-"
                        end-placeholder="结束日期"
                        @change="getChage"/>
        </el-col>
          <el-col :span="6">
            <el-button type="primary" icon="el-icon-search" size="mini" @click.stop="handleSearch()">搜索</el-button>
            <el-button icon="el-icon-delete" size="mini" @click="ClearHandle()">重置</el-button>
            <el-button type="success" icon="el-icon-plus" size="mini" @click.stop="handleAdd()">新增</el-button>
          </el-col>
      </el-form>
      <!--表格渲染-->
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-table
            border
            max-height="320"
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
              prop="worklogDate"
              fit
              label="日期"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              prop="iteamName"
              fit
              label="项目工作"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              fit
              prop="coeName"
              label="COE"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              prop="developName"
              fit
              label="研发"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              fit
              prop="customerName"
              label="客户拜访"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              width="100"
              label="操作">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content:center;align-items: center;margin-top:10px; ">
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
    <!--表单组件-->
      <work-log-form :show="isShow" @close="close($event)" ref="workForm"/>
  </div>
</template>

<script>
  import './worklog.css'
  import WorkLogForm from "./workLogForm";
  import {fetchList} from '@/biz/worklog/worklog_biz'
export default {
  components: {WorkLogForm},
  data() {
    return {
      loading: false,
      dateTime:'',
      queryList:{
        startDate:'',
         endDate:'',
        pageCount: 1,
        pageSize: 10,
      },
      total:1,
      isShow: false,
      IsShow: true,
      tableData:[],
      form:{
        isShow:true,
        worklogDate:'',
        iteamName:'',
        coeName:'',
        customerName:'',
        developName:''
      }
    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    //搜索
    handleSearch() {
      this.loading = true;
      this.queryList.startDate=this.dateTime?this.dateTime[0]:''
      this.queryList.endDate=this.dateTime?this.dateTime[1]:''
// console.log(this.queryList)
      fetchList(this.queryList).then(res => {
        console.log(res)
        this.tableData = res.list;
        this.total = res.total
        this.loading = false;
      }).catch(err => {
        this.$message.error('请求失败');
      });
    },
    //新增
    handleAdd() {
      this.isShow = true;
      this.IsShow = false;
      this.$refs['workForm'].allSearch(this.form)
    },
    //查看
    handleClick(row){
      this.isShow = true;
      this.IsShow = false;
      this.$refs['workForm'].allSearch(row)
    },
    //清空
    ClearHandle() {
   this.dateTime=''
      this.handleSearch()
    },
    getChage(){//日期为清空时，触发搜索
      if(!this.dateTime){
        this.loading = true;
        this.handleSearch()
      }

    },
    close(val) {//关闭弹框
      this.isShow = val;
      this.IsShow = !val;
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

  },

}
</script>

<style scoped>
  .app-container{padding:0 80px;}
</style>
