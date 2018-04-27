<template>
  <div class="picker">
    <div class="picker-channel">
      <label class="picker-label" for="picker-select">当前{{ type === 'channel' ? '渠道' : 'APP' }}</label>
      <img v-if="type === 'app'" class="picker-channel-logo" :src="channelLogo">
      <el-select
        v-if="type === 'channel'"
        class="picker-select"
        id="picker-select"
        v-model="option"
        placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.name"
          :label="item.name + item.id"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select
        v-if="type === 'app'"
        class="picker-select"
        id="picker-app-select"
        filterable
        v-model="option"
        placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.name"
          :label="item.name + item.id"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="picker-date">
      <label class="picker-label">时间选择</label>
      <el-date-picker
        v-model="date"
        default-time="defDate"
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
const defaultChannelLogo = '/static/logo.png';

function dateInRange(val, start, end) {
  const valDateStamp = new Date(val).getTime();
  const startDateStamp = new Date(start).getTime();
  const endDateStamp = new Date(end).getTime();
  return valDateStamp > startDateStamp && valDateStamp < endDateStamp;
}

export default {
  name: 'appPortrayalPicker',
  data () {
    const nowDate = new Date();
    const defDate = `${nowDate.getFullYear()}-${nowDate.getMonth()}`;
    return {
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
    channelLogo() {
      this.options.forEach(v => {
        if (v.id === this.option) return v.img || defaultChannelLogo;
      });
      return defaultChannelLogo;
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
      const axiosGetDate = axios.get('/mst/dateTime/getDateTime').then(res => {
        if (!res.data || !res.data.data) return;
        this.dateRange = {
          start: res.data.data.start,
          end: res.data.data.end,
        };
      });
      const axiosGetOption = axios.get('/mst/findAppChannelCount').then(res => {
        if (!res.data || !res.data.data) return;
        const type = this.type;
        const filterList = res.data.data.filter(v => v.type === type);
        this.options = filterList;
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

<style scoped>
.picker {
  display: flex;
}
.picker-button,
.picker-label {
  width: 120px;
  min-width: 120px;
  height: 36px;
  border-radius: 4px;
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
</style>
