import adzspecAnalyticsAdapter from '../../../modules/adzspecAnalyticsAdapter.js';
import { expect } from 'chai';
import {server} from '../../mocks/xhr.js';

let adapterManager = require('src/adapterManager').default;
let events = require('src/events');
let constants = require('src/constants.json');

describe('Adzspec Analytics', function () {

  let bidRequest = {
    "bidderCode": "improvedigital",
    "auctionId": "96d2b26f-6b52-412e-8cc3-512353dc4f3c",
    "bidderRequestId": "1bfe28dd8c5bc2",
    "bids": [
      {
          "bidder": "improvedigital",
          "params": {
              "placementId": 22747501
          },
          "mediaTypes": {
              "banner": {
                  "sizes": [
                      [
                          300,
                          250
                      ]
                  ]
              }
          },
          "adUnitCode": "/22696859215/Adzspectestad1",
          "transactionId": "35d3904e-69fc-4c26-84bc-39d79b71da0d",
          "sizes": [
              [
                  300,
                  250
              ]
          ],
          "bidId": "23b983b35c9196",
          "bidderRequestId": "1bfe28dd8c5bc2",
          "auctionId": "96d2b26f-6b52-412e-8cc3-512353dc4f3c",
          "src": "client",
          "bidRequestsCount": 1,
          "bidderRequestsCount": 1,
          "bidderWinsCount": 0
      }
    ],
    "auctionStart": 1657868385933,
    "timeout": 1000,
    "start": 1657868385940
  }

  let bidWon = {
    'bidderCode': 'improvedigital',
    'width': 970,
    'height': 250,
    'statusMessage': 'Bid available',
    'adId': '65d16ef039a97a',
    'requestId': '2bd3e8ff8a113f',
    'transactionId': '35d3904e-69fc-4c26-84bc-39d79b71da0d',
    'auctionId': '96d2b26f-6b52-412e-8cc3-512353dc4f3c',
    'mediaType': 'banner',
    'source': 'client',
    'cpm': 27.4276,
    'creativeId': '158533702',
    'currency': 'USD',
    'netRevenue': true,
    'ttl': 2000,
    'ad': 'some html',
    'meta': {
      'advertiserDomains': [
        'example.com'
      ]
    },
    'originalCpm': 25.02521,
    'originalCurrency': 'EUR',
    'responseTimestamp': 1647424261558,
    'requestTimestamp': 1647424261189,
    'bidder': 'appnexus',
    'adUnitCode': 'tag_200123_banner',
    'timeToRespond': 369,
    'originalBidder': 'appnexus',
    'pbLg': '5.00',
    'pbMg': '20.00',
    'pbHg': '20.00',
    'pbAg': '20.00',
    'pbDg': '20.00',
    'pbCg': '20.000000',
    'size': '970x250',
    'adserverTargeting': {
      'hb_bidder': 'appnexus',
      'hb_adid': '65d16ef039a97a',
      'hb_pb': '20.000000',
      'hb_size': '970x250',
      'hb_source': 'client',
      'hb_format': 'banner',
      'hb_adomain': 'example.com'
    },
    'status': 'rendered',
    'params': [
      {
        'placementId': 123456
      }
    ]
  };

  after(function () {
    adzspecAnalyticsAdapter.disableAnalytics();
  });

  describe('main test flow', function () {
    beforeEach(function () {
      sinon.stub(events, 'getEvents').returns([]);
    });

    afterEach(function () {
      events.getEvents.restore();
    });

    it('should catch events of interest', function () {
      sinon.spy(adzspecAnalyticsAdapter, 'track');

      adapterManager.registerAnalyticsAdapter({
        code: 'adzspecAnalytics',
        adapter: adzspecAnalyticsAdapter
      });

      adapterManager.enableAnalytics({
        provider: 'adzspecAnalytics',
        options: {
          publisherId: '74f07c6c'
        }
      });
      events.emit(constants.EVENTS.AUCTION_END, bidRequest);
      events.emit(constants.EVENTS.BID_WON, bidWon);
      sinon.assert.callCount(adzspecAnalyticsAdapter.track, 2);
    });
  });

});
