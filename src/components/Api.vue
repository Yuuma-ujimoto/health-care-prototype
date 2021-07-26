<template>
  <div/>
</template>

<script>
import axios from "axios"
//import {Interaction} from "chart.js";

export default {
  name: "Api",
  methods: {
    check_date_span(before_date, after_date) {
      const before = new Date(before_date.split("-"))

      const after = new Date(after_date.split("-"))
      const span = (after - before) / (60 * 60 * 24 * 1000) - 1

      // 結果
      let null_list = []
      let span_date_list = []

      // 空白期間の日付を求める
      let span_date = null
      let span_year, span_month, span_day

      for (let i = 0; i < span; i++) {
        span_date = new Date(before.getTime() + (i + 1) * 60 * 60 * 24 * 1000)
        span_year = span_date.getFullYear()
        span_month = span_date.getMonth() + 1
        span_day = span_date.getDate()
        span_date_list.push(`${span_year}-${span_month < 10 ? "0" + span_month : span_month}-${span_day < 10 ? "0" + span_day : span_day}`)
        null_list.push(null)
      }

      return {
        null_list: null_list,
        span_date_list: span_date_list
      }
    },
    getHealthData: async function () {
      const res = await axios.get("http://localhost:3000/api/select_health_data")
      if (res.data.error) {
        return {}
      } else if (res.data.result) {
        let result_list = []
        let label_list = []
        let after_date = null
        let before_date = null
        let label_list_cache = []
        let result_list_cache = []

        res.data.result.forEach(i => {
          after_date = i.date
           if (!before_date) {
            label_list.push(i.date)
            before_date = after_date
          } else {
            // 前回データと今回データとの日付の差異
            label_list.push(i.date)
            const check_date_span = this.check_date_span(before_date, after_date)
            label_list_cache = label_list.concat(check_date_span.span_date_list)
            label_list = label_list_cache

            result_list_cache = result_list.concat(check_date_span.null_list)
            result_list = result_list_cache
            //date_cache = date_to_int
            before_date = after_date

          }

          result_list.push(i.weight)

        })
        return {
          labels: label_list,
          datasets: [{
            label: "体重",
            borderColor: "#e67e22",
            data: result_list,
            fill: false,
            spanGaps: true
          }]
        }
      } else {
        return []
      }
    },
    insertHealthData: async function (weight, date) {

      let params = new URLSearchParams();
      params.append('weight', weight);
      params.append("date", date);
      const res = await axios.post("http://localhost:3000/api/insert_health_data", params)
      return res.data
    }
  }
}
</script>