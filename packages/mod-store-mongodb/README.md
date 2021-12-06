# Nexus Engine Store (MongoDB)

A MongoDB store for [Nexus Engine](https://github.com/NexusEngine/nexus).

## Usage

```
npm i @nexus-engine/mod-store-mongodb --strict-peer-deps
```

In your `.nexus.yml` file:

```yaml
mods:
  # Enable the mod
  - '@nexus-engine/mod-store-mongodb'

# Store settings
store:
  path: mongodb://localhost/db
```
