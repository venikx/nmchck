import { RemovalPolicy } from "aws-cdk-lib";
import {
  AttributeType,
  Table,
  TableEncryption,
} from "aws-cdk-lib/aws-dynamodb";
import { Code, Function, IFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export interface HitCounterProps {
  downstream: IFunction;
}

export class HitCounter extends Construct {
  public readonly handler: Function;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    const table = new Table(this, "Hits", {
      partitionKey: { name: "path", type: AttributeType.STRING },
      encryption: TableEncryption.DEFAULT,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.handler = new Function(this, "HitCounterHandler", {
      runtime: Runtime.NODEJS_20_X,
      handler: "hit-counter.handler",
      code: Code.fromAsset("src/lambdas"),
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: table.tableName,
      },
    });

    table.grantReadWriteData(this.handler);
    props.downstream.grantInvoke(this.handler);
  }
}
