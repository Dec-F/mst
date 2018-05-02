<template>
  <div class="select-list">
    <div class="left">
      时间筛选
    </div>
    <div class="right">
      <span>
        <el-radio-group v-model="dateTypeVal" @change="changeDateType">
          <el-radio-button v-for="item in date" :key="item.value" :label="item.value">{{item.label}}
          </el-radio-button>
        </el-radio-group>
      </span>
      <span v-if="dateTypeVal === 'month'">
        <el-date-picker :clearable="false" :editable="false" v-model="dateValFormat" type="month" placeholder="选择月" @change="changeMonth" :picker-options="monthOption">
        </el-date-picker>
      </span>
      <span v-if="dateTypeVal === 'week'">
        <el-date-picker :clearable="false" :editable="false" v-model="dateValFormat" type="week" format="yyyy第WW周" placeholder="选择周" :picker-options="weekOption" @change="changeWeek">
        </el-date-picker>
      </span>
      <span v-if="showLimit">
        <span class="limit">
          <el-select size="medium" v-model="dataLimitVal" placeholder="请选择" @change="changeDateLimit">
            <el-option v-for="item in filterLimit" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </span>
      </span>

      <slot></slot>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
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
      value3: '',
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
      dateValFormat: new Date(this.endDate),
      formatDateVal: '',
      weekOption: {},
      monthOption: {}
    };
  },
  computed: {
    filterLimit() {
      if (this.dateTypeVal === 'week') {
        return this.calcOptions(12, '周');
      } else {
        return this.calcOptions(6, '月');
      }
    }
  },
  mounted() {
    this.loaderDate();
  },
  methods: {
    changeDateType(val) {
      this.dateTypeVal = val;
      if (this.dateTypeVal === 'week') {
        this.changeWeek();
      } else {
        this.changeMonth();
      }
      this.$emit('change-date-type', val);
    },
    changeDateLimit(val) {
      this.dataLimitVal = val;
      this.$emit('change-date-limit', val);
    },
    changeMonth(val) {
      this.dateValFormat = new Date(val);
      this.dateVal = moment(val).format('YYYYMMDD');
      this.$emit('change-month-date', this.dateVal);
    },
    changeWeek(val) {
      this.dateValFormat = new Date(val);
      this.dateVal = moment(val).format('YYYYWW');
      this.$emit('change-week-date', this.dateVal);
    },
    loaderDate() {
      this.loaderWeekDate();
      this.loaderMonthDate();
    },
    loaderWeekDate() {
      const startTimeNum = new Date(this.startDate) - 3600 * 1000 * 24 * 1;
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
      };
    },
    loaderMonthDate() {
      const startTimeNum = new Date(this.startDate) - 3600 * 1000 * 24 * 1;
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
      };
    },
    calcOptions(num, str) {
      return Array.from(new Array(num)).map((v, i) => {
        return {
          value: i + 1,
          label: `之前${i + 1}${str}数据`
        };
      });
    }
  }
};
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

.el-date-editor.el-input {
  width: 180px;
  .el-icon-date {
    line-height: 30px;
  }
}
.el-input--suffix .el-input__inner {
  height: 30px;
}
.el-date-editor .el-input__inner {
  height: 30px;
  width: 180px;
}
</style>
