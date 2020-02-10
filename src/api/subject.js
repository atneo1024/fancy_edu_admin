import request from '@/utils/request'

const api_name = '/subject/list'

export default {

    // 获取嵌套数据
    getNestedTreeList() {
        return request({
            url: '/eduService/edu-subject/nestedList',
            method: 'get'
        })
    },
    
    // 删除
    removeSubjectById(id) {
        return request({
            url: '/eduService/edu-subject/' + id,
            method: 'delete'
        })
    },
    // 添加一级分类
    addSubjectOne(subject) {
        return request({
            url: '/eduService/edu-subject/addOneLevel',
            method: 'post',
            data: subject
        })
    },
    // 添加二级分类
    addSubjectTwo(subject) {
        return request({
            url: '/eduService/edu-subject/addTwoLevel',
            method: 'post',
            data: subject
        })
    }
}