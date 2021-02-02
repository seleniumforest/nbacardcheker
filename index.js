const fetch = require("node-fetch");
const notifier = require('node-notifier');
const updateTime = 10 * 1000;

setInterval(check, updateTime);
notifier.notify({
    title: 'NBA Top Shot Packs Checker',
    message: 'Check started...'
});

async function check() {
    var request = await fetch("https://api.nba.dapperlabs.com/marketplace/graphql?SearchPackListings", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en,ru;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": "\"Google Chrome\";v=\"87\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"87\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site"
        },
        "referrer": "https://www.nbatopshot.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{\"operationName\":\"SearchPackListings\",\"variables\":{\"input\":{\"searchInput\":{\"pagination\":{\"cursor\":\"\",\"direction\":\"RIGHT\",\"limit\":100}}}},\"query\":\"query SearchPackListings($input: SearchPackListingsInput!) {\\n  searchPackListings(input: $input) {\\n    data {\\n      searchSummary {\\n        data {\\n          ... on PackListings {\\n            data {\\n              id\\n              price\\n              title\\n              remaining\\n              totalPackCount\\n              expiryDate\\n              images {\\n                type\\n                url\\n                __typename\\n              }\\n              __typename\\n            }\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}",
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
    });

    var response = await request.json();
    var packs = response.data.searchPackListings.data.searchSummary.data.data;
    var available = packs.filter(x => x.remaining > 0);
    console.log(`${new Date()} Total Packs: ${packs.length} Available: ${available.length}`);
    
    if (available.length > 0) {
        notifier.notify({
            title: 'NBA Top Shot Packs Checker',
            message: `Total Packs: ${packs.length} Available: ${available.length} Name: ${available[0].title}`
        });
    }
}