<template>
  <div class="app-container">
   <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />
   <el-button type="text" @click="addOneLevelDialog">添加一级分类</el-button>
   <el-tree
      ref="subjectTree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      class="filter-tree"
      default-expand-all
      node-key="id">
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <!-- 使用Chrome的Vue插件调试 -->
          <el-button
            v-if="node.level == 1"
            type="text"
            size="mini"
            @click="() => {dialogFormVisible = true; subject.parentId = data.id}">添加二级分类</el-button>
          <el-button
            v-if="node.level == 2 || node.level == 1"
            type="text"
            size="mini"
            @click="() => remove(node, data)">删除</el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog :visible.sync="dialogFormVisible" title="添加分类">
        <el-form :model="subject" label-width="120px">
            <el-form-item label="分类标题">
                <el-input v-model="subject.title"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="appendSubject()">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import subject from '@/api/subject'
export default {

  data() {
    return {
      filterText: '',
      subjectList: [],
      dialogFormVisible: false,
      subject: {
          title:'',
          parentId:''
      },
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.subjectTree.filter(val)
    }
  },

  created() {
    this.fetchNodeList()
  },

  methods: {
        // 添加分类
        appendSubject(){
          // 判断是一级分类，还是二级分类  根据  parentId
          if(!this.subject.parentId){
            this.appendLevelOne()
          }else{
            this.appendLevelTwo()
          }
        },
        // 增加二级分类
        appendLevelTwo(){
           subject.addSubjectTwo(this.subject)
           .then(response =>{
              this.$message({
                  type: 'success',
                  message: '添加分类成功!'
              })
              // 关闭弹框
              this.dialogFormVisible = false
              // 清空表单内容
              this.subject.title = ''
              this.subject.parentId = ''
              // 刷新整个页面
              this.fetchNodeList()
           })
           .catch(response =>{
               this.$message({
                  type: 'error',
                  message: '添加分类失败!'
              })
           })
        },
        // 增加一级分类
        appendLevelOne(){
           subject.addSubjectOne(this.subject)
           .then(response =>{
              this.$message({
                  type: 'success',
                  message: '添加分类成功!'
              })
              // 关闭弹框
              this.dialogFormVisible = false
              // 清空表单内容
              this.subject.title = ''
              this.subject.parentId = ''
              // 刷新整个页面
              this.fetchNodeList()
           })
           .catch(response =>{
               this.$message({
                  type: 'error',
                  message: '添加分类失败!'
              })
           })
        },
        // 点击一级分类,出现增加弹框
        addOneLevelDialog(){
            this.dialogFormVisible = true
        },
        // 删除分类的方法
        remove(node, data){
            this.$confirm('此操作将永久刪除该分类的信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    //调用方法进行删除
                    //return 表示后面then还会执行
                    return subject.removeSubjectById(data.id)
                }).then(() => {
                    //刷新整个页面
                    // this.fetchNodeList()
                    // 删除节点（效率高）
                    this.$refs.subjectTree.remove(node)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                }).catch(response => {
                    //判断点击取消，还是删除失败
                    if (response === 'cancel') {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: '删除失败'
                        })
                    }    
                })
        },

        fetchNodeList() {
        subject.getNestedTreeList().then(response => {
            if (response.success === true) {
            this.subjectList = response.data.items
            }
        })
        },
        filterNode(value, data) {
        if (!value) return true
        return data.title.indexOf(value) !== -1
        }
  }
}
</script>