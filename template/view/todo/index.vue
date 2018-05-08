
<template>
  <div style="max-width:980px;">
    <el-tree
  :data="jsondata"
  node-key="id"
  default-expand-all
  @node-drag-start="handleDragStart"
  @node-drag-enter="handleDragEnter"
  @node-drag-leave="handleDragLeave"
  @node-drag-over="handleDragOver"
  @node-drag-end="handleDragEnd"
  @node-drop="handleDrop"
  draggable
  :allow-drop="allowDrop"
  :allow-drag="allowDrag">
  <span class="custom-tree-node flex grow between" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
            <el-button
            type="text"
            size="mini"
            @click.stop.prevent="() => edit(data)">
            编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click.stop.prevent="() => append(data)">
            添加子级
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click.stop.prevent="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
</el-tree>

<el-dialog title="添加任务" :visible.sync="showEditPop">
        <input type="text" v-model="PopData.label">
          <el-button @click="showEditPop = false">取 消</el-button>
          <el-button type="primary" @click="dialog_Submit">提 交</el-button>
    </el-dialog>
  </div>
</template>

<script>
var UUID = require('uid2')
export default {
  name: "todo",
  data() {
    return {
      showEditPop:false,
      jsondata: [],
      PopData:{},
      planid:0
    }
  },
  methods: {
    dialog_Submit() {
      this.showEditPop = false
      // this.$refs.elform.$el.submit();
      this.update()
    },
    update() {
      this.api.todo.update({
        id:this.planid,
        jsondata:this.jsondata
      })
      console.log(this.jsondata);
    },
    edit(data){
      this.showEditPop = true
      this.PopData = data
      // console.log(data)
    },
    append(data) {
      const newChild = { id: UUID(10), label: "新增节点", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
      this.update()
    },
    remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
        this.update()
      },
    handleDragStart(node, ev) {
      console.log("drag start", node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log("tree drag enter: ", dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log("tree drag leave: ", dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log("tree drag over: ", dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log("tree drag end: ", dropNode && dropNode.label, dropType);
      this.update();
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log("tree drop: ", dropNode.label, dropType);
    },
    allowDrop(draggingNode, dropNode) {
      return dropNode.data.label !== "二级 3-1";
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf("三级 3-1-1") === -1;
    }
  },
  mounted: function(res) {
    //   getJson
    this.planid = this.$route.query.id;
    this.api.todo.getJsonById({ id: this.planid }).then(res => {
      console.log(res);
      this.jsondata = res.data.jsondata;
      // this.getPlanList()
    });
    // 获取到 planid
  }
};
</script>
<style>
.custom-tree-node {
  width: 100%;
}
</style>


