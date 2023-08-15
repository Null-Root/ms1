class ResponseModel {
    status: string;
    description: string
    payload: any = {}
    
    constructor(_status: string, _description: string) {
        this.status = _status;
        this.description = _description;
    }

    setPayload(value: any) {
        this.payload = value;
        return this;
    }
}

export { ResponseModel }