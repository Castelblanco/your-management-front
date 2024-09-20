export type TLegalClientDOM = {
    id: string;
    numberMovil: string;
    address: string;
    nit: string;
    businessName: string;
    natural: false;
    status?: TLegalClientStatusDOM;
};

export type TLegalClientStatusDOM = {
    id: string;
    name: string;
};

export type TLegalClientFilterDOM = {
    limit: number;
    offset: number;
    numberMovil?: string;
    address?: string;
    nit?: string;
    businessName?: string;
    statusId?: string;
    status?: boolean;
};

export class LegalClientDOM implements TLegalClientDOM {
    id: string;
    numberMovil: string;
    address: string;
    nit: string;
    businessName: string;
    natural: false;
    status?: TLegalClientStatusDOM;

    constructor(client: TLegalClientDOM) {
        this.id = client.id;
        this.numberMovil = client.numberMovil;
        this.address = client.address;
        this.nit = client.nit;
        this.businessName = client.businessName;
        this.natural = client.natural;
        this.status = client.status;
    }
}
