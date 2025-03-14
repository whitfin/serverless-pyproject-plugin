# Serverless PyProject Plugin

[![Build Status](https://img.shields.io/github/actions/workflow/status/whitfin/serverless-pyproject-plugin/ci.yml?branch=main)](https://github.com/whitfin/serverless-pyproject-plugin/actions) [![Published Version](https://img.shields.io/npm/v/serverless-pyproject-plugin.svg)](https://npmjs.com/package/serverless-pyproject-plugin) [![Published Downloads](https://img.shields.io/npm/dt/serverless-pyproject-plugin)](https://npmjs.com/package/serverless-pyproject-plugin)

This repository contains a small [Serverless](https://serverless.com) plugin
to enable development using `pyproject.toml` without Poetry.

This is done by exporting the dependencies listing from `pyproject.toml` into
a typical `requirements.txt` file during a Serverless build. This file can then
be picked up by other tools such as [serverless-python-requirements](https://github.com/serverless/serverless-python-requirements)
in order to generate a Python bundle.

## Installation

This plugin is available via npm, so it can be installed as usual:

```bash
$ npm i --save-dev serverless-pyproject-plugin
```

There's no need to include it in your production bundle, so make sure it's saved
inside the development dependencies. Once installed, make sure to add it to your
Serverless plugins list:

```yaml
plugins:
  - serverless-pyproject-plugin
```

The location within the plugin list shouldn't matter, as it's not reacting to
any specific Serverless events. You will also likely want to do the same with
[serverless-python-requirements](https://github.com/serverless/serverless-python-requirements).

## Configuration

The default behaviour of this plugin is to export `dependencies` from your
`pyproject.toml` directly into `requirements.txt`, with no configuration
required. As an example consider the following `pyproject.toml`:

```toml
[project]
name = "my_project"
version = "0.0.0"
dependencies = [
  "fastapi[standard]~=0.115",
  "pydantic~=2.10.1",
  "pydantic-settings~=2.6"
]

[project.optional-dependencies]
lambda = [
  "mangum~=0.19"
]
```

This will produce the following entries inside `requirements.txt`:

```
fastapi[standard]~=0.115,
pydantic~=2.10.1,
pydantic-settings~=2.6
```

By default, no optional dependencies are included (as you can see via the
exclusion of `mangum` above). You can opt into different optional dependencies
via the configuration flag `extras` in your `serverless.yml`:

```yml
custom:
  pyproject:
    extras:
      - lambda
```

This will then include the groups you requested inside the exported file.

```
fastapi[standard]~=0.115,
pydantic~=2.10.1,
pydantic-settings~=2.6
mangum~=0.19
```

## Compatibility

This plugin has been tested against the Serverless v4 release, but will likely
work with many Serverless versions as it's unreliant on almost everything inside
the framework itself. If you have any issues, please do file an issue!
