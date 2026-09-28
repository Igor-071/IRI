module.exports = {
  // Run prettier on all supported files
  "**/*.{js,jsx,ts,tsx,json,css,scss,md}": ["prettier --write"],
  // Run ESLint on JS/TS files
  "**/*.{js,jsx,ts,tsx}": ["eslint --fix"]
}
