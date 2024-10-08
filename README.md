# monocart reporter merge CLI bug when using the `zip` option on linux repro repo

## Description

This is a demo project to support [[Feature Request] merge CLI: accept compressed files #147](https://github.com/cenfun/monocart-reporter/issues/147).

It contains:

- a minimalist Playwright setup created using: `npm init playwright@latest` as per [Playwright docs](https://playwright.dev/docs/intro).
- added monocart-reporter to the Playwright reporters.
- the configuration for the monocart-reporter is in the [playwright.monocart-reporter-options.ts](/playwright.monocart-reporter-options.ts) file and is shared between the Playwright configuration file, [playwright.config.ts](/playwright.config.ts), and the monocart-reporter merge CLI configuration file, [playwright.monocart-reporter-merge.ts](./playwright.monocart-reporter-merge.ts).

Furthermore, the configuration for the monocart-reporter defined in the [playwright.monocart-reporter-options.ts](/playwright.monocart-reporter-options.ts) file is using the new `zip` option to produce a zipped output from the monocart reporter.

## Bug

The bug with using zip files with the merge CLI seems to be related with the globing used by the monocart reporter merge CLI to find all the zip files when running on Linux. This bug is not reproducible in Windows.

**Expected/OK behavior:**

1) On a windows environment run `npm run all-shards`. This will run the playwright tests with shards set to `1/2` and then with shards set to `2/2` and save the output to the `./shards` folder.
2) Run `npm run merge-cli` to merge the monocart reporter zip files using the merge CLI. The output of the merged report will be available at the `./test-reporters/monocart-reporter` folder.
3) Note that the merged report shows that 2 tests were executed.
4) Note that the output of the monocart reporter shows that 2 zip files were extracted:

```
[MR] merging report data ...
[MR] report data loaded: Z:\repos\temp\monocart-reporter-merge-cli-zip-linux-bug\test-reporters\monocart-reporter\.cache\extracted-1\monocart-report.json
[MR] report data loaded: Z:\repos\temp\monocart-reporter-merge-cli-zip-linux-bug\test-reporters\monocart-reporter\.cache\extracted-2\monocart-report.json
[MR] generating test report ...
[MR] Demo - merge CLI zip option linux bug
```

**Bug in linux environments:**

1) On a windows environment run `npm run all-shards`. This will run the playwright tests with shards set to `1/2` and then with shards set to `2/2` and save the output to the `./shards` folder.
2) Run `npm run docker:merge-cli` to merge the monocart reporter zip files using the merge CLI running on a linux environment using Docker. The output of the merged report will be available at the `./test-reporters/monocart-reporter` folder.
3) Note that the merged report only shows that 1 test was executed instead of showing 2.
4) Note that the output of the monocart reporter shows that only 1 zip file was extracted instead of 2:

```
[+] Running 1/0
 ✔ Container ngx-module-federation-tools-playwright-merge-monocart-reports-1  Created                                                                                                                                 0.0s
Attaching to playwright-merge-monocart-reports-1
playwright-merge-monocart-reports-1  |
playwright-merge-monocart-reports-1  | up to date, audited 176 packages in 495ms
playwright-merge-monocart-reports-1  |
playwright-merge-monocart-reports-1  | 42 packages are looking for funding
playwright-merge-monocart-reports-1  |   run `npm fund` for details
playwright-merge-monocart-reports-1  |
playwright-merge-monocart-reports-1  | found 0 vulnerabilities
playwright-merge-monocart-reports-1  |
playwright-merge-monocart-reports-1  | Running find command on ./shards dir...
playwright-merge-monocart-reports-1  | ./shards/1/monocart-report-1.zip
playwright-merge-monocart-reports-1  | ./shards/1/monocart-report.html
playwright-merge-monocart-reports-1  | ./shards/1/monocart-report.json
playwright-merge-monocart-reports-1  | ./shards/2/monocart-report-2.zip
playwright-merge-monocart-reports-1  | ./shards/2/monocart-report.html
playwright-merge-monocart-reports-1  | ./shards/2/monocart-report.json
playwright-merge-monocart-reports-1  | Find command finished.
playwright-merge-monocart-reports-1  |
playwright-merge-monocart-reports-1  | Running monocart reporter merge CLI...
playwright-merge-monocart-reports-1  |
playwright-merge-monocart-reports-1  | > monocart-reporter-merge-cli-zip-linux-bug@1.0.0 merge-cli
playwright-merge-monocart-reports-1  | > npx rimraf --glob ./test-reporters/* && npx monocart merge ./shards/**/*.zip -c ./playwright.monocart-reporter-merge.ts --import tsx
playwright-merge-monocart-reports-1  |
playwright-merge-monocart-reports-1  | [MR] merging report data ...
playwright-merge-monocart-reports-1  | [MR] report data loaded: /app/test-reporters/monocart-reporter/.cache/extracted-1/monocart-report.json
playwright-merge-monocart-reports-1  | [MR] generating test report ...
```

5) Note that the Docker container is listing all the files available in the `./shards` folder to show that the glob `./shards/**/*.zip` should find 2 zip files but it seems that the merge CLI is only finding/using one.

## NPM scripts

- `npm run test`: runs all the Playwright tests.
- `npm run first-shard`: runs the first shard of Playwright tests. It uses `--shard 1/2` with Playwright test. After running the tests it copies the result from the monocart-reporter into the `./shards/1` folder.
- `npm run second-shard`: runs the second shard of Playwright tests. It uses `--shard 2/2` with Playwright test. After running the tests it copies the result from the monocart-reporter into the `./shards/2` folder.
- `npm run all-shards`: runs the first and second shards. In the end the monocart-reporter form each of the sharded runs will be in the `./shards` folder.
- `npm run merge-cli`: uses the monocart-reporter merge CLI to merge the results from the Playwright test sharded runs. It merges the reports from `./shards/1` and `./shards/2` folders.
- `npm run docker:merge-cli`: uses Docker to show that the merge CLI doesn't work as expected when merging zip files in linux environments. It executes the monocart-reporter merge CLI to merge the results from the Playwright test sharded runs. It merges the reports from `./shards/1` and `./shards/2` folders.
