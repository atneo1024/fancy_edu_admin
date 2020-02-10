<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-form label-width="120px">

    <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
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

    <!-- 课程讲师 -->
    <el-form-item label="课程讲师">
    <el-select
        v-model="courseInfo.teacherId"
        placeholder="请选择">
        <el-option
        v-for="teacher in teacherList"
        :key="teacher.id"
        :label="teacher.name"
        :value="teacher.id"/>
    </el-select>
    </el-form-item>

    <el-form-item label="总课时">
        <el-input-number :min="1" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
    </el-form-item>

    <!-- 课程简介-->
    <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
    </el-form-item>

    <!-- 课程封面-->
    <el-form-item label="课程封面">
        <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="BASE_API+'/eduService/edu-file/uploadFile?host=cover'"
            class="avatar-uploader">
            <img :src="courseInfo.cover" :width="300">
        </el-upload>
    </el-form-item>

    <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
    </el-form-item>

    <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
    </el-form-item>
    </el-form>
  </div>
</template>
<script>

import course from '@/api/course'
import subject from '@/api/subject'
import Tinymce from '@/components/Tinymce'

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
    // 声明
    components :{ Tinymce },
    data() {
        return {
        // 保存按钮是否禁用
        saveBtnDisabled: false,
        // 存储讲师信息
        teacherList:[],
        // 一级分类
        oneLevelSubjectList: [],
        // 二级分类
        twoLevelSubjectList: [],
        courseInfo: defaultForm,
        BASE_API: process.env.BASE_API // 接口API地址
        };
    },
  // 监听
  watch: {
    $route(to, from) {
      console.log('watch $route')
      this.init()
    }
  },
  created() {
    console.log("info created");
    this.init()
  },

  methods: {
      // 初始化
      init(){
          // 判断路由中是否有ID 
          if (this.$route.params && this.$route.params.id){
              // 如果有ID,根据Id做回显 
              const id = this.$route.params.id
              // 根据ID 查询，
              this.getCouresInfoById(id)
          }else {
              // 没有ID,则清空表单
              this.courseInfo = { ...defaultForm}
              // 获取所有讲师
              this.getAllTeacher()
              // 获取所有一级分类信息
              this.getAllSubjetList()
          }
      },

      // 根据ID查询课程信息
      getCouresInfoById(id){
          console.log("---------getCourseInfoById" + id)
          course.getCourseInfoById(id)
              .then(response =>{
                  console.log("---------success:" + response)
                  this.courseInfo = response.data.courseInfo
                  // 1、查询出所有一级分类
                  subject.getNestedTreeList()
                  .then(response =>{
                      this.oneLevelSubjectList = response.data.items
                      // 2、便利一级分类的集合
                      for (var i = 0; i < this.oneLevelSubjectList.length; i++){
                          // 3、获取每个一级分类
                          var levelOne = this.oneLevelSubjectList[i]
                          // 4、判断 每个一级分类的 ID 和 课程所属的一级分类ID 是否相同
                          if (levelOne.id === this.courseInfo.subjectParentId){
                              // 5、获取该一级分类的 二级分类
                              this.twoLevelSubjectList = levelOne.children
                          }
                      }
                  })
                  // 获取所有讲师
                  this.getAllTeacher()
              })
              .catch(response =>{
                  this.$message.error('查询数据失败')
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

      // 上传封面之前
      beforeAvatarUpload(file){
          // 允许的图片格式、大小
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },

      // 上传封面成功之后
      handleAvatarSuccess(res, file){
          // 上传成功之后，获取OSS图片路径
          this.courseInfo.cover = res.data.path
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

      next() {
        // 判断是添加还是修改， 判断课程对象中是否有ID
        if (!this.courseInfo.id){
            // 添加
            this.addCourse()
        }else {
            // 修改
            this.updateCourse()
        }
      },

      // 修改课程
      updateCourse(){
        course.updateCourseInfo(this.courseInfo)
        .then(response =>{
            this.$message({
                type: 'success',
                message: '修改课程成功!'
            })
            // 路由跳转
            console.log("next");
            this.$router.push({ path: "/course/chapter/" + this.$route.params.id });
        })
        .catch(response =>{
            this.$message({
                type: 'error',
                message: '修改课程失败!'
            })
        })
      },

      // 添加课程
      addCourse(){
        console.log("---addCourse" + this.courseInfo)
        // 调用保存方法
        course.addCourseInfo(this.courseInfo)
        .then(response =>{
            this.$message({
                type: 'success',
                message: '添加课程成功!'
            })
            // 路由跳转
            console.log("next");
            this.$router.push({ path: "/course/chapter/" + response.data.courseId });
        })
        .catch(response =>{
            this.$message({
                type: 'error',
                message: '添加课程失败!'
            })
        })
      }
  }
};
</script>
<style scoped>
    .tinymce-container {
    line-height: 29px;
    }
</style>