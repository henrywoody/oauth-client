# OAuth Client

A simple client for one-off OAuth authentication. Useful for quickly getting an OAuth access token to use an API without building full OAuth client functionality.

Implements the client side of the OAuth 2.0 Authorization Framework as defined by [RFC6749](https://datatracker.ietf.org/doc/html/rfc6749), specifically using the [Authorization Code Grant](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1) style.

## Usage

To use this project, build and run the server with either `go run ./*.go` or

```shell
go build -o server ./*.go
./server
```

Then access the site at http://localhost:8080. The port can be customized by setting the environment variable `PORT`.

Fill out the form on the page:

- Provide the authorization endpoint (full URL) of the target application (e.g. "https://example.com/oauth2/authorize")
- Customize the `redirect_uri` key name if necessary. Note that since the name `redirect_uri` is in the spec, most apps use this parameter name, however some may not.
- Provide a value for `client_id`.
- Provide authorization scopes if necessary.
- Add additional parameters if necessary.

When ready, click the "Generate Link" button and follow the displayed link. Authenticate with the target application. Afterwards you will be redirected back to this site.

Fill out the form on the receive code page:

- Provide the token endpoint (full URL) of the target application (e.g. "https://example.com/oauth2/tokens")
- Provide the client ID and client secret given by the target application.
- Some applications require that the client ID and secret be provided in the request body (default is just in the Authorization header). If this is the case for the target application, click the checkbox to include the client credentials in the body.

When ready, click the "Request Tokens" button and the response payload will be displayed on the screen.

## OAuth2 Protocol

The OAuth2 protocol is described by [Section 1.2 of RFC6749](https://datatracker.ietf.org/doc/html/rfc6749#section-1.2) and refresh token handling is described by [Section 1.5](https://datatracker.ietf.org/doc/html/rfc6749#section-1.5).

The overall process is:

1. Client requests authorization from the server. In this case, the client does so by sending the user to the server via the authorization link.
2. Server grants authorization to the client.
3. Client uses the authorization grant to request tokens from the server.
4. The server responds with an access token and, optionally, a refresh token.
5. Client uses the access token to request resources from the server.
6. If a refresh token is given:
   1. The client periodically requests a new access token from the server by providing the refresh token.
   2. The server responds with a new access token.

### Abstract Protocol Flow

```
     +--------+                               +---------------+
     |        |--(A)- Authorization Request ->|   Resource    |
     |        |                               |     Owner     |
     |        |<-(B)-- Authorization Grant ---|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(C)-- Authorization Grant -->| Authorization |
     | Client |                               |     Server    |
     |        |<-(D)----- Access Token -------|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(E)----- Access Token ------>|    Resource   |
     |        |                               |     Server    |
     |        |<-(F)--- Protected Resource ---|               |
     +--------+                               +---------------+
```

Source: Figure 1 of The OAuth 2.0 Authorization Framework by the Internet Engineering Task Force (IETF) ([link](https://datatracker.ietf.org/doc/html/rfc6749#section-1.2)).

### Protocol Flow With Refresh Token

```
  +--------+                                           +---------------+
  |        |--(A)------- Authorization Grant --------->|               |
  |        |                                           |               |
  |        |<-(B)----------- Access Token -------------|               |
  |        |               & Refresh Token             |               |
  |        |                                           |               |
  |        |                            +----------+   |               |
  |        |--(C)---- Access Token ---->|          |   |               |
  |        |                            |          |   |               |
  |        |<-(D)- Protected Resource --| Resource |   | Authorization |
  | Client |                            |  Server  |   |     Server    |
  |        |--(E)---- Access Token ---->|          |   |               |
  |        |                            |          |   |               |
  |        |<-(F)- Invalid Token Error -|          |   |               |
  |        |                            +----------+   |               |
  |        |                                           |               |
  |        |--(G)----------- Refresh Token ----------->|               |
  |        |                                           |               |
  |        |<-(H)----------- Access Token -------------|               |
  +--------+           & Optional Refresh Token        +---------------+
```

Source: Figure 2 of The OAuth 2.0 Authorization Framework by the Internet Engineering Task Force (IETF) ([link](https://datatracker.ietf.org/doc/html/rfc6749#section-1.5)).

