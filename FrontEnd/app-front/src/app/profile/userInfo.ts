export class UserInfo {
    
    private _username: string;
    private _firstName: string;
    private _lastName: string;
    private _age: number;

    constructor() {}

    get username(): string { return this._username; }
    set username(value: string) { this._username = value; }
    get firstName(): string { return this._firstName; }
    set firstName(value: string) { this._firstName = value; }
    get lastName(): string { return this._lastName; }
    set lastName(value: string) { this._lastName = value; }
    get age(): number { return this._age; }
    set age(value: number) { this._age = value; }

}