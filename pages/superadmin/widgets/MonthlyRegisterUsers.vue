<script>
import {mapState} from 'vuex'

export default {
  name: "SuperAdmin_monthly_users",
  props:["labels","data"],
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
    total_user(){
      return this.data.reduce((total,item)=>total+item,0)
    },
    linewithDataChart() {
      return {
        options: {
          chart: {
            zoom: {
              enabled: false
            },
            toolbar: {
              show: false
            }
          },
          colors: ['#03fa49'],
          dataLabels: {
            enabled: true,
          },
          stroke: {
            width: [5],
            curve: 'smooth'
          },
          title: {
            text: `Total registered users: ${this.total_user}`,
            align: 'left',
            style: {
              fontSize: '14px',
              color: '#666'
            }
          },
          grid: {
            row: {
              colors: ['transparent'], // takes an array which will be repeated on columns
              opacity: 0.2
            },
            borderColor: '#f1f3fa'
          },
          markers: {
            style: 'inverted',
            size: 6
          },
          xaxis: {
            categories: this.labels,
            title: {
              text: 'Month'
            }
          },
          yaxis: {
            title: {
              text: 'Users'
            },
            show:false,
            min: 0,
            max: Math.max(...this.data)+1
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5
          },
          responsive: [{
            breakpoint: 600,
            options: {
              chart: {
                toolbar: {
                  show: false
                }
              },
              legend: {
                show: false
              },
            }
          }]
        },
        series: [{
          name: 'Users',
          data: this.data
        }],
      }
    },
  }
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <apexchart class="apex-charts" height="380" type="line" :series="linewithDataChart.series"
                 :options="linewithDataChart.options"></apexchart>
    </div>
  </div>
</template>
