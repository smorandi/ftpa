export interface BaseDto {
    _id?:any;
    createdBy?:any;
    createdAt?:number;
    updatedAt?:number;
}

export interface Contact extends BaseDto {
    email?:string;
    name?:string;
    website?:string;
    industry?:any;
    city?:any;
}

export interface Notification {
    type:string;
    data?:any;
}

export interface ICar {
    id:string;
    vin:string;
    year:string;
    brand:string;
    color:string;
}

export class Car implements ICar {
    constructor(public id?:string, public vin?:string, public year?:string, public brand?:string, public color?:string) {
    }
}