import request from '@/utils/request'

export default {

    // 添加小节
    addVideo(video){
        return request({
            url: '/eduService/edu-video/addVideo',
            method: 'post',
            data: video
        })
    },

    // 根据ID查询
    getVideoInfo(videoId){
        return request({
            url: '/eduService/edu-video//getVideoInfo/' + videoId,
            method: 'get'
        })
    },

    // 更新小节信息
    updateVideo(video){
        return request({
            url: '/eduService/edu-video/updateVideo',
            method: 'post',
            data: video
        })
    },

    // 删除
    deleteByVideoId(videoId){
        return request({
            url: '/eduService/edu-video/' + videoId,
            method: 'delete'
        })
    },
}