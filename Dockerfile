FROM public.ecr.aws/lambda/nodejs:14 as production

WORKDIR /usr/app

COPY index.js package.json  ${LAMBDA_TASK_ROOT}

RUN npm install

COPY /usr/app/node_modules/  ${LAMBDA_TASK_ROOT}/node_modules

CMD ["index.handler"]
