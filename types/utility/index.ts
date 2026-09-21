/** Transform model type into Input Form */
export type Input<T> = T extends (infer U)[]
    ? Input<U>[]
    : T extends { id: unknown }
      ? { [K in keyof T as K extends 'id' ? never : K]: Input<T[K]> }
      : T;

/** Transform model type into Update Form */
export type Update<T> = Partial<Input<T>> & { id: number };
