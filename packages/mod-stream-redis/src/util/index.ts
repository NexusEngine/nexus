
export function array2object(arr: any[]) {
  const obj: any = {}
  for (let i = 0; i < arr.length; i = i + 2) {
    obj[arr[i]] = arr[i + 1]
  }
  return obj
}

export async function immediate(): Promise<void> {
  return new Promise<void>(resolve => {
    setImmediate(resolve)
  })
}

export async function wait(ms: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms)
  })
}

// For when a plain promise is just too unwieldy
export class Deferred<Type = void> {
  promise: Promise<Type>;
  resolve!: (payload: Type) => void;
  reject!: (error: Error) => void;
  constructor() {
    this.promise = new Promise<Type>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
