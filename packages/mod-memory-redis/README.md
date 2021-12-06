# Nexus Engine Memory (Redis)

A Redis store for [Nexus Engine](https://github.com/NexusEngine/nexus).

## Usage

```
npm i @nexus-engine/mod-memory-redis --strict-peer-deps
```

In your `.nexus.yml` file:

```yaml
mods:
  # Enable the mod
  - '@nexus-engine/mod-memory-redis'

# Memory settings
memory:
  path: redis://localhost
```
