import Component from '@glimmer/component';

export default class MapComponent extends Component {

    get chart() {
        am4core.ready(async function() {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            let currentData = await fetch('http://api.coronastatistics.live/countries');
            let current = await currentData.json();
            let others = 0;

            function sortResults(prop, asc) {
              current.sort(function(a, b) {
                  if (asc) {
                      return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
                  } else {
                      return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
                  }
              });
            }
        
            sortResults('cases', false)
            
            for (var i = 10; i < current.length; i++) {
              others += current[i].cases;
            }

            // Create chart instance
            var chart = am4core.create("pieChart", am4charts.PieChart);
            
            // Add data
            chart.data = [ {
              "country": current[0].country,
              "litres": current[0].cases
            }, {
              "country": current[1].country,
              "litres": current[1].cases
            }, {
              "country": current[2].country,
              "litres": current[2].cases
            }, {
              "country": current[3].country,
              "litres": current[3].cases
            }, {
              "country": current[4].country,
              "litres": current[4].cases
            }, {
              "country": current[5].country,
              "litres": current[5].cases
            }, {
              "country": current[6].country,
              "litres": current[6].cases
            }, {
              "country": current[7].country,
              "litres": current[7].cases
            }, {
              "country": current[8].country,
              "litres": current[8].cases
            }, {
              "country": current[9].country,
              "litres": current[9].cases
            } , {
              "country": "Others",
              "litres": others
            }];
            
            // Add and configure Series
            var pieSeries = chart.series.push(new am4charts.PieSeries());
            pieSeries.dataFields.value = "litres";
            pieSeries.labels.template.disabled = true;
            pieSeries.dataFields.category = "country";
            pieSeries.slices.template.stroke = am4core.color("#282e38");
            pieSeries.slices.template.strokeWidth = 1;
            pieSeries.slices.template.strokeOpacity = 1;
            
            // This creates initial animation
            pieSeries.hiddenState.properties.opacity = 1;
            pieSeries.hiddenState.properties.endAngle = -90;
            pieSeries.hiddenState.properties.startAngle = -90;
            
            }); // end am4core.ready()
    }
}
