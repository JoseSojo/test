
export interface ResponseLogin { 
    response: string,
    body: {
        token:string,
        user: User 
    }  
}

export interface User {
    ci:string,
    email:string,
    id:1,
    last_session:null,
    lastname:string,
    name:string,
    password:null | string,
    phone:string,
    role_id:number,
    session:boolean,
    status_id:number,
    token: null | string,
    role: ROLE,
    status: STATUS_USER
}

export type ROLE = 'DIRECT' | 'ADMIN';

export type STATUS_USER = 'ACTIVE' | 'DISACTIVE' | 'BLOQUED' | 'ALL';

export type SECTION_ADMIN = '' | 'CREATE' | 'ADMINISTRATION';

export type StateFilterAdmins = STATUS_USER
