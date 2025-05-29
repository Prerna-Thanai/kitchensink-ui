export interface Member {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  roles: MemberRole[];
  isActive?: boolean;
  blocked?: boolean;
  joiningDate: string;
}

export interface RegisterMemberDto {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  roles: MemberRole[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export type MemberRole = 'ADMIN' | 'USER';
