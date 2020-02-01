import request from '@/utils/request' // 模板提供的组件

export default {
    // 分页条件查询
    getTeacherPageList(page, limit, searchObj){
        return request({
            url: '/eduService/edu-teacher/moreConditionPageList/' + page + '/' + limit,
            // 提交方式
            method: 'post',
            // 传递条件对象，如果传递 json数据，使用data
            data: searchObj
        })
    },
    deleteTeacherById(id){
        return request({
            url: '/eduService/edu-teacher/' + id,
            method: 'delete'
        })
    },
    saveTeacher(teacher){
        return request({
            url: '/eduService/edu-teacher/addTeacher',
            method: 'post',
            data: teacher
        })
    },
    getTeacherById(id){
        return request({
            url: '/eduService/edu-teacher/getTeacherInfoById/' + id,
            method: 'get'
        })  
    },
    updataTeacher(teacher){
        return request({
            url: '/eduService/edu-teacher/updateTeacher',
            method: 'post',
            data: teacher
        })  
    }
}
