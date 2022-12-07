# 👨🏽‍💻 KD Backoffice
KlikDokter Backoffice

## 📌 Features
This project is updated with:

- [React 17x](https://reactjs.org)
- [Nextjs 11x](https://nextjs.org/)
- [Antd 4x](https://ant.design/)
- React Query
- Redux
- i18n
- Less - css module
- Eslint
- Webpack 5

## 🧐 Getting Started

1. Check if your [Node.js](https://nodejs.org/) version is >= 10.13.
2. Clone this repository.
3. Change the package's `name`, `description`, and `repository` fields in `package.json`.
4. Change the name of your app on `public/manifest.json`.
5. Create an env setting `cp .env-example .env`.
6. You can use `npm` or `yarn` for  package manager, eg:
- NPM
  - Run `npm install` to install the dependencies.
  - Run `npm run dev` for development.
  - Run `npm run build:staging` and `npm run start:staging` for staging.
  - Run `npm run build` and `npm run start` for production.

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

You can start editing the page by modifying `src/pages/index.js`. The page auto-updates as you edit the file.

## 🔧 Environment Variables

By default all environment variables loaded through `.env` are only available in the Node.js environment, meaning they won't be exposed to the browser.

In order to expose a variable to the browser you have to prefix the variable with `NEXT_PUBLIC_.` For example:

```js
PORT=8080

NEXT_PUBLIC_API_URL=http://localhost:$PORT/api
NEXT_PUBLIC_WEB_URL=http://localhost:$PORT

# Cookie in days value
COOKIE_DEFAULT_MAXAGE=7
COOKIE_AUTH_MAXAGE=1
```
Reference in the file `.env-example`.

[Learn more](https://nextjs.org/docs/basic-features/environment-variables)

## 🎨 Built-In LESS Support

#### Customize Theme
You can edit the Ant Design Less variables in `src/styles/variables.less` file. A set of less variables are defined for each design aspect that can be customized to your needs.

```css
@primary-color: #1890ff;                    // primary color for all components
@link-color: #1890ff;                       // link color
@success-color: #52c41a;                    // success state color
@warning-color: #faad14;                    // warning state color
@error-color: #f5222d;                      // error state color
@font-size-base: 14px;                      // major text font size
@heading-color: rgba(0, 0, 0, 0.85);        // heading text color
@text-color: rgba(0, 0, 0, 0.65);           // major text color
@text-color-secondary: rgba(0, 0, 0, 0.45); // secondary text color
@disabled-color: rgba(0, 0, 0, 0.25);       // disable state color
@border-radius-base: 2px;                   // major border radius
@border-color-base: #d9d9d9;                // major border color
@box-shadow-base: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
  0 9px 28px 8px rgba(0, 0, 0, 0.05);       // major shadow for layers

```

There are some major variables below, all less variables could be found in [Default Variables](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less).


#### Adding a Global Stylesheet

Create a `pages/_app.js` file if not already present. Then, `import` the `styles.css` file.

```js
require('src/styles/index.less');

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

## 📝 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
