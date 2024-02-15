# Integrate `LOGIN WITH ASURITE`

## Step 1: GET SIGN IN URL

This is configured in env files and is denoted by `VITE_ASURITE_LOGIN_URL` variable. Each env based URL has a redirect url present in there. Please note that the redirect url has to be whitelisted for the flow to be working.

## Step 2: Create a callback URL

The callback URL path is `/oauth2/callback/`.

## Step 3: Create Callback Handler View

The above callback URL path is mapped by `AuthHandlerView.vue` view present in the `views` folder.

## Step 4: Pass the parsed code gotten in step-3 to get a JWT Token

In `AuthHandlerView.vue` file, we get the code from the URL, and then use this `code` to get the JWT Token for the signed-in user.

## Step 5: Set Auth State's token

We pass the `code` received to `/login/asurite-shibboleth/token` path of UG APP API, and after successful response, we get the `accessToken` for the signed-in user. The `accessToken` is then stored in `cookies` under the name `accessToken`, and its expiry is set to `12 hours`.

## Step 6: Redirect user to dashboard page

Once we get the `accessToken`, and set the `cookies`, we then redirect the signed-in user to the dashboard of the portal.
