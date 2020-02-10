import request from '@/utils/request'

export default {

    // 得到所有的大纲信息
    getAllChapterVideo(id) {
        return request({
            url: '/eduService/edu-chapter/getChapterVideoList/' + id,
            method: 'get',
        })
    },

    // 添加章节
    addChapter(chapter){
        return request({
            url: '/eduService/edu-chapter/addChapter',
            method: 'post',
            data: chapter
        })
    },

    // 根据ID查询
    getChapterInfo(chapterId){
        return request({
            url: '/eduService/edu-chapter//getChapterInfo/' + chapterId,
            method: 'get'
        })
    },

    // 更新章节信息
    updateChapter(chapter){
        return request({
            url: '/eduService/edu-chapter/updateChapter',
            method: 'post',
            data: chapter
        })
    },

    // 删除
    deleteByChapterId(chapterId){
        return request({
            url: '/eduService/edu-chapter/' + chapterId,
            method: 'delete'
        })
    },
}