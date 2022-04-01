<script>
export default {
  name: "SuperAdmin_monthly_sales",
  props: ["labels", "data"],
  components: {
    apexchart: () => import("vue-apexcharts"),
  },
  computed: {
    line_colors() {
      return this.data.map(line => line.backgroundColor)
    },
    yAxis_data(){
      return this.data.map(line => {

      })
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
          colors: this.line_colors,
          dataLabels: {
            enabled: true,
          },
          stroke: {
            width: [5],
            curve: 'smooth'
          },
          title: {
            text: `Monthly Sales Report`,
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
          yaxis: [
            {
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: this.data[0].backgroundColor
              },
              labels: {
                style: {
                  colors: this.data[0].backgroundColor
                }
              },
              title: {
                text: this.data[0].name,
                style: {
                  color: this.data[0].backgroundColor
                }
              }
            },
            {
              opposite:true,
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: this.data[1].backgroundColor
              },
              labels: {
                style: {
                  colors: this.data[1].backgroundColor
                }
              },
              title: {
                text: this.data[1].name,
                style: {
                  color: this.data[1].backgroundColor
                }
              }
            },
          ],
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
        series: this.data,
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
