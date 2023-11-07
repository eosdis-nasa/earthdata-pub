#!/usr/bin/env python3
#===============================================================================
# AUTH CODE/IMPLICIT GRANTS, WITHOUT PKCE, WITHOUT CLIENT SECRET
#
# Source: https://stackoverflow.com/a/49015716
#===============================================================================

import requests
import json
import sys
import os
import re


## Set cognito variables
auth_domain = os.environ.get('AUTH_DOMAIN', 'edpub-prod.auth.us-west-2.amazoncognito.com')
client_id = os.environ.get('CLIENT_ID', 'aaev820uvfvon2227beng7d68')
response_type = os.environ.get('RESPONSE_TYPE', 'code')
redirect_uri = os.environ.get('REDIRECT_URI', 'https://pub.sit.earthdata.nasa.gov/dashboard/auth')
scope = os.environ.get('SCOPE', 'openid')
state = os.environ.get('STATE', 'dashboard')

cognito_user = os.environ.get('USERNAME')
cognito_pass = os.environ.get('PASSWORD')

# Check user specific variables
if not all([cognito_user, cognito_pass]):
    print('USERNAME and PASSWORD variables must be defined')
    sys.exit(1)

 # Create request session
session = requests.Session()

# Get xsrf token cookie
xsrf_response = session.get(f'https://{auth_domain}/oauth2/authorize', params={
    'response_type': response_type,
    'client_id' : client_id,
    'redirect_uri' : redirect_uri,
    'scope' : scope,
    'state' : state,
})


curl_redirect = xsrf_response.url
csrf_token = session.cookies.get_dict()['XSRF-TOKEN']

# Get auth code from /login endpoint
code_response = session.post(curl_redirect, headers={"cookie": f"XSRF-TOKEN={csrf_token}; Path=/; Secure; HttpOnly"}, data={
    "_csrf": f"{csrf_token}",
    "username": f"{cognito_user}",
    "password": f"{cognito_pass}"
})

auth_code = re.search(r'.*code=(.*)&.*', code_response.url)[1]

# Get tokens from /oauth2/token endpoint
grant_type = 'authorization_code'
token_dict = session.post(f'https://{auth_domain}/oauth2/token', data={
    'grant_type' : grant_type,
    'client_id' : client_id,
    'code' : auth_code,
    'redirect_uri' : redirect_uri
})
print(json.dumps(token_dict.json(), indent=4))