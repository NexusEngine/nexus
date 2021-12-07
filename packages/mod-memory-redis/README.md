# Nexus Engine Memory (Redis)

A Redis store for [Nexus Engine](https://github.com/NexusEngine/nexus).

## Usage

```
npx nexusctl mod install @nexus-engine/mod-memory-redis
```

In your `.nexus.yml` file:

```yaml
mods:
  # Enable the mod
  - '@nexus-engine/mod-memory-redis'

storage:
  # Memory settings
  memory:
    path: redis://localhost
```
