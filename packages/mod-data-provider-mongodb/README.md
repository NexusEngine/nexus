# MongoDB Data Provider

## Usage

```
npm i @nexus-engine/mod-data-provider-mongodb --strict-peer-deps
```

In your `.engine.yaml`:

```yaml
mods:
  # Enable the mod
  - '@nexus-engine/mod-data-provider-mongodb'

storage:
  data:
    # Use the mongodb: protocol to use the provider
    path: mongodb://localhost
```
