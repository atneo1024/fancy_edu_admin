import request from '@/utils/request'

export default {

    // 获取嵌套数据
    addCourseInfo(courseInfo) {
        return request({
            url: '/eduService/edu-course/addCourseInfo',
            method: 'post',
            data: courseInfo
        })
    },
    // 查询所有讲师,显示到下拉列表
    getAllTeacher() {
        return request({
            url: '/eduService/edu-teacher/getAllTeacher',
            method: 'get'
        })
    },
    // 根据ID 查询课程信息
    getCourseInfoById(id){
        return request({
            url: '/eduService/edu-course/getCourseInfo/' + id,
            method: 'get',
        })
    },
    // 修改课程信息
    updateCourseInfo(courseInfo){
        return request({
            url: '/eduService/edu-course/updateCourseInfo',
            method: 'post',
            data: courseInfo
        })
    },
    // 查询所有课程
    getAllCourseInfo(){
        return request({
            url: '/eduService/edu-course/listCourse',
            method: 'get',
        })
    },
    // 删除课程信息
    deleteCourseInfoById(id){
        return request({
            url: '/eduService/edu-course/deleteCourse/' + id,
            method: 'delete'
        })
    }
}