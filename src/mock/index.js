import Mock from 'mockjs';

// 获取渠道
Mock.mock(/findAppChannelCount\?type=channel/ig, {
  "resMsg": "success",
  "resCode": 200,
  "data": [
    {
      "id": 15579,
      "name": "财联社",
      "icon": "http://s1.xmcdn.com/css/img/common/default/user260.jpg",
      "type": "app"
    },
    {
      "id": 18,
      "name": "12306订票助手",
      "icon": "http://s1.xmcdn.com/css/img/common/default/user720.jpg",
      "type": "app"
    }
  ]
})

// 获取可查询留存的合法时间段
Mock.mock(/findKeepDate/ig, {
  "resMsg": "success",
  "resCode": 200,
  "data": [
    {
      "start": "2018-01-01",
      "end": "2018-01-05"
    }
  ]
})

// 获取渠道留存数据
Mock.mock(/findChannelKeep/ig, {
  "resMsg": "success",
  "resCode": 200,
  "data": {
    "topNAsc": null,
    "topNDesc": null,
    "tableHeader": [
      {
        "column": "index",
        "columnName": "序号",
        "status": null,
        "orderColumn": null,
        "children": null,
        "limit": null
      },
      {
        "column": "dateTime",
        "columnName": "时间",
        "status": null,
        "orderColumn": null,
        "children": null,
        "limit": null
      },
      {
        "column": "yesterday_keep",
        "columnName": "次日留存",
        "status": null,
        "orderColumn": null,
        "children": null,
        "limit": null
      },
      {
        "column": "three_keep",
        "columnName": "3日留存",
        "status": null,
        "orderColumn": null,
        "children": null,
        "limit": null
      },
      {
        "column": "seven_keep",
        "columnName": "7日留存",
        "status": null,
        "orderColumn": null,
        "children": null,
        "limit": null
      },
      {
        "column": "fourteen_keep",
        "columnName": "14日留存",
        "status": null,
        "orderColumn": null,
        "children": null,
        "limit": null
      },
      {
        "column": "thirty_keep",
        "columnName": "30日留存",
        "status": null,
        "orderColumn": null,
        "children": null,
        "limit": null
      }
    ],
    "tableData": [
      {
        "index": 1,
        "id": null,
        "dateTime": "2018-01-04",
        "yesterday_keep": "0.406484408000000019",
        "three_keep": "46.9902613000000002",
        "seven_keep": "27.8549258900000005",
        "fourteen_keep": "0.571779791999999953",
        "thirty_keep": "20.0653224600000009"
      },
      {
        "index": 2,
        "id": null,
        "dateTime": "2018-01-03",
        "yesterday_keep": "69.3373680400000012",
        "three_keep": "24.5478521000000001",
        "seven_keep": "37.0548041899999987",
        "fourteen_keep": "25.1223577999999996",
        "thirty_keep": "58.5975715599999987"
      },
      {
        "index": 3,
        "id": null,
        "dateTime": "2018-01-02",
        "yesterday_keep": "70.3121543700000018",
        "three_keep": "75.3215431200000012",
        "seven_keep": "1.73330479500000001",
        "fourteen_keep": "51.8996116699999988",
        "thirty_keep": "31.2126240599999996"
      },
      {
        "index": 4,
        "id": null,
        "dateTime": "2018-01-01",
        "yesterday_keep": "15.0968886999999992",
        "three_keep": "10.2328383299999999",
        "seven_keep": "56.7057861899999978",
        "fourteen_keep": "11.1271342400000002",
        "thirty_keep": "56.1600024500000004"
      }
    ],
    "tableSum": null,
    "tablePage": {
      "pageNo": 1,
      "pageSize": 10,
      "total": 40
    },
    "echarts": {
      "xAxis": [],
      "line": []
    },
    "dateTimes": null
  }
})

// 获取app留存数据
Mock.mock(/findAppKeep/ig, {
  "resMsg": "success",
  "resCode": 200,
  "data": {
    "topNAsc": null,
    "topNDesc": null,
    "tableHeader": [
      {
        "column": "index",
        "columnName": "序号",
        "status": null,
        "orderColumn": null,
        "children": null,
        "limit": null
      },
      {
        "column": "dateTime",
        "columnName": "时间",
        "status": null,
        "orderColumn": null,
        "children": null,
        "limit": null
      },
      {
        "column": "yesterday_keep",
        "columnName": "次日留存",
        "status": null,
        "orderColumn": null,
        "children": null,
        "limit": null
      },
      {
        "column": "three_keep",
        "columnName": "3日留存",
        "status": null,
        "orderColumn": null,
        "children": null,
        "limit": null
      },
      {
        "column": "seven_keep",
        "columnName": "7日留存",
        "status": null,
        "orderColumn": null,
        "children": null,
        "limit": null
      },
      {
        "column": "fourteen_keep",
        "columnName": "14日留存",
        "status": null,
        "orderColumn": null,
        "children": null,
        "limit": null
      },
      {
        "column": "thirty_keep",
        "columnName": "30日留存",
        "status": null,
        "orderColumn": null,
        "children": null,
        "limit": null
      }
    ],
    "tableData": [
      {
        "index": 1,
        "id": null,
        "dateTime": "2018-01-04",
        "yesterday_keep": "0.406484408000000019",
        "three_keep": "46.9902613000000002",
        "seven_keep": "27.8549258900000005",
        "fourteen_keep": "0.571779791999999953",
        "thirty_keep": "20.0653224600000009"
      },
      {
        "index": 2,
        "id": null,
        "dateTime": "2018-01-03",
        "yesterday_keep": "69.3373680400000012",
        "three_keep": "24.5478521000000001",
        "seven_keep": "37.0548041899999987",
        "fourteen_keep": "25.1223577999999996",
        "thirty_keep": "58.5975715599999987"
      },
      {
        "index": 3,
        "id": null,
        "dateTime": "2018-01-02",
        "yesterday_keep": "70.3121543700000018",
        "three_keep": "75.3215431200000012",
        "seven_keep": "1.73330479500000001",
        "fourteen_keep": "51.8996116699999988",
        "thirty_keep": "31.2126240599999996"
      },
      {
        "index": 4,
        "id": null,
        "dateTime": "2018-01-01",
        "yesterday_keep": "15.0968886999999992",
        "three_keep": "10.2328383299999999",
        "seven_keep": "56.7057861899999978",
        "fourteen_keep": "11.1271342400000002",
        "thirty_keep": "56.1600024500000004"
      }
    ],
    "tableSum": null,
    "tablePage": {
      "pageNo": 1,
      "pageSize": 10,
      "total": 4
    },
    "echarts": {
      "xAxis": [],
      "line": []
    },
    "dateTimes": null
  }
})
