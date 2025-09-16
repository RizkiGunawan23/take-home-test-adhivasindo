export interface SchemaAnalysis {
    expectedFields: string[];
    requiredFields: string[];
}

export interface ValidationResult {
    expectedFields: string[];
    missingFields: string[];
    unexpectedFields: string[];
}
