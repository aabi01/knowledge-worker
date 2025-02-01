export interface QueryResult {
    queryId: string;
    timestamp: Date;
    data: any[];
    status: 'success' | 'error';
    error?: string;
}
