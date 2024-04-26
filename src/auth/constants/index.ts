type ConstantsJWT = {
  token_expiration: string;
  token_refresh_expiration: string;
};

export const constantsJWT: ConstantsJWT = {
  token_expiration: '10m', // 10 minutes
  token_refresh_expiration: '1d', // 60 minutes
};
