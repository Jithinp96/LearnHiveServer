export interface IGoogleJWT {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    nbf: number;
    name: string;
    picture: string;
    given_name: string;
    iat: number;
    exp: number;
    jti: string;
}