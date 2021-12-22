# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.0.2](https://github.com/ngneat/overview/compare/v3.0.1...v3.0.2) (2021-12-22)


### Bug Fixes

* 🐛 resolve view ref type ([a041419](https://github.com/ngneat/overview/commit/a0414193207ac4442c37fd6d1016dfb2600ecd2f))

### [3.0.1](https://github.com/ngneat/overview/compare/v3.0.0...v3.0.1) (2021-12-22)


### Bug Fixes

* 🐛 create view typings ([5df4a42](https://github.com/ngneat/overview/commit/5df4a4238942f5ccbc678555b22b93676865efbf))

## [3.0.0](https://github.com/ngneat/overview/compare/v2.1.0...v3.0.0) (2021-11-16)


### ⚠ BREAKING CHANGES

* The `@ngneat/overview` is shipped with `.mjs` files,
following the APF (Angular Package Format) spec starting from Angular 13.
`.mjs` files are compatible only with Angular 13 version and higher.

### Features

* upgrade to Angular 13 and switch to modern APF ([33f7463](https://github.com/ngneat/overview/commit/33f74636847fbf126abb2bbb152f5bb24789f5b1))
* use new `createComponent` signature ([d47e249](https://github.com/ngneat/overview/commit/d47e249d5a323bc9dd1b7bf6514bcbd5c4d4d548))

## [2.1.0](https://github.com/ngneat/overview/compare/v2.0.4...v2.1.0) (2021-10-25)


### Features

* allow teleport bindings to be passed asynchronously ([05c164f](https://github.com/ngneat/overview/commit/05c164f8cb315e0d309f8e4a71d9dff0b85d9021))

### [2.0.4](https://github.com/ngneat/overview/compare/v2.0.3...v2.0.4) (2021-08-10)


### Bug Fixes

* 🐛 use the directive injector if not provided ([dda0a96](https://github.com/ngneat/overview/commit/dda0a96bc0c394f457e061f0f52399483ad89884))

### [2.0.3](https://github.com/ngneat/overview/compare/v2.0.2...v2.0.3) (2021-08-09)


### Bug Fixes

* 🐛 fix view resolver ([4e34c35](https://github.com/ngneat/overview/commit/4e34c35f4e7c84efb1e20f3c31a636d8785a3838))

### [2.0.2](https://github.com/ngneat/overview/compare/v2.0.1...v2.0.2) (2021-06-02)


### Bug Fixes

* 🐛 revert to view engine ([ffadce2](https://github.com/ngneat/overview/commit/ffadce2a952393e8425ea01b8ba8e305143ee6e5))

### [2.0.1](https://github.com/ngneat/overview/compare/v1.0.0...v2.0.1) (2021-05-28)


### ⚠ BREAKING CHANGES

* **lib:** remove dynamic-content and tplOrString

remove `dynamic-content` and `tplOrString` in favor of the `dynamicView` directive

### Features

* **lib:** add dynamicView directive ([b0b43d4](https://github.com/ngneat/overview/commit/b0b43d41740a31571e975ea536e278508a91c3c2))


### Bug Fixes

* 🐛 detect dynamic content changes ([046277a](https://github.com/ngneat/overview/commit/046277a1363549d266f92d5075d673b8ac559404))

## [2.0.0](https://github.com/ngneat/overview/compare/v1.0.0...v2.0.0) (2021-03-29)


### ⚠ BREAKING CHANGES

* **lib:** remove dynamic-content and tplOrString

remove `dynamic-content` and `tplOrString` in favor of the `dynamicView` directive

### Features

* **lib:** add dynamicView directive ([b0b43d4](https://github.com/ngneat/overview/commit/b0b43d41740a31571e975ea536e278508a91c3c2))

## 1.0.0 (2021-01-28)


### Features

* 🎸 add contect and provider ([8fa76e4](https://github.com/ngneat/overview/commit/8fa76e4d30e60b02adae396cda7fbe272e989978))


### Bug Fixes

* 🐛 destory tpl ([8e4654e](https://github.com/ngneat/overview/commit/8e4654ee74eb8a92e474d4f0170498fc4fd22532))
* 🐛 run cd ([eb250d1](https://github.com/ngneat/overview/commit/eb250d10c8e5b3c19d5cce454a958123d0d5f3a5))
* 🐛 support custom injector ([54c91ed](https://github.com/ngneat/overview/commit/54c91ede16e5ec6330773376df3518f2c1fdc537))
