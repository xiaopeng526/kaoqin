<template>
  <div class="tree_main">
    <div>
      <el-tree :data="orgTreeData" :props="defaultProps" @node-click="handleNodeClick">
      </el-tree>
    </div>
  </div>
</template>

<script>
import {
  orgTreeRegionOutQuery,
  orgTreeRegionInsideQuery,
  orgTreeOutQuery,
  orgTreeInsideQuery
} from "@/api/pbms_org.js";
export default {
  name: "OrgTrees",
  props: {
    searchArea: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      orgTreeData: [],
      defaultProps: {
        children: "children",
        label: "NAME"
      }
    };
  },
  created() {
    this.treeTopDataHandle();
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
      this.$emit("treeSelector", data);

      if (this.searchArea === "region") {
        orgTreeRegionInsideQuery({ pid: data.CODE }).then(res => {
          console.log(res);
          this.$set(data, "children", res.data);
        });
      } else {
        orgTreeInsideQuery({
          pid: data.CODE,
          ptype: "region"
        }).then(res => {
          console.log(res);
          this.$set(data, "children", res.data);
        });
      }
    },
    treeTopDataHandle() {
      if (this.searchArea === "region") {
        orgTreeRegionOutQuery({ pid: "", treeflag: "region" }).then(res => {
          console.log(res);
          this.orgTreeData = res.data;
        });
      } else {
        orgTreeOutQuery({ flag: "", orgcode: "", pid: "" }).then(res => {
          this.orgTreeData = res.data;
        });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tree_header {
  padding: 10px;
  background: lightblue;
  position: relative;
}
.tree_title {
  padding-left: 10px;
  font-size: 14px;
  font-weight: bold;
  border-left: 4px solid #f35958;
}
.oper_icons {
  position: absolute;
  top: 0;
  right: 0;
  padding: 7px;
}
.el-icon-plus,
.el-icon-delete {
  padding: 3px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}
.el-icon-plus {
  background: green;
}
.el-icon-delete {
  background: #f35958;
}
</style>
