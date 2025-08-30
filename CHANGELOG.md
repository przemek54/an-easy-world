# Changelog

All notable changes to this project will be documented in this file. This changelog only documents the script for An Easy World, not the map itself.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] - 2025-30-08
### Added
- Support for multiple flags for one country. This change targets Israel and Palestine, which are treated as one country in the script.
- Flags for Reunion, Saint Pierre and Miquelon, and French Guiana.

## [0.2.1] - 2025-23-08 [HOTFIX]
### Fixed
- Match the current version of flag-icons.

## [0.2.0] - 2025-23-08
### Added
- New flags for Alaska, Hawaii, Azores and Madeira.
- Combined flag for Israel and Palestine.

### Changed
- Merge Israel and Palestine in the country database.
- Interceptor now triggers whenever a round begins, rather than running continously in the background.
- Switch from map names to map IDs as compatibility verification.
- Give console errors and messages an \[AEW\] tag.

### Fixed
- Fix an issue where certain panoramas couldn't have their coordinates fetched.
- Make tracking URL changes (to enable/disable the script) lighter and more reliable.
- Interceptor disables completely when not playing compatible maps.

## [0.1.2] - 2025-29-01
### Changed
- AEW icon is now an .ico file.

## [0.1.1] - 2025-15-01
### Added
- Connect to external URLs through @connect tags. Users no longer need to manually whitelist connections.

## [0.1.0] - 2025-14-01
### Added
- Tips for GeoGuessr map "An Easy World" fetched from the database.
- Display hint content, notes, credits, and images.
- Reveal Mode to hide place names and images, disabled by default.
- Show/Hide the UI based on currently open map.

### Changed
- Transition to Semantic Versioning (SemVer).
- Reclassify version from `1.0.5` to `0.1.0` to indicate pre-release status.