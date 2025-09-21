
export type SelectResult<
    T extends object, K extends string
> = { [key in K]: T[] } & {
    size: number, 
    total: number,
}

export interface SelectOptions<T extends object> {
    limit: number,
    offset?: number,
    where?: ({
        [key in keyof T]?: T[key] | `{like}=${string}` | null
    }) | ({
        [key in keyof T]?: T[key] | `{like}=${string}` | null
    }[]) | undefined,
    additionalInfo?: { [key: string]: any }
}