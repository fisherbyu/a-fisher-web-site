/** Transform model type into Input Form */
export type Input<T> = Omit<T, 'id'>;

/** Transform model type into Update Form */
export type Update<T> = Partial<Input<T>> & { id: number };
