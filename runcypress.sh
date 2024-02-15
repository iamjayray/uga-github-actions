#!/bin/bash

# removing the previously generated snapshots everytime before running the testcases expect api-testing snapshots.js
find cypress -type f -not -path 'cypress/e2e/api-testing/*' -name 'snapshots.js' -delete

# removing the previously generated HTML reports everytime before running the testcases
rm mochawesome.json
rm -r coverage

# removing the previously generated JSON reports everytime before running the testcases
rm cypress/reports/*.json

# running it on localhost in a separate process group
(npx vite dev --mode test &)


# Running the cypress testcases

# api testing
npx cypress run  --spec 'cypress/e2e/api-testing/*.cy.js' --env coverage=true
echo "completed API testing"

# Smoke testcases
npx cypress run  --spec 'cypress/e2e/smoke-testcases/**/*.cy.js' --env coverage=true &

# scenario based testing
for file in "cypress/config/uat-testing"/*.json; do
  if [ -f "$file" ]; then
    npx cypress run  --spec 'cypress/e2e/uat-testing-for-app-pages/*.cy.js' --env configFile=$file coverage=true 
  fi
done

# wait for all background processes to finish except the vite process
wait

echo "Completed executing the testcases"

# creating and merging the reports
npx mochawesome-merge "cypress/reports/*.json" > mochawesome.json
npx marge mochawesome.json -o cypress/reports

# killing the localhost
npx kill-port 8080