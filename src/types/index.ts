export interface UPIProfile {
    id: string;
    upiId: string;
    name: string;
    label: string;
    createdAt: string;
}

export interface QRRecord {
    id: string;
    upiProfileId: string;
    upiId: string;
    name: string;
    label: string;
    amount: number;
    note: string;
    generatedAt: string;
}