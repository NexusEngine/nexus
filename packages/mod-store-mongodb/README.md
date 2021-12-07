# Nexus Engine Store (MongoDB)

A MongoDB store for [Nexus Engine](https://github.com/NexusEngine/nexus).

## Usage

```
npx nexusctl mod install @nexus-engine/mod-store-mongodb
```

In your `.nexus.yml` file:

```yaml
mods:
  # Enable the mod
  - '@nexus-engine/mod-store-mongodb'

storage:
  # Store settings
  store:
    path: mongodb://localhost/db
```
