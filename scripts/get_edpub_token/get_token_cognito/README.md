# Signing into Cognito via the API

Signing into cognito via the api is not as straight-forward as it seems, so the following scripts have been generated to aid in the process. Be sure that to have set the USERNAME and PASSWORD variables before running any of the scripts. If accessing any environment other than SIT, the following variables should also be set:
* AUTH_DOMAIN
* CLIENT_ID
* REDIRECT_URI

## Running The Scripts

Before running any of the scripts, create a env.sh file to hold the necessary environment variables

```bash
cp example-env.sh env.sh
```

Update at least the username and password variables to the appropriate cognito username and password values.

### Bash Script

To get an authentication token via the bash script, run the following commands:

```bash
source env.sh
cd bash
bash get_token.sh
```

### Python Script

To get an authentication token via the python script, run the following commands:

```bash
source env.sh
cd python
pip3 install -r requirements.txt
python3 get_token.py
```

### Node Script

Note that the recommended Node version for this script is v16.13.2. To get an authentication token via the node script, run the following commands:

```bash
source env.sh
cd node
nvm use
npm i
node get_token.js
```