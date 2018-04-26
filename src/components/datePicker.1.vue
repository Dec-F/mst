<template>
  <div class="select-list">
    <div class="right">
      <span>
        <el-date-picker :clearable="false" :editable="false" v-show="dateTypeVal === 'month'" v-model="dateVal" type="month" placeholder="选择月" @change="changeMonth" :picker-options="monthOption">
        </el-date-picker>
      </span>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'date-picker',
  props: {
    startDate: String,
    endDate: String,
    showLimit: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 4
    },
    type: {
      type: String,
      default: 'week'
    }
  },
  data() {
    return {
      dateTypeVal: this.type,
      date: [
        {
          label: '周',
          value: 'week'
        },
        {
          label: '月',
          value: 'month'
        }
      ],
      dataLimitVal: this.limit,
      dateVal: this.startDate,
      formatDateVal: '',
      weekOption: {},
      monthOption: {}
    }
  },
  computed: {
    filterLimit() {
      if (this.dateTypeVal === 'week') {
        return 12
      } else {
        return 6
      }
    }
  },
  watch: {
    limit(val) {
      this.dataLimitVal = val;
    },
    type(val) {
      this.loaderDate();
      this.dateTypeVal = val;
    },
    dateTypeVal(val) {
      this.dataLimitVal = 4;
      this.loaderDate();
      this.dateVal = this.endDate;
      this.$emit('change-date-type', val);
    },
    dateVal(val) {
      this.$emit('change-date', val)
    },
    startDate(val) {
      this.dateVal = val;
      this.loaderDate();
    },
    endDate(val) {
      this.dateVal = val;
      this.loaderDate();
    }
  },
  methods: {
    changeDateType(val) {
      this.dateTypeVal = val;
    },
    changeDateLimit(val) {
      this.dataLimitVal = val;
      this.$emit('change-date-limit', val);
    },
    changeMonth(val) {
      this.formatDateVal = val.replace(/\-/g, '');
      this.$emit('change-month-date', this.formatDateVal)
    },
    changeWeek(val) {
      this.formatDateVal = val.replace(/\u5468|\u7b2c/g, '');
      this.$emit('change-week-date', this.formatDateVal);
    },
    loaderDate() {
      this.loaderWeekDate();
      this.loaderMonthDate();
    },
    loaderWeekDate() {
      const startTimeNum = new Date(this.startDate) - (3600 * 1000 * 24 * 1);
      const endTimeNum = new Date(this.endDate);
      const nowTimeNum = Date.now();
      this.weekOption = {
        firstDayOfWeek: 1,
        disabledDate(time) {
          if (time.getTime() >= endTimeNum) {
            return time.getTime() > endTimeNum;
          } else if (time.getTime() <= startTimeNum) {
            return time.getTime() < startTimeNum;
          }
        }
      }
    },
    loaderMonthDate() {
      const startTimeNum = new Date(this.startDate) - (3600 * 1000 * 24 * 1);
      const endTimeNum = new Date(this.endDate);
      const nowTimeNum = Date.now();
      this.monthOption = {
        disabledDate(time) {
          if (time.getTime() >= endTimeNum) {
            return time.getTime() > endTimeNum;
          } else if (time.getTime() <= startTimeNum) {
            return time.getTime() < startTimeNum;
          }
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.el-button--success {
    width: 120px;
    height: 30px;
    line-height: 5px;
    vertical-align: middle;
}

.el-radio-button__inner {
  border: 1px solid #c7d9bf;
}



.right {
  .el-radio-button__inner {
    margin-bottom: 0px;
    line-height: 6px;
  }
}

.el-date-editor {
  .el-icon-date {
    line-height: 30px;
  }
}
</style>
