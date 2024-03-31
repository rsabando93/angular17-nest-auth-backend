
export interface JwtPayload{
    id: string;
    iat?: number; //fecha de expedicion
    exp?: number; //fecha de expiracion
}