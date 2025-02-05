//import * as route53 from "aws-cdk-lib/aws-route53";
import * as s3 from "aws-cdk-lib/aws-s3";
//import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
//import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import { CfnOutput, Duration, RemovalPolicy, Stack } from "aws-cdk-lib";
//import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import * as path from "path";

//export interface StaticSiteProps {
//  domainName: string;
//  siteSubDomain: string;
//}

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
export class StaticSite extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name);

    //const zone = route53.HostedZone.fromLookup(this, "Zone", {
    //  domainName: props.domainName,
    //});
    //const siteDomain = props.siteSubDomain + "." + props.domainName;
    //const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
    //  this,
    //  "cloudfront-OAI",
    //  {
    //    comment: `OAI for ${name}`,
    //  },
    //);

    //new CfnOutput(this, "Site", { value: "https://" + siteDomain });

    const siteBucket = new s3.Bucket(this, "NmChckSiteBucket", {
      //bucketName: "nmchck-bucket",
      //publicReadAccess: false,
      //blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
      autoDeleteObjects: true, // NOT recommended for production code
    });

    // Grant access to cloudfront
    //siteBucket.addToResourcePolicy(
    //  new iam.PolicyStatement({
    //    actions: ["s3:GetObject"],
    //    resources: [siteBucket.arnForObjects("*")],
    //    principals: [
    //      new iam.CanonicalUserPrincipal(
    //        cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId,
    //      ),
    //    ],
    //  }),
    //);
    //new CfnOutput(this, "Bucket", { value: siteBucket.bucketName });

    // TLS certificate
    //const certificate = new acm.Certificate(this, "SiteCertificate", {
    //  domainName: siteDomain,
    //  validation: acm.CertificateValidation.fromDns(zone),
    //});

    //new CfnOutput(this, "Certificate", { value: certificate.certificateArn });

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(
      this,
      "NmCheckDistribution",
      {
        //certificate: certificate,
        defaultRootObject: "index.html",
        //domainNames: [siteDomain],
        //minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
        //errorResponses: [
        //  {
        //    httpStatus: 403,
        //    responseHttpStatus: 403,
        //    responsePagePath: "/error.html",
        //    ttl: Duration.minutes(30),
        //  },
        //],
        //defaultBehavior: {
        //  origin: new cloudfront_origins.S3Origin(siteBucket, {
        //    originAccessIdentity: cloudfrontOAI,
        //  }),
        //  compress: true,
        //  allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        //  viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        //},
        defaultBehavior: {
          origin: new cloudfront_origins.S3Origin(siteBucket), // Automatically creates a S3OriginAccessControl construct
        },
      },
    );

    //new CfnOutput(this, "DistributionId", {
    //  value: distribution.distributionId,
    //});

    // Route53 alias record for the CloudFront distribution
    //new route53.ARecord(this, "SiteAliasRecord", {
    //  recordName: siteDomain,
    //  target: route53.RecordTarget.fromAlias(
    //    new targets.CloudFrontTarget(distribution),
    //  ),
    //  zone,
    //});

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [
        s3deploy.Source.asset(
          path.join(__dirname, "../../frontend/.output/public"),
        ),
      ],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
