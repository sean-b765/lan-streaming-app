# Local network streaming app

## Prerequisites

- MongoDB installed and running
- [Correct folder structure](https://github.com/sean-b765/media-streaming-server#initialization)
- Express backend running

## Demo

Demo of the player in desktop view
![Player](./demos/player.gif)
Demo of the navigation in mobile view
![Navigation](./demos/series.gif)

## Setup

The end result must be structured like:

local-streaming-app/server
local-streaming-app/client
local-streaming-app/Media

### Server

[View server repository](https://github.com/sean-b765/media-streaming-server)
Following the steps from the above link,

1. Create a [TMDB developer account](https://developers.themoviedb.org/3/getting-started/introduction) to get your API key. Alternatively, use my key: `6a2ae44babf3ff78b6e4d09363704281`
   - _TMDB does not rate limit the key itself, but the IP making the request_. You may have issues if you initialize your database too often, or if you have a large media collection.
2. Rename the `.env.example` file in the `dist` folder to just `.env`. Replace the field `TMDB_API_KEY=[your_tmdb_key]`
3. Ensure the field `DIR=../../Media` accurately reflects your media collection relative to the `dist` folder.
4. Run the commands `npm i`, `cd dist` then `node index.js` to start the server.
5. Enter the initialization endpoint into your web browser

### Client

1. Run `npm i` then `npm start` to start the client. Ensure the server is running.
2. Access via `http://localhost:3000` or your `ipconfig`/`ifconfig` network IPv4 address

### `npm i`

Installs the dependencies

### `npm start`

Starts the client

## Getting Started with Create React App

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
