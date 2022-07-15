import { logError, logInfo } from '../src/utils.js';
import adapter from '../src/AnalyticsAdapter.js';
import CONSTANTS from '../src/constants.json';
import adaptermanager from '../src/adapterManager.js';
import {ajax} from '../src/ajax.js';

const analyticsType = 'endpoint';

const {
  EVENTS: {
    AUCTION_END,
    BID_WON,
  }
} = CONSTANTS;

let publisherId;

let allEvents = {};
let endpoint = 'https://publisher';
let adzspecAnalyticsAdapter = Object.assign(adapter(
  {
    analyticsType
  }),
{
  track({eventType, args}) {
    if (typeof args !== 'undefined') {
      adzspecAnalyticsAdapter.callEventHandler(eventType, args);
    }
  }
});

// save the base class function
adzspecAnalyticsAdapter.originEnableAnalytics = adzspecAnalyticsAdapter.enableAnalytics;

// override enableAnalytics so we can get access to the config passed in from the page
adzspecAnalyticsAdapter.enableAnalytics = function (config) {
  if (!config.options.publisherId) {
    logError('Publisher ID option is not defined.');
    return;
  }
  initOptions = config.options;
  publisherId = initOptions.publisherId;
  adzspecAnalyticsAdapter.originEnableAnalytics(config);  // call the base class function
};

adzspecAnalyticsAdapter.callEventHandler = function (eventType, args) {
  allEvents[eventType].push(args);
  switch (eventType) {
    case AUCTION_END:
      handleAuctionEnd();
      break;
    case BID_WON:
      handleBidWon(args);
      break;
  }
}

function handleAuctionEnd() {

    try {
      ajax(endpoint + '.adzspec.com/analytics/auctions/' + publisherId, callBack(), JSON.stringify(allEvents), {
        contentType: 'application/json',
        method: 'POST'
      });
    } catch (err) {
      logError('Adzspec analytics request encounter an error: ', err);
    }
}

function handleBidWon(args) {
  try {
    ajax(endpoint + '.adzspec.com/analytics/bid_won/' + publisherId, callBack(), JSON.stringify(args), {
      contentType: 'application/json',
      method: 'POST'
    });
  } catch (err) {
    logError('Adzspec analytics request encounter an error: ', err);
  }
}

function callBack() {
  logInfo('Analytics events sent successfully');
}

adaptermanager.registerAnalyticsAdapter({
  adapter: adzspecAnalyticsAdapter,
  code: 'adzspecAnalytics',
  gvlid: 99
});

export default adzspecAnalyticsAdapter;
