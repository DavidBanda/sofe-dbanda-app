import Route from '@ember/routing/route';
// import { inject as service } from '@ember/service';

const COMMUNITY_CATEGORIES = [
    'Condo',
    'Townhouse',
    'Apartment'
  ];

export default class IndexRoute extends Route {
  async model() {
    let generalData = await fetch('http://api.coronastatistics.live/all');
    let data = await generalData.json();
    let deaths = data.deaths;
    let cases = data.cases;
    let recovered = data.recovered;
    let updated = data.updated;

    let currentData = await fetch('http://api.coronastatistics.live/countries');
    let current = await currentData.json();
    



    return { data: [
        {
          "name": "Deaths",
          "amount": deaths,
        },
        {
          "name": "Cases",
          "amount": cases
        },
        {
          "name": "Recovered",
          "amount": recovered
        },
        {
          "name": "Updated",
          "amount": updated
        }
    ]}
  }
}

















