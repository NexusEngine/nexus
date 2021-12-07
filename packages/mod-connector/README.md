# Nexus Engine Connector

Provides the following:

- Remote REPL over TCP
- HTTP management/admin interface

## Usage

```
npx nexusctl mod install @nexus-engine/mod-connector
```

In your `.nexus.yml` file:

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

To connect to the REPL:

```
npx nexusctl connect tcp://localhost:3406
```
