# Swiggy API Proxy Server

This project is a simple Node.js web server that acts as a proxy for fetching data from the third-party Swiggy API and exposing it to the client application, YumYum. The primary purpose of this server is to avoid CORS (Cross-Origin Resource Sharing) errors that may occur when directly accessing the Swiggy API from the client-side.

## How it Works

The Swiggy API proxy server serves as an intermediary between the YumYum client app and the Swiggy API. When the client app sends a request for data, it is sent to the proxy server. The server, in turn, fetches the requested data from the Swiggy API on behalf of the client and forwards it back as a response.

By using this proxy server, the client app can avoid any CORS-related issues that might occur due to the restrictions imposed by the Swiggy API.
