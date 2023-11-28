# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [6.0.0](https://github.com/ngneat/overview/compare/v5.1.1...v6.0.0) (2023-11-28)


### ⚠ BREAKING CHANGES

* 🧨 Peer deps are now angular 17 and everything is standalone

### Features

* 🎸 update to ng17 ([99de476](https://github.com/ngneat/overview/commit/99de476ae73e802f0fb85d531f95485d459d8481))

### [5.1.1](https://github.com/ngneat/overview/compare/v5.1.0...v5.1.1) (2023-07-05)


### Bug Fixes

* 🐛 add protection ([b99302b](https://github.com/ngneat/overview/commit/b99302bdcc9cef604220b801f7a7102f1c6cf398))

## [5.1.0](https://github.com/ngneat/overview/compare/v5.0.0...v5.1.0) (2023-07-05)


### Features

* 🎸 add inputs ([7512c83](https://github.com/ngneat/overview/commit/7512c83d454329d4a0717ff2655c1301f1a32671))

## [5.0.0](https://github.com/ngneat/overview/compare/v4.1.0...v5.0.0) (2023-05-29)


### ⚠ BREAKING CHANGES

* 🧨 The context passed to a component is now a signal
* 🧨 peer dependency is now angular v16+

### Features

* 🎸 use signal to provide component context ([2b8aebb](https://github.com/ngneat/overview/commit/2b8aebb9224c1e8b4ee86d1100d1cae1c0aa8f31))


### Bug Fixes

* 🐛 update view on context change ([5f38a78](https://github.com/ngneat/overview/commit/5f38a78d15b31da82757538a864adf5a5f6ca3ce))


* 🤖 update to angular v16 ([488187c](https://github.com/ngneat/overview/commit/488187c8b333c916b9a7ba9a2c60196eee0df604))

## [4.1.0](https://github.com/ngneat/overview/compare/v4.0.1...v4.1.0) (2023-02-09)


### Features

* 🎸 expose ref for templates ([0d848b1](https://github.com/ngneat/overview/commit/0d848b1e9ef51192fc26c013b27998fac7555690))
* add `injector` option to the template config ([229e725](https://github.com/ngneat/overview/commit/229e725de3428efeb039cd0f0fd3816d711113f3)), closes [#17](https://github.com/ngneat/overview/issues/17)
* add `injector` option to the template config ([d37c6e2](https://github.com/ngneat/overview/commit/d37c6e2264cba8f8764a195a67275ab47e34ce95)), closes [#17](https://github.com/ngneat/overview/issues/17)

### [4.0.1](https://github.com/ngneat/overview/compare/v4.0.0...v4.0.1) (2023-01-28)


### Bug Fixes

* 🐛 pass injector to component ref ([a9d5217](https://github.com/ngneat/overview/commit/a9d5217e7d94c0552f84ddaefd08325828883fe4))

## [4.0.0](https://github.com/ngneat/overview/compare/v3.0.4...v4.0.0) (2023-01-22)


### ⚠ BREAKING CHANGES

* 🧨 build target is now es2022, peer dependency is now angular v14+
* 🧨 build target is now es2020

### Features

* 🎸 support context in components as injection token ([22b8ae0](https://github.com/ngneat/overview/commit/22b8ae0881fc1b8f64c436b9ac2755c27a576ed2))
* 🎸 update to angular v14 ([448f33d](https://github.com/ngneat/overview/commit/448f33d21e1596da64cca7f80f19df63e6712dfd))
* 🎸 update to angular v15 ([ff8ec48](https://github.com/ngneat/overview/commit/ff8ec48eaf8410a40cc848b2a870864c62cad41b))

### [3.0.4](https://github.com/ngneat/overview/compare/v3.0.3...v3.0.4) (2022-01-30)


### Bug Fixes

* 🐛 revert cd call ([24102fc](https://github.com/ngneat/overview/commit/24102fc671879d729f8d1e585e96ae506a798918))

### [3.0.3](https://github.com/ngneat/overview/compare/v3.0.2...v3.0.3) (2022-01-27)


### Bug Fixes

* 🐛 component should run cd ([ebfeda5](https://github.com/ngneat/overview/commit/ebfeda5b4ef0a368465591ec0bb18870baa993e2))

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
