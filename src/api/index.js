import fetch from '@/utils/fetch';
const qs = require('querystring');

const setContentType = (contentType='application/x-www-form-urlencoded; charset=UTF-8') => {
	fetch.defaults.headers.post['Content-Type'] = contentType
}

const request = (obj, contentType) => {
	setContentType(contentType)
	return fetch(obj)
}

// 获取渠道
const findAppChannelCount = () => request({
  url: `/appchannel/findAppChannelCount`
});

// 获取可查询留存的合法时间段
const findKeepDate = () => request({
  url: '/quality/findKeepDate'
});

// 获取渠道留存数据
const findChannelKeep = (channelId, startTime, endTime, pageNo, pageSize=10) => request({
  url: '/quality/findChannelKeep',
  params: {
    channelId,
    startTime,
    endTime,
    pageNo,
    pageSize
  }
});

// 获取APP留存数据
const findAppKeep = (appId, startTime, endTime, pageNo, pageSize=10) => request({
  url: '/appQuality/findAppKeep',
  params: {
    appId,
    startTime,
    endTime,
    pageNo,
    pageSize
  }
});

export {
  findAppChannelCount,
  findKeepDate,
  findChannelKeep,
  findAppKeep
}




