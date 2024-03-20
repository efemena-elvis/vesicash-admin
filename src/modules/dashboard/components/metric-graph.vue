<script>
import { Bar } from "vue-chartjs";

export default {
  name: "MetricGraph",

  extends: Bar,

  props: {
    barColor: {
      type: String,
      default: "#2C9A4B",
    },

    label: {
      type: String,
      default: "Transaction Volume",
    },

    dataset: {
      type: Array,
      default: () => [
        200e3, 400e3, 800e3, 1.5e6, 500e3, 150e4, 800e3, 500e3, 60e3, 250e3,
        90e3, 100e4,
      ],
    },

    labels: {
      type: Array,
      default: () => [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  },

  components: {
    Bar,
  },

  mounted() {
    this.renderChart(
      {
        labels: [...this.labels],
        datasets: [
          {
            label: this.label,
            backgroundColor: this.barColor,
            data: [...this.dataset],
          },
        ],
      },
      {
        legend: {
          display: false,
        },

        scales: {
          yAxes: [
            {
              gridLines: {
                drawBorder: true,
                lineWidth: 0,
              },
              ticks: {
                fontColor: "#000",
                callback: this.formatUnit,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: true,
                lineWidth: 0,
              },
              ticks: {
                fontColor: "#000",
              },
            },
          ],
        },
        aspectRatio: 1.5,
        responsive: true,
      }
    );
  },

  methods: {
    formatUnit(value) {
      // .0[something] regex
      const zeroDecimals = /\.0+$|(\.[0-9]*[1-9])0+$/;
      if (!value) return "0";

      //format number to K (thousand) or M (million)
      if (value >= 1e6)
        return (value / 1e6).toFixed(2).replace(zeroDecimals, "$1") + "M";
      else if (value >= 1e3)
        return (value / 1e3).toFixed(2).replace(zeroDecimals, "$1") + "K";
      else return value.toFixed(2).replace(zeroDecimals, "$1");
    },
  },
};
</script>

<style></style>
