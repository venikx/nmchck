import * as cdk from "aws-cdk-lib";
import * as path from "path";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

import { HitCounter } from "./hit-counter";

export class NmChckStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const routerLambda = new lambdaNodejs.NodejsFunction(
      this,
      "NmChckRouterLambda",
      {
        entry: path.join(__dirname, "../../packages/lambdas/src/index.tsx"),
        runtime: lambda.Runtime.NODEJS_20_X,
        bundling: {
          minify: true,
          externalModules: ["@hono/jsx"],
        },
      },
    );

    const counterAndRouterLambda = new HitCounter(this, "NmCheckHitCounter", {
      downstream: routerLambda,
    });

    const api = new apigateway.LambdaRestApi(this, "NmChckAppEndpoint", {
      handler: counterAndRouterLambda.handler,
      //deployOptions: {
      //  stageName: "prod",
      //},
    });

    // Output the API endpoint
    //new cdk.CfnOutput(this, 'ApiUrl', {
    //  value: api.url,
    //});
  }
}
