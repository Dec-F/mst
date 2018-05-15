<template>
  <div>
    <div class="select-list top appname">
      <div class="left">
        APP类别
      </div>
      <div class="right">
        <div>
          <el-radio-group v-model="bigType">
            <el-radio-button v-for="item in data" :label="item.categoryId" :value="item.categoryId" :key="item.categoryId">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="select-list top" v-show="bigType !== 0">
      <div class="left">
      </div>
      <div class="right">
        <div class="rightBox">
          <!-- <el-checkbox-button v-model="checkAll" @change="selectAllType(checkAll)" style="float:left">
                全选
              </el-checkbox-button> -->
          <el-radio-group v-model="checkedType" @change="selectType">
            <el-radio-button v-for="item in smallTypeList" :label="item.subCategoryId" :value="item.subCategoryId" :key="item.subCategoryId">{{ item.label }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'select-app-type',
  props: {
    data: Array,
    value: [Number, String]
  },
  data() {
    return {
      bigType: this.value,
      checkedType: [],
      typeList: [],
      smallTypeList: [],
      checkAll: false,
    }
  },
  watch: {
    bigType(val) {
      if (val) {
        this.checkAll = false;
        this.checkedType = []
      }
      this.data.forEach((item, index, self) => {
        if (self[index].categoryId === val) {
          if (self[index].children && self[index].children.length) {
            this.smallTypeList = self[index].children
          } else {
            this.smallTypeList = []
          }
        }
      })
      this.$emit('change-big-type', val);
      this.$emit('change-small-type', this.checkedType.length ? this.checkedType.join(',') : '')

    },
    $route() {
      this.checkedType = '';
      this.bigType = 0;
    }
  },
  methods: {
    selectAllType(value) {
      if (value === true) {
        this.checkedType = this.smallTypeList.map(({ subCategoryId }) => subCategoryId);
      } else {
        this.checkedType = [];
      }
      this.$emit('change-small-type', this.checkedType.join(','));
    },
    selectType(value) {
      // let checkedCount = value.length;
      // this.checkAll = checkedCount === this.smallTypeList.length;
      this.$emit('change-small-type', this.checkedType);
    }

  }
}
</script>

<style lang='less'>
.appname {
  .right {
    padding-top: 13px;
    padding-left: 6px;
    padding-bottom: 0px;
  }
  .el-radio-button__inner {
    height: 30px;
    line-height: 7px;
    margin-right: 20px;
    margin-bottom: 10px !important;
    padding: 12px 15px;
    border: none !important;
    border-radius: 4px !important;
  }
  .el-radio-button,
  .el-radio-button__inner {
    display: inline-block;
    position: relative;
    outline: 0;
    width: 86px;
  }
}

.el-checkbox-button {
  position: relative;
  display: inline-block;
  margin-right: 20px;
}

.el-checkbox-button__inner {
  border: none !important;
  background-color: #F9F9F9;
  margin-bottom: 20px !important;
  padding: 5px 20px;
}

.el-checkbox-button:hover {
  // background: white;
}

.el-checkbox-button.is-checked .el-checkbox-button__inner {
  color: #69c72b;
  background-color: #F9F7F8;
  border: 1px solid #69c72b !important; // box-shadow: -1px 0 0 0 #69c72b;
  border-radius: 4px !important;
  box-shadow: none;
}

.content .detail-content-menu .select-list.top {
  border-bottom: none !important;
}

.content .detail-content-menu .select-list:nth-child(2) .right {
  overflow: hidden;
  padding-top: 0px;
  .rightBox {
    overflow: hidden;
    padding: 10px;
    background-color: #F9F9F9;
    border: 1px dashed #E3EAF4;
    .el-radio-button {
      margin-right: 10px;
      margin-bottom: 10px;
      .el-radio-button__inner {
        border: none;
        background: #F9F9F9;
      }
    }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner{
        background-color: #69C72B;
        border-color: #69C72B;
  }
  }
}
</style>
