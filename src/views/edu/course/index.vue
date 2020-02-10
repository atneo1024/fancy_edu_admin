<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item label="课程标题">
        <el-input v-model="searchObj.name" placeholder="课程标题"/>
      </el-form-item>

    <!-- 所属分类：级联下拉列表 -->
    <el-form-item label="课程类别">
        <!-- 一级分类 -->
        <el-select
            v-model="courseInfo.subjectParentId"
            placeholder="请选择" @change="subjectLevelOneChange">
            <el-option
            v-for="subject in oneLevelSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
            <el-option
                v-for="subject in twoLevelSubjectList"
                :key="subject.value"
                :label="subject.title"
                :value="subject.id"/>
        </el-select>     
    </el-form-item>  

    <!-- 讲师 -->
    <el-form-item label ="讲师姓名">
      <el-select
        v-model="searchObj.teacherId"
        placeholder="请选择讲师">
        <el-option
          v-for="teacher in teacherList"
          :key="teacher.id"
          :label="teacher.name"
          :value="teacher.id"/>
      </el-select>
    </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getListTeacher()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
      row-class-name="myClassList">

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{  scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="课程信息" width="470" align="center">
        <template slot-scope="scope">
          <div class="info">
            <div class="pic">
              <img :src="scope.row.cover" alt="scope.row.title" width="150px">
            </div>
            <div class="title">
              <a href="">{{ scope.row.title }}</a>
              <p>{{ scope.row.lessonNum }}课时</p>
            </div>
          </div>

        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.gmtCreate.substr(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.gmtModified.substr(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column label="价格" width="100" align="center" >
        <template slot-scope="scope">
          {{ Number(scope.row.price) === 0 ? '免费' :
          '¥' + scope.row.price.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="buyCount" label="付费学员" width="100" align="center" >
        <template slot-scope="scope">
          {{ scope.row.buyCount }}人
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/course/info/'+scope.row.id">
            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
          </router-link>
          <router-link :to="'/edu/course/chapter/'+scope.row.id">
            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

<!-- 分页 -->


   <!-- TODO 分页 -->

  </div>
</template>

<script>
import teacher from '@/api/teacher'
import course from '@/api/course'
import subject from '@/api/subject'

const defaultForm = {
    title: '',
    subjectParentId:'',
    subjectId: '',
    teacherId: '',
    lessonNum: 0,
    description: '',
    cover: 'https://fancy-edu-file.oss-cn-beijing.aliyuncs.com/public/20191027062736.jpg',
    price: 0
}

export default {
    //定义变量和初始值
    data() {
        return {
            listLoading: true, // 是否显示loading信息
            list: null, //每页数据list集合
            total: 0, //总记录数
            page: 1,//当前页
            limit: 10,//每页显示记录数
            searchObj:{},//条件封装对象
            // 存储讲师信息
            teacherList:[],
            // 一级分类
            oneLevelSubjectList: [],
            // 二级分类
            twoLevelSubjectList: [],
            courseInfo: defaultForm,
        }
    },
    //在页面渲染之前调用，调用具体的某个方法
    created () {
        console.log("index created");
        this.init()
    },
    //写具体的方法调用
    methods: {
        init(){
            // 获取所有讲师
            this.getAllTeacher()
            // 获取所有一级分类信息
            this.getAllSubjetList()
            // 获取列表
            this.getAllCourse()
        },
        // 根据Id 删除课程信息
        removeDataById(id){
            this.$confirm('此操作将永久刪除该课程信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                //调用方法进行删除
                //return 表示后面then还会执行
                return course.deleteCourseInfoById(id)
            }).then(() => {
                //刷新整个页面
                this.getAllCourse()
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
                  console.log(response)
                    this.$message({
                        type: 'error',
                        message: '删除失败'
                    })
                }        
            })
        },
        // 获取所有课程信息
        getAllCourse(){
          course.getAllCourseInfo()
          .then(response =>{
            this.list = response.data.items
            this.listLoading = false

          })
          .catch(response =>{

          })
        },

        // 触发 change 事件，显示一级分类的二级分类
        subjectLevelOneChange(value){
            // 获取选择一级分类的 ID 值
            console.log("change" + value)
            // 根据一级分类的 ID 获取二级分类
            // 1、遍历一级分类集合
            for (var i = 0; i < this.oneLevelSubjectList.length; i++){
                // 2、获取每个一级分类
                var levelOne = this.oneLevelSubjectList[i]
                // 3、判断 value 的值和遍历出来的ID 值是否一样
                if (levelOne.id === value){
                    // 如果一样，则获取其 二级分类 child
                    this.twoLevelSubjectList = levelOne.children
                    this.courseInfo.subjectId = ''
                }
            }
        },

        // 获取所有分类信息
        getAllSubjetList(){
            subject.getNestedTreeList()
            .then(response =>{
                this.oneLevelSubjectList = response.data.items
            })
            .catch(response =>{

            })
        },

        // 获取所有讲师
        getAllTeacher(){
            course.getAllTeacher()
            .then(response =>{
                console.log(response)
                this.teacherList = response.data.items
            })
            .catch(response =>{

            })
        },
    }
}
</script>
