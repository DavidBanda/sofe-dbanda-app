import Component from '@glimmer/component';

export default class MapComponent extends Component {
    get axes() {
        am4core.ready(async function() {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end
            
            // Create chart instance
            var chart = am4core.create("axesChart", am4charts.XYChart);
            
            //
            
            // Increase contrast by taking evey second color
            chart.colors.step = 2;

            let generalData = await fetch('http://api.coronastatistics.live/all');
            let data = await generalData.json();
            var deaths = data.deaths;
            var cases = data.cases;
            var recovered = data.recovered;

            let generalDates = await fetch('http://api.coronastatistics.live/timeline/global');
            let dates = await generalDates.json();
            let keys = Object.keys(dates)

            console.log(keys.length);
            console.log(keys[0]);
            console.log(dates[keys[0]].cases);
            
            // Add data
            chart.data = generateChartData();
            
            // Create axes
            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.minGridDistance = 40;

            chart.colors.list = [
              am4core.color("#d9534f"),
              am4core.color("#5cb85c"),
              am4core.color("#5bc0de"),
              am4core.color("#5cb85c"),
            ];

            
            // Create series
            function createAxisAndSeries(field, name, opposite, bullet) {
              var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
              if(chart.yAxes.indexOf(valueAxis) != 0){
                  valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
              }
              
              var series = chart.series.push(new am4charts.LineSeries());
              series.dataFields.valueY = field;
              series.dataFields.dateX = "date";
              series.strokeWidth = 2;
              series.yAxis = valueAxis;
              series.name = name;
              series.tooltipText = "{name}: [bold]{valueY}[/]";
              series.tensionX = 0.8;
              series.showOnInit = true;
              
              var interfaceColors = new am4core.InterfaceColorSet();
              
              
              valueAxis.renderer.line.strokeOpacity = 1;
              valueAxis.renderer.line.strokeWidth = 2;
              valueAxis.renderer.line.stroke = series.stroke;
              valueAxis.renderer.labels.template.fill = series.stroke;
              
              valueAxis.renderer.opposite = opposite;
            }
            
            createAxisAndSeries("visits", "Deaths", false, "circle");
            createAxisAndSeries("views", "Cases", true, "triangle");
            createAxisAndSeries("hits", "Recoveries", true, "rectangle");
            
            // Add legend
            chart.legend = new am4charts.Legend();
            chart.legend.labels.template.fill = am4core.color("#fff");
            
            // Add cursor
            chart.cursor = new am4charts.XYCursor();
            
            // generate some random data, quite different range
            function generateChartData() {
              var chartData = [];
              var firstDate = new Date(keys[0]);
              firstDate.setDate(firstDate.getDate());
              firstDate.setHours(0, 0, 0, 0);
            
              var visits = deaths;
              var hits = recovered;
              var views = cases;
            
              for (var i = 1; i < keys.length; i++) {
                // we create date objects here. In your data, you can have date strings
                // and then set format of your dates using chart.dataDateFormat property,
                // however when possible, use date objects, as this will speed up chart rendering.
                var newDate = new Date(firstDate);
                newDate.setDate(newDate.getDate() + i);
            
                // visits += dates[keys[i]].cases - dates[keys[i - 1]].cases;
                // hits += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
                // views += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
            
                chartData.push({
                  date: newDate,
                  visits: dates[keys[i]].deaths,
                  hits: dates[keys[i]].recovered,
                  views: dates[keys[i]].cases
                });
              }
              return chartData;
            }
            
            }); // end am4core.ready()
    }
}