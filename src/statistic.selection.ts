
export const possibleTimedStatistic = [
    'total', 

    'thisDay',
    'thisWeek',
    'thisMonth',
    'thisYear',

    'past24hours',
    'past3days',

    'past7days',
    'past14days',
    'past30days',

    'past6months',
    'past12months',
] as const;

export type TimedStatisticKey = typeof possibleTimedStatistic[number];

export type TimedStatisticInfoPart = {
    from: Date | string,
    sum: number,
}
export type TimedStatisticInfo = {
    count: number,
    serverTime: string,
} & {
    [key in TimedStatisticKey]?: TimedStatisticInfoPart | undefined | null
}