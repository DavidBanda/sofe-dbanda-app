import Route from '@ember/routing/route';
// import { inject as service } from '@ember/service';

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export default class IndexRoute extends Route {
  async model() {
    
    let generalData = await fetch('http://api.coronastatistics.live/all');
    let data = await generalData.json();
    let deaths = data.deaths;
    let cases = data.cases;
    let recovered = data.recovered;

    let currentData = await fetch('http://api.coronastatistics.live/countries');
    let current = await currentData.json();
    let totalCritical = 0;
    let todayCases = 0;
    let todayDeaths = 0;
    let perMillion = 0;

    for (var i = 0; i < current.length; i++) {
      totalCritical += current[i].critical;
      todayCases += current[i].todayCases;
      todayDeaths += current[i].todayDeaths;
      perMillion += current[i].casesPerOneMillion;
    }


    return { data: [
      {
        "name": "Infections",
        "amount": formatNumber(cases),
        "progress": "bg-info",
        "today": formatNumber(todayCases) + ' today',
        "percent": "",
      },
      {
        "name": "Deaths",
        "amount": formatNumber(deaths),
        "progress": "bg-danger",
        "today": formatNumber(todayDeaths) + ' today',
        "percent": formatNumber((deaths * 100 / (deaths + recovered)).toFixed(2)) + "%",
      },
      {
        "name": "Recoveries",
        "amount": formatNumber(recovered),
        "progress": "bg-success",
        "today": formatNumber(cases - recovered - deaths) + ' remining',
        "percent": formatNumber((recovered * 100 / (deaths + recovered)).toFixed(2)) + "%",
      },
      {
        "name": "Critical",
        "amount": formatNumber(totalCritical),
        "progress": "bg-warning",
        "today": formatNumber(perMillion.toFixed(2)) + ' per million',
        "percent": formatNumber((totalCritical * 100 / (cases - recovered - deaths)).toFixed(2)) + "%",
      }
    ], 
    percent: {
      "totalNations": current.length,
      "percent": [
        {
          "name": "Deaths",
          "percent": formatNumber((deaths * 100 / (deaths + recovered)).toFixed(2)) + "%",
        },
        {
          "name": "Recoveries",
          "percent": formatNumber((recovered * 100 / (deaths + recovered)).toFixed(2)) + "%",
        },
        {
          "name": "Critical",
          "percent": formatNumber((totalCritical * 100 / (cases - recovered - deaths)).toFixed(2)) + "%",
        }
      ]}
    }
  }
}

















