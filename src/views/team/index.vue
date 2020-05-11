<template>
  <div id="team">
    <!-- 新增人员 dialog-->
    <!-- <add-person></add-person> -->
    <!-- 新增资源组 dialog-->
    <add-resource></add-resource>
    <el-row>
      <el-col :span="5">
        <div class="tree">
          <el-input class="filter" placeholder="输入关键字进行过滤" v-model="filterText" size="mini"></el-input>
          <el-tree
            class="filter-tree"
            :data="treeList"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            @node-click="clickTreeCallback"
            ref="tree"
          ></el-tree>
        </div>
      </el-col>
      <el-col :span="19">
        <team-Table :selectNode="selectNode" :level="level"></team-Table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TeamTable from "./table";
// import AddPerson from "./addPerson";
import AddResource from "./addResource"
import treeData from './tree'
export default {
  name: "team",
  components: {
    TeamTable,
    // AddPerson,
    AddResource
  },
  data () {
    return {
      filterText: "",   // 过滤的节点
      selectNode: '',    //选中的节点
      treeList: [
        /* {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        } */
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      level: 0,    //选中tree时的层级
    };
  },
  created () {
    this.getTreeList()  // 获取tree数据列表
  },
  methods: {
    // 过滤tree节点
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 点击tree的回调
    clickTreeCallback (data, node) {
      // data是绑定到data上的数据，node是节点,node.level是层级
      console.log(data);
      console.log(node.level);
      this.selectNode = data.label
      this.level = node.level
      console.log(typeof (this.level))
    },
    // 获取tree数据的方法
    getTreeList () {
      console.log(treeData.content)
      this.treeList = treeData.content
    }

  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>

<style lang="scss" scoped>
#team {
  width: 100%;
  height: 100%;
  /* display: flex; */
  margin: 20px;
  .tree {
    flex: 1;
    height: 600px;
    border: 1px solid #ddd;
    box-shadow: #afafaf 0px 0px 18px;
    overflow-y: auto;
    overflow-x: hidden;
    .filter {
      margin: 10px !important;
      width: 93% !important;
    }
  }
}
</style>
