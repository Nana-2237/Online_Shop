# Infrastructure templates

These CloudFormation templates replace the generated `template.yaml` with smaller files that are easier to understand.

## Important

Do not commit generated AWS exports that contain live resource IDs or secrets. The original `template.yaml` was generated from existing AWS resources and includes values that should not be public.

## Files

- `network.yaml` creates a VPC, public subnets, internet gateway, route table, and security groups.
- `database.yaml` creates an RDS PostgreSQL database and stores the backend `DATABASE_URL` in Secrets Manager.
- `backend.yaml` creates ECR, ECS Fargate, task definition, service, load balancer, log group, and GitHub Actions deployment role.
- `frontend.yaml` creates an Amplify app and branch for the React frontend.

## Deployment order

1. `network.yaml`
2. `database.yaml`
3. Build and push a first backend image to ECR, or deploy `backend.yaml` with a placeholder image and update later.
4. `backend.yaml`
5. `frontend.yaml`

## Example commands

```bash
aws cloudformation deploy \
  --stack-name gaming-shop-network \
  --template-file infra/network.yaml \
  --region eu-north-1
```

```bash
aws cloudformation deploy \
  --stack-name gaming-shop-database \
  --template-file infra/database.yaml \
  --region eu-north-1 \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    VpcId=<VpcId> \
    PrivateSubnetIds=<subnet-1>,<subnet-2> \
    DatabaseSecurityGroupId=<DatabaseSecurityGroupId> \
    DBPassword=<secure-password>
```

```bash
aws cloudformation deploy \
  --stack-name gaming-shop-backend \
  --template-file infra/backend.yaml \
  --region eu-north-1 \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    VpcId=<VpcId> \
    PublicSubnetIds=<subnet-1>,<subnet-2> \
    BackendSecurityGroupId=<BackendSecurityGroupId> \
    LoadBalancerSecurityGroupId=<LoadBalancerSecurityGroupId> \
    DatabaseUrlSecretArn=<DatabaseUrlSecretArn> \
    BackendImage=<account-id>.dkr.ecr.eu-north-1.amazonaws.com/gaming-shop-backend:latest \
    GitHubRepo=Nana-2237/Online_Shop
```

```bash
aws cloudformation deploy \
  --stack-name gaming-shop-frontend \
  --template-file infra/frontend.yaml \
  --region eu-north-1 \
  --parameter-overrides \
    GitHubRepository=https://github.com/Nana-2237/Online_Shop \
    GitHubAccessToken=<github-token> \
    BackendUrl=https://<backend-load-balancer-dns>
```

## Existing AWS resources

If resources already exist, do not deploy these templates over them with the same names. Either:

- delete/recreate in a test account,
- change resource names using parameters,
- or import existing resources into CloudFormation manually.
