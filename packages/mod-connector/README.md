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
  - '@nexus-endine/mod-connector'

# Connector settings
connector:
  # TCP path to listen on
  path: tcp://localhost:3406
```
