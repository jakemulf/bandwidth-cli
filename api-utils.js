const axios = require('axios');
const parser = require('fast-xml-parser');
const xmlToJs = parser.parse;
const jsToXml = (new parser.j2xParser()).parse;
const IRIS_BASE_URL = 'https://dashboard.bandwidth.com/api/';
const TEST_URL = 'https://webhook.site/f503b77a-0bde-49f9-a49b-878d64c992de';
const ACCOUNT_ID = process.env.BANDWIDTH_ACCOUNT_ID;
const API_USER = process.env.BANDWIDTH_API_USER;
const API_PASSWORD = process.env.BANDWIDTH_API_PASSWORD;
const auth = {
  username: API_USER,
  password: API_PASSWORD
};
const config = {
  headers: {
    'Content-Type': 'application/xml'
  },
  auth: auth
};



/**
 * Makes a request to the api to give a list of sites associated with the
 * accountID.
 */
module.exports.listSites = () => {
  axios({
    method: "GET",
    url: IRIS_BASE_URL + `accounts/${ACCOUNT_ID}/sites`,
    auth: auth
  }).then(res => {
    const xml = xmlToJs(res.data);
    console.log(xml.SitesResponse.Sites.Site);
  }).catch(console.log)
}

/**
 * Accesses the iris api to create a site/subaccount.
 * @return the response. TODO: change to an object of the site or something.
 */
module.exports.createSite = () => {
  const bodyObj = {
    Site: [{
      Name: 'Raleigh',
      Description: "Test description site",
      CustomerName: "Bandwidth CLI testing",
      Address: {
        HouseNumber: "1600",
        StreetName: "PENNSYLVANIA",
        StreetSuffix: 'AVE',
        PostDirectional: "NW",
        City: 'Washington',
        StateCode: 'DC',
        Zip: 20006,
        Country: 'US',
        AddressType: 'Billing'
      },
    }]
  }
  const url = IRIS_BASE_URL + `accounts/${ACCOUNT_ID}/sites`;
  const data = jsToXml(bodyObj)
  axios.post(url, data, config)
  .then(res => {
    const jsRes = xmlToJs(res.data);
    console.log(jsRes);
  }).catch(a => console.log(a.response.data))
}


/*LOCATIONS = SIPPEER*/

/**
 * Accesses the iris api to list all the locations associated with the accountID and
 * the specific site id.
 * @param siteId the id of the site that is being investigated.
 */
module.exports.listSippeers = (siteId) => {
  const url = IRIS_BASE_URL +  `accounts/${ACCOUNT_ID}/sites/${siteId}/sippeers`
  axios.get(url, config).then(res => {
    const js = xmlToJs(res.data).TNSipPeersResponse.SipPeers;
    console.log(js);
  }).catch(err => console.log(err))
}

module.exports.createSippeer = (siteId) => {
  const url = IRIS_BASE_URL +  `accounts/${ACCOUNT_ID}/sites/${siteId}/sippeers`
  const data = {}
  const xmlData = jsToXml(data)
  axios.post(url, config, xmlData);
}

/*APPLICATIONS*/
module.exports.listApplications = () => {
  axios({
    method: "GET",
    url: IRIS_BASE_URL + `accounts/${ACCOUNT_ID}/applications`,
    auth: {
      username: process.env.BANDWIDTH_API_USER,
      password: process.env.BANDWIDTH_API_PASSWORD
    }
  }).then(res => {
    const js = xmlToJs(res.data).ApplicationProvisioningResponse.ApplicationList.Application;
    console.log(js);
  }).catch(console.log)
}

/**
 * Accesses the iris api to create an application for messaging in particular.
 * @return the response.
 */
module.exports.createMessageApplication = () => {
  const bodyObj = {
    Application: [{
      ServiceType: 'Messaging-V2',
      AppName: 'Application Name',
      MsgCallbackUrl: 'https://example.com',
      CallbackCreds: {
        UserId: 'testId',
        Password: 'testPass'
      }
    }],
  }
  const config = {
    headers: {
      'Content-Type': 'application/xml'
    },
    auth: {
      username: process.env.BANDWIDTH_API_USER,
      password: process.env.BANDWIDTH_API_PASSWORD
    }
  };
  const url = IRIS_BASE_URL + `accounts/${ACCOUNT_ID}/applications`;
  console.log(url)
  const data = jsToXml(bodyObj)
  axios.post(url, data, config)
  .then(res => {
    const jsRes = xmlToJs(res.data).ApplicationProvisioningResponse.Application;
    console.log(res)
    console.log(jsRes);
  }).catch(a => console.log(a))
}

/**
 * Accesses the iris api to create an application for messaging in particular.
 * @return the response.
 */
module.exports.createVoiceApplication = () => {
  const bodyObj = {
    Application: [{
      ServiceType: 'Voice-V2',
      AppName: 'Voice Application Name',
      CallInitiatedCallbackUrl: 'https://example.com',
      CallInitiatedMethod: 'GET',
      CallStatusCallbackUrl: 'https://example.com',
      CallStatusMethod: 'GET',
      CallbackCreds: {
        UserId: 'testId',
        Password: 'testPass'
      }
    }],
  }
  const url = IRIS_BASE_URL + `accounts/${ACCOUNT_ID}/applications`;
  console.log(url)
  const data = jsToXml(bodyObj)
  axios.post(url, data, config)
  .then(res => {
    const jsRes = xmlToJs(res.data).ApplicationProvisioningResponse.Application;
    console.log(res)
    console.log(jsRes);
  }).catch(a => console.log(a))
}