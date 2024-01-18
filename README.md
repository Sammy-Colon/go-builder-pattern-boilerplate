# Go Builder Pattern Boilerplate README

This extension generates the boilerplate code you need when using the builder pattern in Go.

It is available as the **Go Builder Pattern Boilerplate** extension in the [VSC Marketplace](https://marketplace.visualstudio.com/items?itemName=SammyColon.go-builder-pattern-boilerplate) and [VSCodium Marketplace](https://open-vsx.org/extension/SammyColon/go-builder-pattern-boilerplate).

## Features

The extension adds the command **Generate Boilerplate**. Select a struct and execute the command. The generated code will automatically be pasted under your selected text.

Example:

```go
type Config struct {
	Address     string
	Port        uint16
	LogLevel    string
	Environment string
}
```

Select your struct in your editor. Execute the command "Generate Boilerplate" (with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> and typing the command)

It adds the following lines of code:

```go
type ConfigOption func(Config) Config

func WithAddress(address string) ConfigOption {
	return func(config Config) Config {
		config.Address = address
		return config
	}
}

func WithPort(port uint16) ConfigOption {
	return func(config Config) Config {
		config.Port = port
		return config
	}
}

func WithLogLevel(logLevel string) ConfigOption {
	return func(config Config) Config {
		config.LogLevel = logLevel
		return config
	}
}

func WithEnvironment(environment string) ConfigOption {
	return func(config Config) Config {
		config.Environment = environment
		return config
	}
}

func CreateDefaultConfig() Config {
	return Config{}
}

func CreateConfig(options ...ConfigOption) Config {
	config := CreateDefaultConfig()

	for _, option := range options {
		config = option(config)
	}

	return config
}
```

## Release Notes

Release history:

### 1.0.0

Initial release of the extension

### 1.0.1

- Add extension icon

### 1.0.2

- Changes to README and package.json
  
### 1.0.3

- Support for structs having multiple attributes declared in one line
  - for example with: `A, B, C string`

### 1.0.4

- Update README and CHANGELOG

---