[![License](https://img.shields.io/github/license/criteo/android-publisher-sdk.svg)](LICENSE)

# MRAID Bridge
Project for sharing MRAID.js file between [iOS](https://github.com/criteo/ios-publisher-sdk) and [Android](https://github.com/criteo/android-publisher-sdk) SDKs

# Development
Perform following steps to setup for development:
1. Clone project
2. Install Node via [installer](https://nodejs.org/en/download/) or [packageManager](https://nodejs.org/en/download/package-manager/).
3. From root of the project run `npm install`

The following commands are available:

| Command                | Description                                                             |
|:-----------------------|:------------------------------------------------------------------------|
| `npm run lint`         | Runs static code analysis. Outputs errors                               |
| `npm run lintFix`      | Runs static code analysis. Outputs errors and applies fixes if possible |
| `npm run build`        | Transpiles .ts files to appropriate .js files.                          |
| `npm run buildRelease` | Runs `build` and `minify` together                                      |
| `npm run minify`       | Merges everything into 1 file and applies compression                   |
| `npm run test`         | Runs all available tests                                                |

# License
[Apache License v2.0](LICENSE)