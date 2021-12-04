# Nexus Connector

Provides remote REPL over TCP.

## Usage

```
npm i @nexus-engine/mod-connector --strict-peer-deps
```

In your `.engine.yaml` file:

```yaml
mods:
  # Enable the mod
  - '@nexus-engine/mod-connector'

# Connector settings
connector:
  # Enable REPL
  repl:
    path: tcp://localhost:3406
  # Enable HTTP API
  http:
    path: http://localhost:3407
```
