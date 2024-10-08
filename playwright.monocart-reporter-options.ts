import path from "node:path";
import { MonocartReporterOptions } from "monocart-reporter";

export function getMonocartReporterOptions(
  reportersOutputDir: string,
  isShardedTestRun: boolean = false,
  currentShard: number | null = null,
): MonocartReporterOptions {
  const monocartReporterOutputDir: string = path.resolve(reportersOutputDir, "monocart-reporter");
  const zip: string | boolean = isShardedTestRun
    ? path.resolve(monocartReporterOutputDir, `monocart-report-${currentShard}.zip`)
    : false;
  const monocartOptions: MonocartReporterOptions = {
    name: "Demo - merge CLI zip option linux bug",
    outputFile: path.resolve(monocartReporterOutputDir, "monocart-report.html"),
    zip: zip,
  };
  return monocartOptions;
}
