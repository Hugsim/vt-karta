export type PropsWithKey<T> = T & { key: React.Key | null | undefined };

export type StopAreas = {
    stopAreas: Array<StopArea>;
    links: {
        previous: string;
        next: string;
        current: string;
    };
    properties: {
        limit: number;
        offset: number;
        size: number;
    };
};
export type StopArea = {
    gid: string;
    number: number;
    name: string;
    shortName: string | null;
    abbreviation: string | null;
    municipality: null;
    tariffZones: null;
    interchangePriorityLevel: number;
    transportAuthority: null;
    interchangePriorityMessage: string;
    defaultInterchangeDurationSeconds: number;
    geometry: {
        northingCoordinate: number;
        eastingCoordinate: number;
        wkt: string;
        srid: number;
        coordinateSystemName: string;
    };
    validFromDate: string;
    validUpToDate: string;
    stopPoints: null;
};
