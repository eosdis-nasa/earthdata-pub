#!/usr/bin/env bash
#===============================================================================
# AUTH CODE/IMPLICIT GRANTS, WITHOUT PKCE, WITHOUT CLIENT SECRET
#
# Source: https://stackoverflow.com/a/49015716
#===============================================================================
 
## Set variables
AUTH_DOMAIN=${AUTH_DOMAIN:-"edpub-prod.auth.us-west-2.amazoncognito.com"}
CLIENT_ID=${CLIENT_ID:-"aaev820uvfvon2227beng7d68"}
RESPONSE_TYPE=${RESPONSE_TYPE:-"code"}
REDIRECT_URI=${REDIRECT_URI:-"https://pub.sit.earthdata.nasa.gov/dashboard/auth"}
SCOPE=${SCOPE:-"openid"}
STATE=${STATE:-"dashboard"}
 
# Check user specific variables
[[ -z $USERNAME ]] || [[ -z $PASSWORD ]] && { echo "USERNAME and PASSWORD variables must be defined"; exit 1; }


## Get xsrf token cookie
curl_response="$(
    curl -svD - "https://${AUTH_DOMAIN}/oauth2/authorize?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&state=${STATE}" 2>&1
)"
curl_redirect="$(printf "%s" "$curl_response" \
                    | awk '/^< location: / {
                        gsub(/\r/, ""); # Remove carriage returns
                        print $3;       # Print redirect URL
                    }')"

csrf_token="$(printf "%s" "$curl_response" \
                   | awk '/^< set-cookie: XSRF-TOKEN/ {
                       gsub(/^XSRF-TOKEN=|;$/, "", $3); # Remove cookie name and semi-colon
                       print $3;                        # Print cookie value
                    }')"
                    
## Get auth code from /login endpoint   
curl_response="$(
    curl -sqv "$curl_redirect" \
        -H "Cookie: XSRF-TOKEN=${csrf_token}; Path=/; Secure; HttpOnly" \
        --data-urlencode "_csrf=${csrf_token}" \
        --data-urlencode "username=${USERNAME}" \
        --data-urlencode "password=${PASSWORD}" 2>&1
)"
curl_redirect="$(printf "%s" "$curl_response" \
                    | awk '/^< location: / {
                        gsub(/\r/, ""); # Remove carriage returns
                        print $3;       # Print redirect URL
                    }')"
auth_code="$(printf "%s" "$curl_redirect" \
                | awk '{
                    sub(/.*code=/, ""); # Remove everything before auth code
                    print;
                }' \
                | awk '{
                	gsub(/&.*/, ""); # Remove everythin after &
                	print;		  # Print auth code
                }')"
                
## Get tokens from /oauth2/token endpoint
GRANT_TYPE="authorization_code"
response="$(curl -s "https://${AUTH_DOMAIN}/oauth2/token" \
    -d "grant_type=${GRANT_TYPE}" \
    -d "client_id=${CLIENT_ID}" \
    -d "code=${auth_code}" \
    -d "redirect_uri=${REDIRECT_URI}"
)"

## Print/pretty print tokens
if ! command -v jq &> /dev/null
then
	echo $response
fi
echo $response | jq
