#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import { NmChckStack } from './app-stack';

const app = new cdk.App();
new NmChckStack(app, 'NmChckStack');
