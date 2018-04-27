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
const findAppChannelCount = type => request({
  url: `https://www.easy-mock.com/mock/5ad0292c3a67ed0e5975eaae/mst_copy/findAppChannelCount?type=${type}`
});

// 获取可查询留存的合法时间段
const findKeepDate = () => request({
  url: 'https://www.easy-mock.com/mock/5ad0292c3a67ed0e5975eaae/mst_copy/findKeepDate'
});

// 获取渠道留存数据
const findChannelKeep = (channelId, startTime, endTime, pageNo, pageSize=10) => request({
  url: 'https://www.easy-mock.com/mock/5ad0292c3a67ed0e5975eaae/mst_copy/quality/findChannelKeep',
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
  url: 'https://www.easy-mock.com/mock/5ad0292c3a67ed0e5975eaae/mst_copy/appQuality/findAppKeep',
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




