<template>
  <div class="picker">
    <div class="picker-channel">
      <label class="picker-label" for="picker-select">当前{{ type === 'channel' ? '渠道' : 'APP' }}</label>
      <img class="picker-channel-logo" :src="logoSrc">
      <el-select
        v-if="type === 'channel'"
        class="picker-select"
        id="picker-select"
        v-model="option"
        placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.name + item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select
        v-if="type === 'app'"
        class="picker-select"
        id="picker-app-select"
        filterable
        :filter-method="selectFilter"
        default-first-option
        v-model="option"
        placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.name + item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="picker-date">
      <label class="picker-label">时间选择</label>
      <el-date-picker
        v-model="date"
        :default-time="defDate"
        type="month"
        value-format="yyyy-MM"
        placeholder="选择月"
        :picker-options="{ disabledDate }"
        v-on:change="vaildDate">
      </el-date-picker>
    </div>
    <div class="picker-confirm picker-button" @click="submit">确定</div>
  </div>
</template>

<script>
import axios from 'axios';
import api from '@/api/api';
const defaultLogo = '/static/img/blank.png';

function dateInRange(val, start, end) {
  const valDateStamp = new Date(val).getTime();
  const startDateStamp = new Date(start).getTime();
  const endDateStamp = new Date(end).getTime();
  return valDateStamp >= startDateStamp && valDateStamp <= endDateStamp;
}

export default {
  name: 'appPortrayalPicker',
  data () {
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth();
    const defDate = `${year}-${month > 9 ? month : `0${month}`}`;
    return {
      _options: [],
      options: [],
      option: '',
      defDate,
      date: defDate,
      dateRange: {}
    }
  },
  props: {
    type: {
      type: String,
      default: 'channel'
    }
  },
  created() {
    this.updateData();
  },
  computed: {
    logoSrc() {
      for (var i = 0, len = this.options.length; i < len; i ++) {
        const item = this.options[i];
        if (item.id === this.option) {
          return item.logo || defaultLogo;
        }
      }
      return defaultLogo;
    },
  },
  watch: {
    '$route': function () {
      this.options = [];
      this.option = '';
      this.updateData();
    }
  },
  methods: {
    updateData() {
      const axiosGetDate = api.getPortraitTime().then(res => {
        if (!res.data) return;
        const start = res.data.start.slice(0, 7);
        const end = res.data.end.slice(0, 7);
        this.dateRange = {
          start,
          end
        };
        this.defDate = end;
        this.date = end;
      });
      const axiosGetOption = api.findAppChannelCount().then(res => {
        if (!res.data) return;
        const type = this.type;
        const filterList = res.data.filter(v => v.type === type);
        if (type === 'channel') {
          this.options = filterList;
        } else if (type === 'app') {
          this.options = filterList.length ? filterList.slice(0, 30) : [];
          this._options = filterList;
        }
        this.option = this.options.length ? this.options[0].id : '';
       });
      axios.all([axiosGetDate, axiosGetOption])
        .then(_ => {
          this.$emit('submit', {
            date: this.date,
            option: this.option
          });
        });
    },
    disabledDate(date) {
      const start = this.dateRange.start;
      const end = this.dateRange.end;
      return !dateInRange(date, start, end);
    },
    selectFilter(val) {
      this.options = this._options.filter(v => v.name.indexOf(val) >= 0 || v.id == val);
    },
    vaildDate(val) {
      const start = this.dateRange.start;
      const end = this.dateRange.end;
      if (!dateInRange(val, start, end)) {
        this.date = this.defDate;
        alert(`时间选择不能超出范围：${start}~${end}`);
        return false;
      }
      return true;
    },
    vaildOption(val) {
      if (!val) {
        alert(`请选择${this.type === 'channel' ? '渠道' : 'APP'}`);
        return false
      }
      return true;
    },
    vaild() {
      return this.vaildOption(this.option) && this.vaildDate(this.date);
    },
    submit() {
      if (!this.vaild()) return;
      this.$emit('submit', {
        date: this.date,
        option: this.option
      });
    }
  }
}

</script>

<style lang="less">
.picker {
  display: flex;
}
.picker-button,
.picker-label {
  width: 120px;
  min-width: 120px;
  height: 36px;
  background-color: #f2f2f2;
  text-align: center;
  line-height: 36px;
}
.picker-button {
  cursor: pointer;
}
.picker-label {
  margin-right: 20px;
}
.picker-channel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #e5e5e5;
}
.picker-channel-logo {
  display: block;
  width: 36px;
  height: 36px;
}
.picker-select {
  margin-left: 10px;
  margin-right: 30px;
}
.picker-date {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.picker-confirm {
  flex: none;
  margin: 0 20px;
}
.picker-confirm.picker-button {
  color: #fff;
  background-color: #69c72b;
  letter-spacing: 4px;
}
.picker{
  .el-input--suffix .el-input__inner{
    border:none;
  }
}
.picker .el-input--prefix .el-input__inner{
  padding-left:50px
}

</style>
