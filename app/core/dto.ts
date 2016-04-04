export interface IBaseDto {
    id?:any;
    createdBy?:any;
    createdAt?:number;
    updatedAt?:number;
}

export interface IUser extends IBaseDto {
    firstname?:string;
    lastname?:string;
    loginname?:string;
    password?:string;
    age?:number;
}

export class User implements IUser {
    constructor(public id?:string,
                public firstname?:string,
                public lastname?:string,
                public age?:number,
                public loginname?:string,
                public password?:string) {
    }
}

export interface IEventDto {
    type:string;
    payload:Object;
}

export class EventDto implements IEventDto {
    constructor(public type?:string,
                public payload?:Object) {
    }
}