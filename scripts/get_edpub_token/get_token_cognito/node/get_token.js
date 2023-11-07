#!/usr/bin/node
// ===============================================================================
//  AUTH CODE/IMPLICIT GRANTS, WITHOUT PKCE, WITHOUT CLIENT SECRET
//
//  Source: https://stackoverflow.com/a/49015716
// ===============================================================================

import fetch from "node-fetch";

// Set cognito variables
const authDomain = process.env.AUTH_DOMAIN || 'edpub-prod.auth.us-west-2.amazoncognito.com';
const clientId = process.env.CLIENT_ID || 'aaev820uvfvon2227beng7d68';
const responseType = process.env.RESPONSE_TYPE || 'code';
const redirectURI = process.env.REDIRECT_URI || 'https://pub.sit.earthdata.nasa.gov/dashboard/auth';
const scope = process.env.SCOPE || 'openid';
const state = process.env.STATE || 'dashboard';

const cognitoUser = process.env.USERNAME || '';
const cognitoPass = process.env.PASSWORD || '';

// Check user specific variables
(!cognitoUser || !cognitoPass) && console.log('USERNAME and PASSWORD variables must be defined') && process.exit(1);

// Get xsrf token cookie
async function getXSRFResponse() {
    return await fetch(`https://${authDomain}/oauth2/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectURI}&scope=${scope}&state=${state}`)
}

// Get auth code from /login endpoint
async function getAuthCode(url, token) {
    return await fetch(url, {
        method: 'POST',
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            'cookie': `XSRF-TOKEN=${token}`,
        },
        body: `_csrf=${token}&username=${cognitoUser}&password=${encodeURIComponent(cognitoPass)}`
    }).then(res => res.url.match(/code=(.*)&state/)[1]);
}

// Get tokens from /oauth2/token endpoint
async function getAuthTokens(authCode) {
    const grantType = 'authorization_code';
    return await fetch(`https://${authDomain}/oauth2/token`, {
        body: `grant_type=${grantType}&client_id=${clientId}&code=${authCode}&redirect_uri=${redirectURI}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    }).then(async res => await res.json())
}


async function getEDPubToken() {
    const xsrfResponse = await getXSRFResponse()
    const curlRedirect = xsrfResponse.url
    const csrfToken = xsrfResponse.headers.get('set-cookie').match(/XSRF-TOKEN=(.*); Path/)[1];
    const authCode = await getAuthCode(curlRedirect, csrfToken);
    console.log(await getAuthTokens(authCode))
}

getEDPubToken()
