declare abstract class GameObject<Shape extends BaseShape> {
  readonly ['#dbName']: string | null
  readonly ['#collectionName']: string
  ['#data']: Shape

  constructor(data: Shape)
  constructor(dbName: string | null, collectionName: string, data: Shape)
  constructor(dbOrData: Shape | string | null, collectionName?: string, data?: Shape)

  get id(): Shape['_id']
  flush(): Promise<void>
  revoke(): void
  flushAndRevoke(): Promise<void>
}
