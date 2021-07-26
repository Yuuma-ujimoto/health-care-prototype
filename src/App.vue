<template>
  <div id="app">
    <h1>体重記録アプリ</h1>
    <input class="input-date" type="date" v-model="time">
    <input class="input-weight" type="number" min="0" v-model="weight">
    <button class="post-weight" @click="insertData">登録！</button>
    <Api ref="api"/>
    <br>
    <Chart :chartData="chartData" :options="options" v-if="chartData"></Chart>
  </div>
</template>

<script>

import Api from "./components/Api.vue";
import Chart from "./components/chart";

export default {
  name: 'App',
  components: {
    Chart,
    Api
  },
  data() {
    return {
      chartData: {},
      options: {},
      weight: null,
      time: null
    }
  },
  mounted() {
    this.getChartData()
  },
  methods: {
    getChartData: async function () {
      const response = await this.$refs.api.getHealthData()
      if (!response.error) {
        this.update_chart_data(response)
      }
    },
    insertData: async function () {
      const response = await this.$refs.api.insertHealthData(this.weight, this.time)
      console.log("res")
      console.log(response)
      if (!response.error) {
        await this.getChartData()
      }
    },
    update_chart_data(chartData) {
      this.chartData = chartData
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.input-weight, .input-date ,.post-weight {
  width: 200px;
  height: 50px;
  margin: 10px;
  background-color: #ecf0f1;
  border: none;
  box-shadow: 0 3px 3px 1px #bdc3c7;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 18px;
}

.post-weight:active{
  transform: translateY(5px);
  box-shadow: 0 0 3px 1px #bdc3c7;
}

.input-weight,.input-date{
  padding-left: 10px;
}

.input-weight:focus-visible, .input-date:focus-visible{
  border: none;
  outline: none;
}




</style>
