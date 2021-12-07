# Nexus Engine Stream (Redis)

A Redis store for [Nexus Engine](https://github.com/NexusEngine/nexus).

## Usage

```
npx nexusctl mod install @nexus-engine/mod-stream-redis
```

In your `.nexus.yml` file:

```yaml
mods:
  # Enable the mod
  - '@nexus-engine/mod-stream-redis'

storage:
  # Stream settings
  stream:
    path: redis://localhost
```
