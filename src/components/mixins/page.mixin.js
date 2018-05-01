import api from '@/api/api';
import trend from '@/components/trend';
import datePicker from '@/components/datePicker';
import search from '@/components/search';
import trendChart from '@/components/trendChart';
import moment from 'moment';
import {formatUrl} from 'utils';
const typeMap = {
    download: 1,
    xinzhuang: 2,
    huoyue: 3
};
export default {
    components : {
        trend,
        datePicker,
        search,
        trendChart
    },
    data() {
        return {
            loading: false,
            searchValue: '',
            dateTypeVal: 'week',
            startDate: null,
            endDate: null,
            dataLimitVal: 4,
            dateVal: '',
            switchVal: false,
            currentPage: 1,
            pageSize: 10,
            orderColumn: '',
            orderType: 'descending',
            total: null,
            tableData: [],
            tableHeader: [],
            chartData: [],
            chartXAxis: [],
            searchData: [],
            searchId: null,
            searchType: null,
            searchLoading: false,
            count: false,
            tabType: 'all',
            orderBy: '',
            sortbyDateTime: ''
        };
    },
    created() {
        this.fetchDate();
    },
    computed : {
        filterData() {
            const val = this.inputVal;
            if (val) {
                return this
                    .mediaList
                    .filter(function (data) {
                        return Object
                            .keys(data)
                            .some(function (key) {
                                return (String(data[key]).toLowerCase().indexOf(val) > -1);
                            });
                    });
            }
            return this.mediaList;
        }
    },
    watch : {
        $route() {
            this.init();
        }
    },
    methods : {
        // 初始化数据
        init() {
            this.count = false;
            this.switchVal = false;
            this.dateTypeVal = 'week';
            this.dataLimitVal = 4;
            this.currentPage = 1;
            this.pageSize = 10;
            this.orderType = 'descending';
            this.orderColumn = '';
            this.tableHeader = [];
            this.fetchDate();
        },
        changeDateType(val) {
            this.dateTypeVal = val;
        },
        changeDateLimit(val) {
            this.dataLimitVal = val;
        },
        changeDate(val) {
            this.dateVal = val;
        },
        changeWeekDate(val) {
            this.dateVal = val;
        },
        changeMonthDate(val) {
            this.dateVal = val;
        },
        tabChange(name) {
            this.tabType = name;
            this.fetchTableData();
        },
        // 获取日期数据
        fetchDate() {
            api
                .date()
                .then(res => {
                    this.dateVal = moment(res.data.end).format('YYYYWW');
                    this.startDate = res.data.start;
                    this.endDate = res.data.end;
                    this.fetchTableData();
                });
        },
        // 获取表格数据
        fetchTableData() {
            this.loading = true;
            // 请求参数
            const params = {
                // 发送请求
                date: this.dateVal,
                dateType: this.dateTypeVal === 'week'
                    ? 1
                    : 2,
                type: typeMap[this.tabType],
                limit: this.dataLimitVal,
                pageNo: this.currentPage,
                pageSize: this.pageSize,
                orderType: this.orderType,
                orderColumn: this.orderColumn,
                sortby: this.orderBy,
                sortbyDateTime: this.sortbyDateTime
            };
            if (this.tabType === 'all') {
                api
                    .downloadTrend(params)
                    .then(res => {
                        this.loading = false;
                        this.count = true;

                        this.tableHeader = res.data.tableHeader || [];

                        this.tableData = res
                            .data
                            .tableSum
                            .concat(res.data.tableData) || [];

                        this.chartXAxis = res.data.echarts.xAxis || [];

                        this.chartData = res.data.echarts.line || [];

                        this.total = res.data.tablePage.total;
                    });
            } else {
                api
                    .eachTrend(params)
                    .then(res => {
                        this.loading = false;
                        this.count = true;

                        this.tableHeader = res.data.tableHeader || [];

                        this.tableData = res.data.tableData || [];

                        this.chartXAxis = res.data.echarts.xAxis || [];

                        this.chartData = res.data.echarts.line || [];

                        this.total = res.data.tablePage.total;
                    });
            }
        },
        submitData() {
            this.count = false;
            this.currentPage = 1;
            this.fetchTableData();
        },
        // 导出数据
        downloadData() {
            let url = '';
            let params = {};
            if (this.tabType === 'all') {
                path = 'http://113.200.91.81/mst/behavior/exportChannelTotalTrends';
                params = {
                    dateTime: this.dateVal,
                    dateType: this.dateTypeVal,
                    limit: this.dataLimitVal,
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    sort: this.orderType === 'descending'
                        ? 'desc'
                        : '',
                    sortby: this.orderColumn,
                    sortbyDateTime: this.sortbyDateTime
                };
            } else {
                path = 'http://113.200.91.81/mst/behavior/exportEachChannelTrend';
                params = {
                    type: typeMap[this.tabType],
                    date: this.dateVal,
                    dateType: this.dateTypeVal,
                    limit: this.dataLimitVal,
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    orderType: this.orderType,
                    orderColumn: this.orderColumn
                };
            }
            window.location.href = formatUrl(path, params);
        },
        handleSearch(val) {
            if (val.length) {
                this
                    .searchData
                    .filter(item => {});
            }
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.fetchTableData();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            if (this.count === true) {
                this.fetchTableData();
            }
        },
        changeSort(sort) {
            ///f:  hack.  elementUI切换排序连续点击进入默认状态是 会传入null
            if (!sort.order || !sort.prop) {
                return;
            }
            sort.order = sort.order
                ? sort.order
                : 'descending';
            this.orderType = sort.order;
            if (sort.prop.indexOf('--') > -1) {
                let sortArr = sort
                    .prop
                    .split('--');
                this.sortbyDateTime = sortArr[0];
                this.orderColumn = sortArr[1];
                this.orderBy = sortArr[1].indexOf('count') > -1
                    ? 'download_volume'
                    : 'ratio';
            }
            this.fetchTableData();
        },
        linkDetail(row) {
            console.log(row);
            this
                .$router
                .push({path: `${this.$route.meta.bread.path}/storeDetail/${row.id}/${row.name}`});
        }
    }
};