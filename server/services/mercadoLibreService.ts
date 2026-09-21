const mercadoLibreConfig = {
  clientId: process.env.MERCADOLIBRE_CLIENT_ID?.trim() ?? "",
  clientSecret: process.env.MERCADOLIBRE_CLIENT_SECRET?.trim() ?? "",
  redirectUri: process.env.MERCADOLIBRE_REDIRECT_URI?.trim() ?? "",
  accessToken: process.env.MERCADOLIBRE_ACCESS_TOKEN?.trim() ?? "",
  refreshToken: process.env.MERCADOLIBRE_REFRESH_TOKEN?.trim() ?? "",
};

export function getMercadoLibreStatus() {
  const hasOAuthConfig = Boolean(
    mercadoLibreConfig.clientId &&
      mercadoLibreConfig.clientSecret &&
      mercadoLibreConfig.redirectUri,
  );
  const connected = Boolean(hasOAuthConfig && mercadoLibreConfig.accessToken);

  return {
    connected,
    label: connected ? "Mercado Libre conectado" : "Mercado Libre no está conectado",
    hasOAuthConfig,
    hasRefreshToken: Boolean(mercadoLibreConfig.refreshToken),
  };
}
