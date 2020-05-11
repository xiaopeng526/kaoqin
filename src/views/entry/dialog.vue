<template>
  <div class="tree-dialog">
    <el-dialog title="请选择所属部门" :visible.sync="show" :append-to-body="true">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>

      <el-tree
        class="filter-tree"
        ref="tree"
        default-expand-all
        :data="data"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :highlight-current="true"
        @node-click="clickNodeCallBack"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="clickSure">确 定</el-button>
        <el-button @click="clickCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'entry-dialog',
  data () {
    return {
      deptName: '',
      filterText: '',
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  computed: {
    show: {
      set () {
        this.$store.dispatch('showHideDialog', false)
      },
      get () {
        return this.$store.state.entry.show
      }
    }
  }, watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    }
  },

  methods: {
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    clickNodeCallBack (data, node) {
      console.log(data)
      console.log(node)
      console.log(node.data.label)
      this.deptName = node.data.label

    },
    clickSure () {
      // 把所属部门传给父组件
      this.$emit('getDeptInfo', this.deptName)
      this.$store.dispatch('showHideDialog', false)
    },
    clickCancel () {
      this.$store.dispatch('showHideDialog', false)
    }
  },
}
</script>

<style lang="scss" scoped>
.filter-tree {
  height: 250px;
  overflow: auto;
  margin-top: 10px;
}
</style>
