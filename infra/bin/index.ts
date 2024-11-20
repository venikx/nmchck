#!/usr/bin/env node

import * as cdk from "aws-cdk-lib";
import { NmChckStack } from "../lib/app-stack";

const app = new cdk.App();

new NmChckStack(app, "NmChckStack", {
  env: { region: "eu-north-1" },
});
