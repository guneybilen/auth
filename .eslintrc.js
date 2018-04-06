// 0=off, 1=warn, 2=error. Defaults to 0
module.exports = {

  "extends": "airbnb",
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "modules": true,
      "experimentalObjectRestSpread": true,
    }
  },
  "plugins": [
    "react",
    "react-redux",
    "jsx-a11y",
  ],
  "extends": [
    "plugin:react-redux/recommended"
  ],

  rules: {
    'no-console': 'off',
    "react/jsx-filename-extension": 0,
    "no-use-before-define": 0,
    "jsx-ally/label-has-for": 0,
    "jsx-a11y/anchor-is-valid": ["error", {
      "components": ["Link"],
      "specialLink": ["hrefLeft", "hrefRight", "to"],
      "aspects": ["noHref", "invalidHref", "preferButton"]
    }],
    "quote-props": 0,
    "react/prefer-stateless-function": 0,
    "react/prop-types": ["off", {
      "ignore": ["children"]
    }],
    "import/prefer-default-export": 0,
    "react-redux/connect-prefer-named-arguments": 0,
    "react-redux/prefer-separate-component-file": 0,
  },

  "env": {
    "browser": true,
    "node": true
  }
};