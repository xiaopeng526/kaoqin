<template>
  <div>
    <!-- 简历列表 -->
    <div class="app-container" v-show="flag">
      <!-- 工具栏 -->
      <div class="head-container">
        <!-- 搜索条件 -->
        <el-input
          class="filter-item"
          placeholder="姓名"
          style="width: 150px;"
          v-model="queryData.name"
          @keyup.enter.native="tableQuery"
          @clear="tableQuery"
          clearable
        />
        <el-button
          class="filter-item"
          size="mini"
          type="success"
          icon="el-icon-search"
          @click="tableQuery"
          >搜索</el-button
        >
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="tableAdd"
          >新增</el-button
        >
        <el-button
          class="filter-item"
          size="mini"
          icon="el-icon-delete"
          @click="tableReset"
          >清空</el-button
        >
      </div>
      <!-- 表格组件 -->
      <el-table
        stripe
        border
        height="380"
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%;"
      >
        <el-table-column label="序号" type="index" width="50" />
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="性别" prop="sex" />
        <el-table-column label="出生年月" prop="birthday" />
        <el-table-column label="参加工作时间" prop="workTime" />
        <el-table-column label="联系方式" prop="phone" />
        <el-table-column label="电子邮箱" prop="email" />
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="tableCheck(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content:center;align-items: center">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryData.pageCount"
          :page-sizes="[10, 20]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 简历查看 -->
    <ResumeInfo
      v-show="!flag"
      ref="resumeInfo"
      @upup="upResumeInfo"
    ></ResumeInfo>
  </div>
</template>

<script>
import ResumeInfo from "./ResumeInfo.vue";
import { apiQueryList } from "@/biz/brief/brief_biz";

export default {
  name: "brief-resume",
  data() {
    return {
      total: 0,
      queryData: {
        name: "",
        pageCount: 1,
        pageSize: 10
      },
      tableData: [],
      tableLoading: false,
      flag: 1
    };
  },
  components: {
    ResumeInfo: ResumeInfo
  },
  created() {},
  mounted() {
    this.tableQuery();
  },
  methods: {
    tableQuery() {
      // 表格查询
      this.tableLoading = true;
      apiQueryList(this.queryData)
        .then(res => {
          console.log(res);
          this.tableData = res.list;
          this.total = res.total;
          this.tableLoading = false;
        })
        .catch(err => {
          this.$message.error("请求失败");
          this.tableLoading = false;
        });
    },
    tableReset() {
      // 表格清空查询
      this.queryData = {
        name: ""
      };
      this.tableQuery();
    },

    tableAdd() {
      // 新增弹框
      this.flag = 0;
      this.$refs.resumeInfo.queryResume();
    },
    tableCheck(item) {
      // 查看弹框
      this.flag = 0;
      this.$refs.resumeInfo.queryResume(item);
    },
    upResumeInfo(item) {
      // 查看回调
      this.flag = 1;
      this.tableQuery();
    },
    //分页
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      // this.handleSearch();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryData.pageCount = val;
      // this.handleSearch();
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style scoped></style>
