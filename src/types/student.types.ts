export interface StudentData {
    nama: string;
    nim: string;
    ymd: string;
}

export interface StudentSearchRequest {
    nama?: string;
    nim?: string;
    ymd?: string;
}

export interface StudentSearchResponse {
    data: StudentData[];
    message: string;
    total: number;
}
