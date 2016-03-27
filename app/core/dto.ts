export interface IBaseDto {
    id?:any;
    createdBy?:any;
    createdAt?:number;
    updatedAt?:number;
}

export interface IUser extends IBaseDto {
    firstName?:string;
    lastName?:string;
    loginName?:string;
    password?:string;
}

export interface ICar extends IBaseDto {
    vin?:string;
    year?:string;
    brand?:string;
    color?:string;
}

export class User implements IUser {
    constructor(public id?:string,
                public firstName?:string,
                public lastName?:string,
                public loginName?:string,
                public password?:string) {
    }
}


export class Car implements ICar {
    constructor(public id?:string,
                public vin?:string,
                public year?:string,
                public brand?:string,
                public color?:string) {
    }
}