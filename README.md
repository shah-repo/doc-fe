# DOC-POC Frontend Service

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Environment variables

```bash
REACT_APP_API_ENDPOINT='https://api.develop.enlil.io/api'
REACT_APP_REFRESH_TOKEN_VALIDITY_DAYS="30"
REACT_APP_AWS_COGNITO_CLIENT_ID="5ts2oghmmo5bv2hik76b9rt8of"
REACT_APP_FRONTEND_URL="https://develop.enlil.io"
REACT_APP_SIGNUP_DOMAIN_URL="https://shifamed-doc-develop.auth.us-west-2.amazoncognito.com"
REACT_APP_HELLOSIGN_TEST_MODE="1"
REACT_APP_THEME='DEV_THEME'
REACT_APP_HELLOSIGN_CLIENT_ID="ENV_ID"
REACT_APP_DATADOG_APPLICATION_ID="REACT_APP_DATADOG_APPLICATION_ID"
REACT_APP_DATADOG_CLIENT_TOKEN="REACT_APP_DATADOG_CLIENT_TOKEN"

```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn lint`

Launches linter.<br>

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).



# Cypress

## Prerequisites
- None

## First time config

Add exection permission to all scripts in *./scripts*
```
chmod -R +x ./scripts
```

### Run Cypress Test Runner
Optionally you set ENLIL_COMPOSE_PORT_RANGE_START. Defaults to 5600, same as in BE scripts. 
```
./scripts/cypress/run_dev.sh
```
or

```
ENLIL_COMPOSE_PORT_RANGE_START=1234  ./scripts/cypress/run_dev.sh
```

It will open cypress Test Runner window where you can execute one spec file at the time. https://docs.cypress.io/guides/core-concepts/test-runner.html#Overview
### Run Cypress in parallel, headless
Run script:
```
./scripts/cypress/run_in_parallel.sh
```
Optional environment variables:

*NUMBER_OF_WORKERS* - number of workers :grin: , defaults to 4. Go as high as you can without having (too many?) specs failing due to timeouts or you system becomes unbearably slow.
*CI_BUILD_ID* - Build ID, defaults to current ISO8601 timestamp. When you want to rerun tests, but only failing ones, you need to define it manually.

Example
```
NUMBER_OF_WORKERS=4 CI_BUILD_ID=2020-07-03T14:07:48+02:00 ./scripts/cypress/run_in_parallel.sh
```

### Run Cypress suite on deployed code
To run Cypress test suites on code that was deployed, you need to:
 1. Start Sorry Cypress working in the background: `./scripts/cypress/start_dashboard.sh`
 2. Start test suite on selected environment 
    1. for DEV and DEMO, start `./scripts/cypress/run_on_deployment.sh` and select the right option in the menu
    2. for SANDBOX and PROD, you need to export the superadmin credentials to be used for the testrun first and then select the option in the menu:
    ```
      CYPRESS_SUPERADMIN_EMAIL=<superadmin_email> CYPRESS_SUPERADMIN_PASSWORD=<superadmin_password> ./scripts/cypress/run_on_deployment.sh
    ```

## Toolkit

### Adding requirements
Download Google spreadsheet as CSV file in *cypress/requirements/list.csv*


<details>
<summary>Example of a spec with SysRequirements</summary>
<p>

```typescript
context("Example specs for requirements linking:", () => {
  context("when specs are passing", () => {
    it("with one requirements mentioned", () => {
      SystemRequirement("REQ-0010");
      expect(true).to.eql(true);
    });

    it("with multiple requirements mentioned", () => {
      SystemRequirement("REQ-0020", "REQ-0030");
      expect(true).to.eql(true);
    });

    it("with no requirements mentioned", () => {
      expect(true).to.eql(true);
    });
  });

  context("when specs are not passing", () => {
    it("with one requirements mentioned", () => {
      SystemRequirement("REQ-0050");
      expect(true).to.eql(false);
    });

    it("with multiple requirements mentioned", () => {
      SystemRequirement("REQ-0040", "REQ-0030");
      expect(true).to.eql(false);
    });

    it("with no requirements mentioned", () => {
      expect(true).to.eql(false);
    });
  });

  context("when specs are skipped", () => {
    it.skip("with one requirements mentioned", () => {
      SystemRequirement("REQ-0070");
      expect(true).to.eql(true);
    });

    it.skip("with multiple requirements mentioned", () => {
      SystemRequirement("REQ-0090", "REQ-0080");
      expect(true).to.eql(true);
    });

    it.skip("with no requirements mentioned", () => {
      expect(true).to.eql(true);
    });
  });
});
```

</p>
</details>


### Adding Screenshot

<details>
<summary>Example of a spec with Screenshot</summary>
<p>

```typescript
context("Example of a spec with Screenshot", () => {
  it("test case", () => {
    Screenshot();
    expect(true).to.eql(true);
  });
});
```

</p>
</details>


### Preventing failed test case to trigger skipping of all subsiquent test cases

<details>
<summary>Preventing failed test case to trigger skipping of all subsiquent test cases</summary>
<p>

```typescript
context("Example", () => {
  it("like this", function() {
    PreventSkipOnFailure.call(this);
    expect(true).to.eql(false);
  });

  it("not like this, cannot use arrow function", () => {
    PreventSkipOnFailure.call(this);
    expect(true).to.eql(false);
  });

  it("not like this, need to bind scope", function() {
    PreventSkipOnFailure();
    expect(true).to.eql(false);
  });
});
```

</p>
</details>
