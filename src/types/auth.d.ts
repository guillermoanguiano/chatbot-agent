export interface UserResponse {
    id: string;
    name: string | null;
    email: string;
    role: 'user' | 'admin';
}

export interface SignUpResponse {
    success?: boolean;
    error?: string;
    user?: UserResponse;
}