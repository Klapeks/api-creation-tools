

export interface GeoPoint {
    type: "Point",
    /** [долгота, широта] */
    coordinates: [number, number] 
}

export interface IRedisStorage {
    get: (key: string) => Promise<string | null>,
    set: (key: string, data: string, ...args: any) => Promise<any>
}