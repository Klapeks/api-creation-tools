
export type SelectResult<
    T extends object, K extends string
> = { [key in K]: T[] } & {
    size: number, 
    total: number,
}

export type SelectOptionsWhere<T extends object> = {
    [key in keyof T]?: T[key] | `{like}=${string}` | null
} & {
    $or?: SelectOptionsWhere<T>[] | null,
    $and?: SelectOptionsWhere<T>[] | null,
}

export interface SelectOptions<T extends object> {
    limit: number,
    offset?: number,
    /** Multiple wheres (every array value) = OR value. For AND use same object */
    where?: (SelectOptionsWhere<T>) | (SelectOptionsWhere<T>[]) | undefined,
    additionalInfo?: { [key: string]: any }
}

export function pickAdditionalOptions<T extends object>(object: T
): Omit<T, "limit" | "offset" | "where" | "additionalInfo"> {
    return ((object as any)?.additionalInfo || object || {}) as any;
}