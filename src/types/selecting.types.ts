
export type SelectResult<
    T extends object, K extends string
> = { [key in K]: T[] } & {
    size: number, 
    total: number,
}

export interface SelectOptions<T extends object> {
    limit: number,
    offset?: number,
    /** Multiple wheres (every array value) = OR value. For AND use same object */
    where?: (SelectOptions.Where<T>) | (SelectOptions.Where<T>[]) | undefined,
    additionalInfo?: { [key: string]: any }
}

export namespace SelectOptions {
    export const IsNull = "{is_null}" as const;
    export const IsNotNull = "{is_not_null}" as const;

    export type Where<T extends object> = {
        [key in keyof T]?: T[key] | `{like}=${string}` 
            | `{not}=${string}` | `{equals}=${string}`
            | '{is_null}' | '{is_not_null}' | null
    } & {
        $or?: Where<T>[] | null,
        $and?: Where<T>[] | null,
    }
}

export function pickAdditionalOptions<T extends object>(object: T
): Omit<T, "limit" | "offset" | "where" | "additionalInfo"> {
    return ((object as any)?.additionalInfo || object || {}) as any;
}