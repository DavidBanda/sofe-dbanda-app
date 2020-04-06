import Component from '@glimmer/component';

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export default class MapComponent extends Component {
    get gauge() {
        am4core.ready(async function() {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end
            
            let generalData = await fetch('http://api.coronastatistics.live/all');
            let data = await generalData.json();
            let deaths = data.deaths;
            let cases = data.cases;
            let recovered = data.recovered;

            let currentData = await fetch('http://api.coronastatistics.live/countries');
            let current = await currentData.json();
            let totalCritical = 0;  
            let active = 0;

            for (var i = 0; i < current.length; i++) {
              totalCritical += current[i].critical;
              active += current[i].active;
            }

            // Create chart instance
            var chart = am4core.create("gaugeChart", am4charts.RadarChart);
            
            // Add data
            chart.data = [{
              "category": "Critical",
              "value": totalCritical * 100 / (cases - recovered - deaths),
              "full": 100,
            }, {
              "category": "Death",
              "value": deaths * 100 / (deaths + recovered),
              "full": 100
            }, {
              "category": "Recovered",
              "value": recovered * 100 / (deaths + recovered),
              "full": 100
            }, {
              "category": "Active",
              "value": active * 100 / (cases - recovered),
              "full": 100
            }];
            
            // Make chart not full circle
            chart.startAngle = -90;
            chart.endAngle = 180;
            chart.innerRadius = am4core.percent(20);
            
            // Set number format
            chart.numberFormatter.numberFormat = "#.#'%'";

            chart.colors.list = [
              am4core.color("#f0ad4e"),
              am4core.color("#d9534f"),
              am4core.color("#5cb85c"),
              am4core.color("#5bc0de"),
            ];
            
            // Create axes
            var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "category";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.grid.template.strokeOpacity = 0;
            categoryAxis.renderer.labels.template.horizontalCenter = "right";
            categoryAxis.renderer.labels.template.fontWeight = 500;
            categoryAxis.renderer.labels.template.adapter.add("fill", function(fill, target) {
              return (target.dataItem.index >= 0) ? chart.colors.getIndex(target.dataItem.index) : fill;
            });
            categoryAxis.renderer.minGridDistance = 10;
            
            var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
            valueAxis.renderer.grid.template.strokeOpacity = 0;
            valueAxis.min = 0;
            valueAxis.max = 100;
            valueAxis.strictMinMax = true;
            
            // Create series
            var series1 = chart.series.push(new am4charts.RadarColumnSeries());
            series1.dataFields.valueX = "full";
            series1.dataFields.categoryY = "category";
            series1.clustered = false;
            series1.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
            series1.columns.template.fillOpacity = 0.08;
            series1.columns.template.cornerRadiusTopLeft = 20;
            series1.columns.template.strokeWidth = 0;
            series1.columns.template.radarColumn.cornerRadius = 20;
            
            var series2 = chart.series.push(new am4charts.RadarColumnSeries());
            series2.dataFields.valueX = "value";
            series2.dataFields.categoryY = "category";
            series2.clustered = false;
            series2.columns.template.strokeWidth = 0;
            series2.columns.template.tooltipText = "{category}: [bold]{value}[/]";
            series2.columns.template.radarColumn.cornerRadius = 20;
            
            series2.columns.template.adapter.add("fill", function(fill, target) {
              return chart.colors.getIndex(target.dataItem.index);
            });
            
            // Add cursor
            chart.cursor = new am4charts.RadarCursor();
            
            }); // end am4core.ready()
    }
}