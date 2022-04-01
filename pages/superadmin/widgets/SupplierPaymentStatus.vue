<script>
import {mapState} from 'vuex'

export default {
  name: "SuperAdmin_supplier_payment",
  props: ["labels", "data"],
  components: {
    apexchart: () => import("vue-apexcharts"),
  },
  data() {
    return {
      title: "Welcome"
    }
  },
  computed: {
    ...mapState({
      ME: state => state.auth.user
    }),
    chart_labels() {
      return this.labels.map(label => {
        return label ? "Paid" : "Unpaid"
      })
    },
    DataChart() {
      return {
        series: this.data,
        chartOptions: {
          legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            verticalAlign: 'middle',
            floating: false,
            fontSize: '14px',
            offsetX: 0,
            offsetY: -10
          },
          title: {
            text: `Supplier payment summary`,
            align: 'left',
            style: {
              fontSize: '14px',
              color: '#666'
            }
          },
          dataLabels: {
            enabled: false
          },
          labels: this.chart_labels,
          colors: ['#3bafda', '#da7426'],
          responsive: [{
            breakpoint: 600,
            options: {
              chart: {
                height: 240
              },
              legend: {
                show: false
              },
            }
          }],
          fill: {
            type: 'gradient'
          }
        },
      }
    },
  }
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <apexchart class="apex-charts" height="320" type="donut" :series="DataChart.series"
                 :options="DataChart.chartOptions"></apexchart>
    </div>
  </div>
</template>
