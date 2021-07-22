<template>
  <div id="app">
    <h1>体重記録アプリ</h1>
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
      weight: null
    }
  },
  mounted() {
    this.getChartData()
  },
  methods: {
    getChartData: async function () {
      const response = await this.$refs.api.getHealthData()
      if (!response.error) {
        console.log(response)
        this.update_chart_data(response)
      }
    },
    insertData: async function () {
      const response = await this.$refs.api.insertHealthData(this.weight)
      console.log("res")
      console.log(response)
      if (!response.error) {
        await this.getChartData()
      }
    },
    update_chart_data(chartData){
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
.input-weight{
  width: 200px;
  height: 50px;
  margin: 10px;
  box-sizing: border-box;
  font-size: 24px;
}
.post-weight{
  width: 80px;
  height: 50px;
  margin: 10px;
  box-sizing: border-box;
}
</style>
