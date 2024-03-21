#! /usr/bin/bash

# Variables

IMAGE_NAME=liveness_react_iproov
IMAGE_VERSION=1.2
ACCOUNT_ID=591631576024
REPOSITORY=liveness_react_iproov
REGION=sa-east-1

# Building docker image

docker build -t ${IMAGE_NAME}:${IMAGE_VERSION} . --secret id=npmrc,src=$HOME/.npmrc --no-cache

# Authenticating to AWS ECR

aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

# Creating ECR repository if not exists

# aws ecr create-repository \
#     --repository-name ${IMAGE_NAME} \
#     --image-scanning-configuration scanOnPush=true \
#     --region ${REGION} || true

# Tagging image

docker tag ${IMAGE_NAME}:${IMAGE_VERSION} ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${IMAGE_NAME}:${IMAGE_VERSION}

# Pushing image

docker push ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${IMAGE_NAME}:${IMAGE_VERSION}