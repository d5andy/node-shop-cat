const Heroku = require('heroku-client'),
      heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN }),
      stagesToShopName = { dev: 'dev', live: 'live', qa: 'test', demo: 'demo' };

module.exports = {
  getShopConfiguration: (stage, ccy) => {
    if (stage = 'dev') {
      return Promise.resolve({stage: stage,
              ccy: ccy,
              apiKey: '9b8699fb5010609fc9b5f0da9720d7ed',
              password: '5a233b2a52b38d0ba3dfd3be0cba9a75',
              shopName: 'shop-v3-dev'})
            .then(config => {
              config.shopUrl = `https://${config.apiKey}:${config.password}@${config.shopName}.myshopify.com/admin`;
              return config;
            });
    }

    return heroku.get(`/apps/${stage}-pmfulfilment/config-vars`)
      .then(vars => {
        return {stage: stage,
                ccy: ccy,
                apiKey: vars[`SHOP_${ccy}_API_KEY`],
                password: vars[`SHOP_${ccy}_API_PASSWORD`],
                shopName: `shop-v3-${stagesToShopName[stage]}-${ccy.toLowerCase()}`};
      })
      .then(config => {
        config.shopUrl = `https://${config.apiKey}:${config.password}@${config.shopName}.myshopify.com/admin`;
        return config;
      })
      .catch(err => console.log(err));
  }
}
