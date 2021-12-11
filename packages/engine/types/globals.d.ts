/// <reference path="globals/engine.d.ts" />
/// <reference path="globals/shard.d.ts" />
/// <reference path="globals/game.d.ts" />
/// <reference path="globals/store.d.ts" />
/// <reference path="globals/memory.d.ts" />
/// <reference path="globals/stream.d.ts" />

declare namespace Nexus {
  interface BaseProvider {
    readonly connected: boolean,
    connect(): Promise<this>,
    disconnect(): Promise<void>,
  }
}

declare var Engine: Nexus.Engine
declare var Shard: Nexus.Shard
declare var Game: Nexus.Game
declare var Store: Nexus.Store
declare var Memory: Nexus.Memory
declare var Stream: Nexus.Stream

/**
 * Register a `Memory` provider with the given protocol.
 * @param protocol The provider protocol
 * @param factory The factory method
 */
declare function registerMemory(protocol: string, factory: (path: string) => Nexus.Memory): void

/**
 * Build a store for the given path.
 * @param path The path
 */
declare function buildMemory(path: string): Nexus.Memory

/**
 * Register a `Store` provider with the given protocol.
 * @param protocol The provider protocol
 * @param factory The factory method
 */
declare function registerStore(protocol: string, factory: (path: string) => Nexus.Store): void

/**
 * Build a store for the given path.
 * @param path The path
 */
declare function buildStore(path: string): Nexus.Store

/**
 * Register a `Stream` provider with the given protocol.
 * @param protocol The provider protocol
 * @param factory The factory method
 */
declare function registerStream(protocol: string, factory: (path: string) => Nexus.Stream): void

/**
 * Build a store for the given path.
 * @param path The path
 */
declare function buildStream(path: string): Nexus.Stream
