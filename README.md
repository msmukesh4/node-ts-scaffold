# nodejs - ts - mongodb - di
This is a scaffold project with nodejs and typescript integrated.

## Some important libraries integated
Inversify is used for dependency injection https://www.npmjs.com/package/inversify
Mogoose is used of database https://www.npmjs.com/package/mongoose
Log4j is used for logging https://www.npmjs.com/package/log4js
Nconf is used of managing env config file https://www.npmjs.com/package/nconf

### System Requirements

| Name | Version | Remarks
| ------ | ------ | ------ |
| OS version | Ubuntu 14.04 and above | [https://aws.amazon.com/amazon-linux-ami/] |
| Node.js | 10.0.0 | [https://nodejs.org/en/] |

### Steps to run the code

Install Node JS:v
```sh
# install nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash

# activate nvm
. ~/.nvm/nvm.sh

# install node
nvm install 10.0.0

# check node installation is complete
node -e "console.log('Running Node.js ' + process.version)"
```


Go to the project folder and install dependencies
```sh
cd boutthat-overlay
npm install
```

Source the env file
```sh
source env-configs/dev-env.sh
```

Run the project
```sh

# dubug mode
npm run start:watch

# stage mode
npm run start-stage
```