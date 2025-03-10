## [0.5.4](https://github.com/chouchouji/alias-manager/compare/v0.5.3...v0.5.4) (2025-03-10)

### Bug Fixes

- don't allow to add duplicate alias to the group ([339eefe](https://github.com/chouchouji/alias-manager/commit/339eefe3c54c4aaf7a7f1b5b0aea013e1ec4ba8f))

## [0.5.3](https://github.com/chouchouji/alias-manager/compare/v0.5.2...v0.5.3) (2025-03-09)

### Bug Fixes

- update localization strings for alias prompts and warnings ([bbdcdc7](https://github.com/chouchouji/alias-manager/commit/bbdcdc73768a2ccfbe1add3f8b705fbd64118d64))

### Features

- support selective deletion instead of deleting all items ([#22](https://github.com/chouchouji/alias-manager/issues/22)) ([1e67743](https://github.com/chouchouji/alias-manager/commit/1e677434f9bac53b81519ebf71c46e658bb293cb))

## [0.5.2](https://github.com/chouchouji/alias-manager/compare/v0.5.0...v0.5.2) (2025-02-15)

### Bug Fixes

- resolve display exception when command contains equal sign ([#21](https://github.com/chouchouji/alias-manager/issues/21)) ([58fb373](https://github.com/chouchouji/alias-manager/commit/58fb373ee1cd79c0556431b4e84f944cba8600ae))

### Performance Improvements

- remind user to create file if there is no .zshrc file available ([e8bc6ff](https://github.com/chouchouji/alias-manager/commit/e8bc6ffa3857a65c78cda6eb2781e65d7a708c1c))
- skip to resolving clipboard when target alias is subset of source alias ([4a00c8f](https://github.com/chouchouji/alias-manager/commit/4a00c8f209bec514cd9dfd09664d301e27d8c44e))

# [0.5.0](https://github.com/chouchouji/alias-manager/compare/v0.4.3...v0.5.0) (2025-02-13)

### Features

- support exporting all alias to json file ([ee44980](https://github.com/chouchouji/alias-manager/commit/ee4498063fd4c5799b5f4f60ca6a539a4bb23592))
- support resolving alias from clipboard ([9d4b80d](https://github.com/chouchouji/alias-manager/commit/9d4b80dad750ad9d3b78312eb09432aaa680298e))
- support resolving json file ([c010944](https://github.com/chouchouji/alias-manager/commit/c0109443f4c954f3ea4fbef773e7e97d1dd9d3ab))

## [0.4.3](https://github.com/chouchouji/alias-manager/compare/v0.4.2...v0.4.3) (2025-02-09)

### Performance Improvements

- remind user if the store path does not exist when init or changing path ([b6d49d4](https://github.com/chouchouji/alias-manager/commit/b6d49d45d7e1faa6c8742c9a6e14d31f8abfe5b7))

## [0.4.2](https://github.com/chouchouji/alias-manager/compare/v0.4.1...v0.4.2) (2025-01-08)

## [0.4.1](https://github.com/chouchouji/alias-manager/compare/v0.4.0...v0.4.1) (2025-01-04)

# [0.4.0](https://github.com/chouchouji/alias-manager/compare/v0.3.6...v0.4.0) (2024-12-20)

## [0.3.6](https://github.com/chouchouji/alias-manager/compare/v0.3.5...v0.3.6) (2024-12-13)

### Performance Improvements

- add second confirmation modal for deleting all aliases ([7027638](https://github.com/chouchouji/alias-manager/commit/7027638cf868b0275e535c7644de396da235d2e5))
- show warning message when no any group can be added ([e9114dd](https://github.com/chouchouji/alias-manager/commit/e9114ddf39a342d9fee8a0c45040992894c8f1d4))

## [0.3.5](https://github.com/chouchouji/alias-manager/compare/v0.3.4...v0.3.5) (2024-12-10)

## [0.3.4](https://github.com/chouchouji/alias-manager/compare/v0.3.3...v0.3.4) (2024-12-08)

### Features

- support replacing os.homedir() with ~ ([8a95318](https://github.com/chouchouji/alias-manager/commit/8a953180a1beded8d23f64c161e46078215660a4))

## [0.3.3](https://github.com/chouchouji/alias-manager/compare/v0.3.2...v0.3.3) (2024-12-06)

### Features

- support setting command without quote ([#18](https://github.com/chouchouji/alias-manager/issues/18)) ([fde5592](https://github.com/chouchouji/alias-manager/commit/fde55927f614e9ce67022be2dfa2cccc15a7b2a4))

## [0.3.2](https://github.com/chouchouji/alias-manager/compare/v0.3.0...v0.3.2) (2024-12-06)

### Bug Fixes

- get all alias from file after clicking refresh button ([#17](https://github.com/chouchouji/alias-manager/issues/17)) ([a11c09c](https://github.com/chouchouji/alias-manager/commit/a11c09c039a7cc8b6ba2af7ef86680bf5565fb7b))

### Features

- support renaming alias name ([#14](https://github.com/chouchouji/alias-manager/issues/14)) ([c79bd37](https://github.com/chouchouji/alias-manager/commit/c79bd379db4e8ce04518c97d22114fcdf669f9cf))

# [0.3.0](https://github.com/chouchouji/alias-manager/compare/v0.2.5...v0.3.0) (2024-11-30)

## [0.2.5](https://github.com/chouchouji/alias-manager/compare/v0.2.4...v0.2.5) (2024-11-29)

### Bug Fixes

- don't execute unalias command when no any alias ([5d84972](https://github.com/chouchouji/alias-manager/commit/5d8497247fab22a241dc96c017a69afcf5b2cde6))

### Features

- support copying all alias in one group ([4c5ef33](https://github.com/chouchouji/alias-manager/commit/4c5ef336242210d0e3752556c6e032d673f4fcd9))

## [0.2.4](https://github.com/chouchouji/alias-manager/compare/v0.2.3...v0.2.4) (2024-11-19)

### Features

- show frequency in tooltip ([f3a8571](https://github.com/chouchouji/alias-manager/commit/f3a8571e72aefc1da9e2a3721ec1f4de2d9ea7a2))

## [0.2.3](https://github.com/chouchouji/alias-manager/compare/v0.2.1...v0.2.3) (2024-11-17)

### Features

- support setting description ([#12](https://github.com/chouchouji/alias-manager/issues/12)) ([db2273a](https://github.com/chouchouji/alias-manager/commit/db2273af617c3de97860ec87d0a7a34e94e4e084))

## [0.2.1](https://github.com/chouchouji/alias-manager/compare/v0.2.0...v0.2.1) (2024-11-16)

# [0.2.0](https://github.com/chouchouji/alias-manager/compare/v0.1.4...v0.2.0) (2024-11-16)

### Features

- support changing language ([57db0cb](https://github.com/chouchouji/alias-manager/commit/57db0cbb807b0603a013c95c05a429fb3a442308))

## [0.1.4](https://github.com/chouchouji/alias-manager/compare/v0.1.3...v0.1.4) (2024-11-15)

### Bug Fixes

- move commandPalette into menus ([3a77c5d](https://github.com/chouchouji/alias-manager/commit/3a77c5dab12d4f44a6598d7715f74345355a10e8))

## [0.1.3](https://github.com/chouchouji/alias-manager/compare/v0.1.2...v0.1.3) (2024-11-15)

### Bug Fixes

- don't allow to add alias to current group ([ac0a917](https://github.com/chouchouji/alias-manager/commit/ac0a9178795e7eb415d4a02722de0a8a4ae6a6f5))

### Features

- support sorting by alphabet ([#9](https://github.com/chouchouji/alias-manager/issues/9)) ([1a9b94f](https://github.com/chouchouji/alias-manager/commit/1a9b94f87d9e02c1a08236af24f5e684a3d90d14))
- support sorting by frequency ([#11](https://github.com/chouchouji/alias-manager/issues/11)) ([2a7d903](https://github.com/chouchouji/alias-manager/commit/2a7d9038943c91ac9f8b0f183a999dcbe00b126b))

## [0.1.2](https://github.com/chouchouji/alias-manager/compare/v0.1.1...v0.1.2) (2024-11-14)

### Bug Fixes

- don't allow the last char of alias name to be a space ([0f408e9](https://github.com/chouchouji/alias-manager/commit/0f408e9e5c82b0a5051b30ae73412633f0c17f76))

## [0.1.1](https://github.com/chouchouji/alias-manager/compare/v0.1.0...v0.1.1) (2024-11-14)

# [0.1.0](https://github.com/chouchouji/alias-manager/compare/v0.0.10...v0.1.0) (2024-11-14)

### Bug Fixes

- rename same alias for group only ([ff7bdaa](https://github.com/chouchouji/alias-manager/commit/ff7bdaaa12c7ac383bdf1793e93d53f715ac9616))

### Features

- support group ([#8](https://github.com/chouchouji/alias-manager/issues/8)) ([61f94c8](https://github.com/chouchouji/alias-manager/commit/61f94c8cd8c40779693ff877bc962823661f1568))

## [0.0.10](https://github.com/chouchouji/alias-manager/compare/v0.0.9...v0.0.10) (2024-11-12)

### Bug Fixes

- fix alias deletion removing duplicates with the same command ([cbd3cbe](https://github.com/chouchouji/alias-manager/commit/cbd3cbeacda89cb8849f22d276ca7172f48564d2))

### Performance Improvements

- alias or unalias for current active terminal after executing some operations ([9bde539](https://github.com/chouchouji/alias-manager/commit/9bde539c0a9240d084fd9c06a6348f1d6349eb8d))

## [0.0.9](https://github.com/chouchouji/alias-manager/compare/v0.0.8...v0.0.9) (2024-11-12)

### Bug Fixes

- correct the rule of matching alias ([#7](https://github.com/chouchouji/alias-manager/issues/7)) ([642fe4b](https://github.com/chouchouji/alias-manager/commit/642fe4b79af2e48395c8fca7f0b08a0f8b16f871))

## [0.0.8](https://github.com/chouchouji/alias-manager/compare/v0.0.7...v0.0.8) (2024-11-12)

## [0.0.7](https://github.com/chouchouji/alias-manager/compare/v0.0.6...v0.0.7) (2024-11-12)

## [0.0.6](https://github.com/chouchouji/alias-manager/compare/v0.0.5...v0.0.6) (2024-11-11)

### Features

- support copy alias ([7e94c30](https://github.com/chouchouji/alias-manager/commit/7e94c30614b86670a36fcfca6d07e2cc000518ea))

### Performance Improvements

- do nothing after clicking esc ([5598c69](https://github.com/chouchouji/alias-manager/commit/5598c6907584921572a4861d5c62f83e042cddc4))

## [0.0.5](https://github.com/chouchouji/alias-manager/compare/v0.0.4...v0.0.5) (2024-11-10)

## [0.0.4](https://github.com/chouchouji/alias-manager/compare/v0.0.3...v0.0.4) (2024-11-10)

### Bug Fixes

- adapt to double quotes ([920d88c](https://github.com/chouchouji/alias-manager/commit/920d88c8b7c554ef38c0bf8656e30f1cc64eec39))

## [0.0.3](https://github.com/chouchouji/alias-manager/compare/v0.0.2...v0.0.3) (2024-11-10)

## [0.0.2](https://github.com/chouchouji/alias-manager/compare/v0.0.1...v0.0.2) (2024-11-10)

## [0.0.1](https://github.com/chouchouji/alias-manager/compare/a17cae6ad05f3bfe13033cf0f3d8dae407c9f916...v0.0.1) (2024-11-10)

### Bug Fixes

- create new terminal if no any active terminal ([e0a01b0](https://github.com/chouchouji/alias-manager/commit/e0a01b04baadf6953997ee6101fae9e5117a607b))

### Features

- add alias manager activity bar ([a17cae6](https://github.com/chouchouji/alias-manager/commit/a17cae6ad05f3bfe13033cf0f3d8dae407c9f916))
- support add new alias ([2e2ea2a](https://github.com/chouchouji/alias-manager/commit/2e2ea2a19770d95338ba6b716ebb2d49f0747314))
- support custom store path ([797fff1](https://github.com/chouchouji/alias-manager/commit/797fff1969500d4d354a4a28c9bf7d9e1fd2c88d))
- support delete alias ([af0b75e](https://github.com/chouchouji/alias-manager/commit/af0b75e2860974ccfbfe2ff0944f4fb1db1ac335))
- support rename alias ([0920025](https://github.com/chouchouji/alias-manager/commit/0920025fb990e5d14f2af9aaf7bbd742a4f083c3))
- support run alias ([df8805b](https://github.com/chouchouji/alias-manager/commit/df8805b180be8b079bb2548e87b2dcf04033aa2b))
