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
    age?:number;
}

export class User implements IUser {
    constructor(public id?:string,
                public firstName?:string,
                public lastName?:string,
                public age?:number,
                public loginName?:string,
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