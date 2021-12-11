# Nexus Engine Stream (Redis)

A Redis logger for [Nexus Engine](https://github.com/NexusEngine/nexus).

## Usage

```
npx nexusctl mod install @nexus-engine/mod-logger-redis
```

In your `.nexus.yml` file:

```yaml
mods:
  # Enable the mod
  - '@nexus-engine/mod-logger-redis'

# Logger configuration
logger:
  # Logger path
  path: redis://localhost
```
