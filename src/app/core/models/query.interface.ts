export interface Query {
    id: string;
    name: string;
    apiId: string;
    interval: number; // in milliseconds
    parameters: QueryParameter[];
    selectedAttributes: string[];
    isActive: boolean;
    lastExecuted?: Date;
}

export interface QueryParameter {
    name: string;
    value: string;
}
