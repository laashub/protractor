const env = require('../environment.js');

// Make sure that borwser-related plugin hooks work with browser sync on
exports.config = {
  seleniumAddress: env.seleniumAddress,
  SELENIUM_PROMISE_MANAGER: false,

  framework: 'jasmine',

  // Spec patterns are relative to this directory.
  specs: [
    'specs/browser_get_wait_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  // Plugin patterns are relative to this directory.
  plugins: [{
    inline: {
      onPageLoad: async function() {
        return await new Promise(resolve => {
          setTimeout(() => {
            protractor.ON_PAGE_LOAD = true;
            resolve();
          }, 5000);
        });
      },
      onPageStable: async function() {
        if (protractor.ON_PAGE_LOAD) {
          this.addSuccess();
        } else {
          this.addFailure(
              'onPageLoad did not finish before onPageStable began');
        }
        return await new Promise(resolve => {
          setTimeout(() => {
            protractor.ON_PAGE_SYNC = true;
            resolve();
          }, 5000);
        });
      },
      teardown: function() {
        if (protractor.ON_PAGE_SYNC) {
          this.addSuccess();
        } else {
          this.addFailure('onPageStable did not finish before teardown');
        }
      }
    }
  }]
};
