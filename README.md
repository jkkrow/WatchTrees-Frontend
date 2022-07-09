# WatchTrees Frontend

A video streaming application which provides on-demand videos (VOD) in adaptive media formats.

## Live Website

[https://watchtrees.com](https://watchtrees.com)

## Features

This application has following features:

- **Adaptive Bitrate Streaming**: It provides videos in CMAF formats which supports adaptive bitrate, by converting source videos in the serverless function asynchronously.

- **Watch Actively with "Select-and-Continue"**: The main concept of this application is allowing viewers to watch videos actively, by selecting next video among multiple choices.

- **User Authentication**: It allows user to sign up and upload videos to share them. You can either sign up with email and password, or using a 3rd party provider (Google account).

- **Token Based Authorization**: It authorizes user with JSON Web Tokens (JWT), by rotating access token with refresh token.

<!-- ## Preview -->

<!-- preview image -->

## Tech Stack

![Typescript](https://img.shields.io/badge/Typescript-3178C6.svg?&style=for-the-badge&logo=Typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAF8.svg?&style=for-the-badge&logo=React&logoColor=black)
![Redux](https://img.shields.io/badge/Redux-764ABC.svg?&style=for-the-badge&logo=Redux&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699.svg?&style=for-the-badge&logo=Sass&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6.svg?&style=for-the-badge&logo=CSS3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26.svg?&style=for-the-badge&logo=HTML5&logoColor=white)
![Amazon AWS](https://img.shields.io/badge/AWS-232F3E.svg?&style=for-the-badge&logo=Amazon+AWS&logoColor=white)
![AWS Amplify](https://img.shields.io/badge/AWS_Amplify-FF9900.svg?&style=for-the-badge&logo=AWS_Amplify&logoColor=white)

## Get Started

To start the project, clone the repository and install dependencies with following command:

```bash
npm install
```

You need to setup environment variables. Create `.env` file and configure necessary variables. Then, start the app by running:

```bash
npm start
```

You also need the API of this project to run the app properly. Go to the repository of [WatchTrees Backend](https://github.com/jkkrow/watchtrees-backend) and follow the specified instruction to start.

## Browser Support

| ![Chrome](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/72.0.0/chrome/chrome.svg)Chrome | ![Firefox](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/72.0.0/firefox/firefox.svg)Firefox |
| :---------: | :---------: |
| Latest &#10003;| Latest &#10003;

## Related Apps

Here are related applications of WatchTrees project.

- [WatchTrees Backend](https://github.com/jkkrow/watchtrees-backend): A REST API for WatchTrees built with Node.js and MongoDB to handle requests from frontend.
- [WatchTrees Lambda](http://github.com/jkkrow/watchtrees-lambda): AWS Lambda function codes for running serverless jobs.
