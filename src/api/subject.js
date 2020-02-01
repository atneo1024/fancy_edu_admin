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
    }
}