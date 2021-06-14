# Getting Started with Electron with Create React App

Creating Desktop applications has come a long way. With every passing day, developers come up with easy to use options for creating desktop applications. Electron is one of those solutions. It uses web technologies wrapped around Node.js to come up with web technologies. For a more detailed introduction to the whole Electron.Js ecosystem, you can read [this article](https://www.section.io/engineering-education/cross-platform-applications-electron/).

Electron uses HTML/CSS and JavaScript traditionally. You can use HTML, CSS and vanilla JavaScript to build Electron applications. Other options available include using React and other JavaScript frameworks. In this article, we will accomplish the following:

- Create a React.js app using [Create-React-App](https://reactjs.org/docs/create-a-new-react-app.html)
- Install Electron into the application
- Configure Electron in the React.js app
- Finally, create a demo desktop application using Electron and React.

## Prerequisites

To follow along comfortably with the following tutorial, ensure you have:

- basic knowledge of React and how it works
- Node.js installed. If not, you can install it from [here](https://nodejs.org/en/download/)

### Setup The Application

This guide will use `create-react-app` to scaffold the application. create-react-app is a project generator for React application. In my personal opinion, when building a React app with CRA, it is relatively easier to create desktop applications compared to when you are building the React project from scratch.

Navigate to your working directory. Initialize your React app using `npx` as follows. Make sure to give your project a fancy and memorable name,I will name my application `electron-react-demo`.

```terminal
cd ~/ your-prefered-location

npx create-react-app electron-react-demo
```

The `npx` command will create a React app called `electron-react-demo`.
When that command is finished, navigate into the directory and install electron. you can do this in the terminal like this:

```terminal
cd electron-react-demo

npm i -D electron electron-is-dev
```

The command also installed a useful npm package called `electron-is-dev` for checking whether our electron app is in development or production. You used the `-D` flag so that we can install electron under dev dependancies.

Next, create a configuration file for Electron. Create it in the public folder where all the HTML code is located which in your case is in the `public` folder called electron.js `/public/electron.js`.

The next step is adding the Electron configuration into the file. Paste this code into the `electron.js` file:

```js
const path = require('path');

const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

The code creates a `Browserwindow` instance provided by electron, which is used to render the web contents.It then loads the HTML file in the directory on to the `Browserwindow`. It also handles other window events like `closed` when the window is closed, `focus` when the window is in focus, `ready-to-show` when the web page has been rendered, and window states like `maximize`, `minimize`, `restore`. To read more on the configuration, you can visit the [docs](https://www.electronjs.org/docs/tutorial/quick-start).

The significant change is that you added the a custom html file to be launched. It will be in your build file, which will be the destination in production.

#### Configuring package.json

Now you have electron installed, but  still have to make a few changes in the `package.json` to syncronize the browser and desktop builds. First, update the project's entry file. In your `package.json` file, add this before your scripts:

```json
  "main" : "main": "public/electron.js",
```

Next, install the following packages, `concurrent` and `wait-on`. These packages will listen to the app, and when it launches on the browser, it will launch as an electron app instead.

```terminal
npm i -D concurrently wait-on
```

`Concurently` allows us to run mutliple commands within one script and `wait-on` will wait for port 3000 which is the default CRA port, to launch the app.

The flag, `BROWSER=none` that you passed  in the `dev` script will prevent the browser from launching once the React app compiles successfully. Under `scripts` in your `package.json` file, add:

```json
...
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "dev": "concurrently -k \"BROWSER=none npm start\" \"npm:electron\"",
    "electron": "wait-on tcp:3000 && electron ."
  },
```

And just like that, you have everything set up. Running `npm run dev` should launch an electron app.

### Demo Time

Now that you have everything set up, let's try and build a simple web application using react, and see it become a desktop application.

By the end of this section, you will make a weather application using react. To get started, head over to the [open weather website](https://openweathermap.org/api) and create an account. Once you are signed in, You will be directed to a dashboard.

Navigate to `api-keys` tab and enter the name of an api key in the input provided. I named mine `react demo` and click the `generate` button to create a new api-key for our application. We are doing this to get weather data from the API and feed it into our app.

![dashboard](/dashboard.png)

Npm has a handy package for building out weather components for react applications, its called [react-open-weather](https://www.npmjs.com/package/react-open-weather). It will generate the User interface we want. To install it, in the terminal, type:

```terminal
npm i react-open-weather
```

When that is installed, go ahead and add the component into your react app.

Navigate into your `src` folder and into the `app.js` file, that is where all our work will be, within the `App` function.

First things first, let's import the component from the react-open-weather package. We will import the component and import a helper function for using the open weather api, which is provided by the package.

```js
import ReactWeather, { useOpenWeather } from 'react-open-weather';
```

The import takes place at the very top of your application. Within the App function, use your `useOpenWeather` function to bring in data from the api. This can be achieved by specifying a few necessary things like longitude and latitude, the unit of metrics and also passing your api key.

```js
const { data, isLoading, errorMessage } = useOpenWeather({
  key: 'you api key',
  lat: '1.2921',
  lon: '36.8219',
  lang: 'en',
  unit: 'metric', // values are (metric, standard, imperial)
});
```

This tutorial will use fixed latitude and longitude values. Feel free to make the values dynamic. For instance, You can have an input that the user can enter their prefered longitude an latitude and supply them as variables to the `useOpenWeather` function. You can achieve this using the `useState` hook provided by React.

Finally, in the return statement for the App function, return a beautiful weather component with the data from the API. You will also pass it some information as props. Some of this information includes, unit labels for the data, language, and also pass in the data object. The code will look like this:

```js
<div className='App'>
  <ReactWeather
    isLoading={isLoading}
    errorMessage={errorMessage}
    data={data}
    lang='en'
    locationLabel='Nairobi'
    unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
    showForecast
  />
</div>
```

With that, your weather application is complete. The full code for the app.js file should look like this:

```js
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import './App.css';

function App() {
  const { data, isLoading, errorMessage } = useOpenWeather({
    key: 'you api key',
    lat: '1.2921',
    lon: '36.8219',
    lang: 'en',
    unit: 'metric', // values are (metric, standard, imperial)
  });

  return (
    <div className='App'>
      <ReactWeather
        isLoading={isLoading}
        errorMessage={errorMessage}
        data={data}
        lang='en'
        locationLabel='Nairobi'
        unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
        showForecast
      />
    </div>
  );
}

export default App;
```

You can now launch your application as a desktop application by running `npm run dev`.

It should look like this:

![dashboard](/electron-demo-result.png)

## Conclusion

In this article, we covered how to setup a simple desktop application using `Create-React-App` and Electron. We also created a simple weather application to demonstrate how to everything works together.

Electron offers the power to build desktop applications using Node.js and web technologies. This premise makes it very easy to get started with a desktop application, while also allowing you to wrap existing web projects around electron to make beautiful desktop applications.

You can find the full code for the tutorial [here](https://github.com/katungi/desktop-weather-app-demo)

Happy Coding!
