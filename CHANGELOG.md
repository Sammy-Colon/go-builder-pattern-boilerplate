# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.7] - 2025-05-08

### Fixed

- Fix generation error, when using embedded structs like these:

```go

type Struct1 {
	Property string
	Struct2
}

type Struct2 {
	AnotherProperty string
}

```

## [1.0.6] - 2024-03-30

### Fixed

- Struct tags were not ignored, which lead to incorrect code generation

## [1.0.5] - 2024-03-06

### Added

- New code generator
- Option to switch to the old code generator

## [1.0.4] - 2024-01-18

### Changed

- Update README and CHANGELOG

## [1.0.3] - 2024-01-18

### Added

- Support for structs having multiple attributes declared in one line
  - for example with: `A, B, C string`

## [1.0.2] - 2024-01-15

### Changed

- Changes to README and package.json

## [1.0.1] - 2024-01-15

### Added

- Icon for extension

## [1.0.0] - 2024-01-14

- Initial release