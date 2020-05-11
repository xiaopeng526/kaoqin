<template>
  <div class="content">
    <!-- 搜索 -->
    <el-form :model="searchSafeLog" :inline="true">
      <el-form-item label="操作人：">
        <el-input v-model="account" size="small" placeholder="请输入操作人账号或姓名"></el-input>
      </el-form-item>
      <el-form-item label="操作时间：">
        <el-date-picker v-model="operateTime" start-placeholder="请选择操作时间" end-placeholder="请选择操作时间" size="small" type="daterange" value-format="yyyy-MM-dd" range-separator="至" style="width:100%"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchData">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="success" @click="clearSearchData">重置</el-button>
        <el-button icon="el-icon-download" size="mini" type="warning" @click="exportExcel">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" :default-sort="{ prop: 'ROWNUM_', order: 'ascending' }" border size="small" style="width: 100%; margin-top: -10px" @sort-change="sortChange">
      <el-table-column align="center" prop="ROWNUM_" label width="80"></el-table-column>
      <el-table-column header-align="center" prop="ACCOUNT" label="操作人账号" sortable width="180"></el-table-column>
      <el-table-column header-align="center" prop="NAME" label="操作人姓名" sortable width="160"></el-table-column>
      <el-table-column header-align="center" prop="DESCRIPTION" label="操作日志" sortable width="280"></el-table-column>
      <el-table-column align="center" prop="REQUEST_IP" label="操作人IP" sortable width="150"></el-table-column>
      <el-table-column :formatter="formatDate" align="center" prop="CREATE_TIME" label="操作时间" sortable width="180"></el-table-column>
      <el-table-column prop="STATUS" label="操作状态" align="center" fixed="right" class-name="safeLogTableCol">
        <template slot-scope="scope">
          <span v-if="tableData[scope.$index].STATUS === '1'" style="color:green">正常</span>
          <span v-else style="color:red">不正常</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row :gutter="24">
      <el-col :span="1">
        <i class="el-icon-refresh refresh" style="color:green" @click="getTableData"></i>
      </el-col>
      <el-col :span="23">
        <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" class="content-pagination" align="center" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { querySafeLog } from '@/api/usermgr'
export default {
  data() {
    return {
      // 表格数据
      tableData: [],
      // 搜索数据
      searchSafeLog: {},
      // 搜索--操作人
      account: '',
      // 搜索--操作时间
      operateTime: ['', ''],
      // 排序方式
      sort: 'asc',
      // 排序字段
      sortName: 'ACCOUNT',
      // 分页--当前页数
      currentPage: 1,
      // 分页--每页显示条目个数
      pageSize: 10,
      // 分页--总条目数
      total: 10,
      loading: true
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    // 查询数据
    async getTableData() {
      this.loading = true
      const params = {
        account: this.account,
        end: this.operateTime[1],
        page: this.currentPage,
        rows: this.pageSize,
        sidx: this.sortName,
        sord: this.sort,
        start: this.operateTime[0]
      }
      const res = await querySafeLog(params)
      console.log('查询数据', res)
      const { data, status } = res
      if (data) {
        const { records, page, rows } = data
        if (status === '200') {
          this.loading = false
          this.tableData = rows
          this.total = records
          this.currentPage = page
        }
      }
    },
    // 搜索查询
    searchData() {
      this.getTableData()
    },
    // 重置
    clearSearchData() {
      this.account = ''
      this.$set(this.operateTime, 0, '')
      this.$set(this.operateTime, 1, '')
      this.getTableData()
    },
    // 导出Excel
    exportExcel() {
      if (this.operateTime[0] === '' && this.operateTime[1] === '') {
        this.$message.warning('请输入安全日志的起止时间')
      } else {
        window.location.href =
          '/pbms/user/log/exportExcel?account=' +
          this.account +
          '&end=' +
          this.operateTime[1] +
          '&start=' +
          this.operateTime[0]
      }
    },
    // 表头排序变化时触发
    sortChange(column, prop, order) {
      console.log(column)
      if (column.order === '"ascending"') {
        this.sort = 'asc'
      } else {
        this.sort = 'desc'
      }
      this.sortName = column.property
      this.getTableData()
    },
    // 分页pageSize 改变时会触发
    handleSizeChange(val) {
      console.log(val)
      this.pageSize = val
      this.currentPage = 1
      this.getTableData()
    },
    // 分页currentPage 改变时会触发
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getTableData()
    },
    // 表格格式化日期
    formatDate(row, column, cellValue, index) {
      const dateStr = new Date(cellValue).getTime() // 数字类型时间戳
      const year = new Date(dateStr).getFullYear() + '-'
      let month = new Date(dateStr).getMonth() + '-'
      let day = new Date(dateStr).getDate()
      let hour = new Date(dateStr).getHours() + ':'
      let minutes = new Date(dateStr).getMinutes() + ':'
      let seconds = new Date(dateStr).getSeconds()
      if (month < 10) month = '0' + month
      if (day < 10) day = '0' + day
      if (hour < 10) hour = '0' + hour
      if (minutes < 10) minutes = '0' + minutes
      if (seconds < 10) seconds = '0' + seconds
      return year + month + day + '　' + hour + minutes + seconds
    }
  }
}
</script>

<style scoped>
.content {
  margin: 10px 20px 30px;
}
.content-pagination {
  margin: 10px;
}
/* /deep/ .safeLogTableCol .cell {
  color: #008000 !important;
} */
.refresh {
  line-height: 20px;
  position: absolute;
  left: 20px;
  top: 15px;
}
</style>
