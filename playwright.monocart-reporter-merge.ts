import { reportersOutputDir } from "playwright.shared-vars";
import { getMonocartReporterOptions } from "./playwright.monocart-reporter-options";
import { MonocartReporterOptions } from "monocart-reporter";

const options: MonocartReporterOptions = getMonocartReporterOptions(reportersOutputDir);
export default options;