<template>
  <div class="form">
    <el-row>
      <el-col :span="24">
        <span class="select-node">选中的节点：&nbsp;{{selectNode}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2.5">
        <span class="empoly-name">员工姓名</span>
      </el-col>
      <el-col :span="5">
        <el-input class="input" v-model="inputValue" placeholder="请输入员工姓名" size="mini"></el-input>
      </el-col>
      <el-col :span="14.5" :offset="1">
        <el-button size="mini" type="primary" icon="el-icon-search" @click="searchName">搜索</el-button>
        <el-button size="mini" icon="el-icon-delete" @click="emptyInput">清空</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="fn-button">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addResource"
          v-if="level ==4"
        >新增资源组</el-button>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="addPerson">新增人员</el-button>
        <el-button size="mini" type="primary" icon="el-icon-upload">数据导入</el-button>
        <el-button size="mini" type="primary" icon="el-icon-download">模板下载</el-button>
      </el-col>
    </el-row>
    <!-- 表格组件 -->
    <el-table
      size="small"
      :data="tableData"
      stripe
      border
      style="width:100%; margin-top:15px;"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
    >
      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
      <el-table-column label="员工姓名" prop="name" align="center"></el-table-column>
      <el-table-column label="员工编号" prop="date" align="center"></el-table-column>
      <el-table-column label="所属部门" prop="date" align="center"></el-table-column>
      <el-table-column label="操作" width="270" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-view"
            size="mini"
            type="success"
            @click="handleLook(scope.$index, scope.row)"
          >查看</el-button>
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页按钮 -->
    <div>
      <el-pagination
        background
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="pagingObj.currentPage"
        :page-sizes="[10, 20, 30, 40,50,100]"
        :page-size="pagingObj.pageSize"
        :total="pagingObj.pageTotal"
        layout="total, sizes, prev, pager, next, jumper"
        align="center"
        style="margin-top:15px;"
      ></el-pagination>
    </div>
    <add-person></add-person>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import AddPerson from "./addPerson";
export default {
  name: "team-form",
  components: {
    AddPerson
  },
  props: {
    selectNode: String,
    level: Number
  },
  watch: {
  },
  data () {
    return {
      inputValue: "", // 搜索框绑定数据
      pagingObj: {
        currentPage: 1, // 当前页
        pageSize: 10, // 每页显示条数
        pageTotal: 0 // 总页数
      },
      tableData: [
        {
          id: 1,
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          id: 2,
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          id: 3,
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          id: 4,
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  computed: {
    showPersonDialog () {
      return this.$store.state.team.addPerson.showPersonDialog;
    }
  },
  created () {
    console.log(this.level)
  },
  methods: {
    //新增人员
    addPerson () {
      this.$store.dispatch("showHideAddPerson", true); //显示新增人员页面
      this.$store.dispatch("switchPersonType", 'add')
    },
    //新增资源组
    addResource () {
      this.$store.dispatch("showHideAddResource", true); //显示新增资源组页面
    },
    //查看
    handleLook (index, row) {
      console.log(index, row);
      this.$store.dispatch("showHideAddPerson", true);
      this.$store.dispatch("switchPersonType", 'look')
    },
    //编辑
    handleEdit (index, row) {
      console.log(index, row);
      this.$store.dispatch("showHideAddPerson", true);
      this.$store.dispatch("switchPersonType", 'edit')
    },
    //删除
    handleDelete (index, row) {
      console.log(index, row);
    },
    // 搜索
    searchName () {

    },
    //清空
    emptyInput () {
      this.inputValue = ''
    },

    //分页，当前页改变时触发
    currentChange (val) {
      console.log("当前页", val);
    },

    // 每页显示几条发生变化的回调
    sizeChange (val) {
      console.log("一页显示几条发生变化的函数", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.form {
  /* flex: 4; */
  /* background: yellow; */
  height: 600px;
  margin: 0 30px 0 10px;
  .select-node {
    display: inline-block;
    line-height: 32px;
    background-color: rgba(64, 158, 255, 0.1);
    font-size: 12px;
    color: #409eff;
    border-radius: 4px;
    padding: 0 10px;
  }
  .empoly-name {
    display: inline-block;
    line-height: 40px;
    padding: 0 10px;
    font-size: 14px;
    color: #606266;
  }
  .input {
    height: 32px !important;
  }
  .fn-button {
    margin-top: 10px !important;
  }
  /deep/ .el-col {
    height: 40px;
    line-height: 40px;
    /* padding-left: 10px; */
  }
}
</style>
