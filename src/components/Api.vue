
<template>
  <div/>
</template>

<script>
import axios from "axios"
//import {Interaction} from "chart.js";

export default {
  name: "Api",
  methods: {
    format_date(date){
      return parseInt(date.toString().replace("-",""))
    },
    check_date_span(before_date,after_date){
      let before = new Date(before_date.split("-"))
      let after = new Date(after_date.split("-"))
      let span =  (after - before) / (60*60*24*1000)
      let result = []
      for(let i=0;i<span;i++){
        result.push(null)
      }
      return result
    },
    getHealthData: async function () {
      const res = await axios.get("http://localhost:3000/api/select_health_data")
      if(res.data.error){
        return {
        }
      }
      else if(res.data.result) {
        let result_list = []
        let label_list = []
        let date_to_int = null
        let date_cache = null
        let label_list_cache = []
        res.data.result.forEach(i => {

          if(!date_cache){
            label_list.push(i.date)
            // 前日データ情報を上書き
          }
          else{
            // 前回データと今回データとの日付の差異
            label_list_cache = label_list.concat(this.check_date_span(date_cache,date_to_int))
            label_list = label_list_cache
          }

          result_list.push(i.weight)
        })
        console.log(label_list)
        return {
          labels:label_list,
          datasets: [{
            label: "体重",
            borderColor:"#e67e22",
            data: result_list,
            fill:false
          }]
        }
      }
      else{
        return []
      }
    },
    insertHealthData: async function (weight,date) {

      let params = new URLSearchParams();
      params.append('weight', weight);
      params.append("date",date);
      const res = await axios.post("http://localhost:3000/api/insert_health_data",params)
      return res.data
    }
  }
}
</script>