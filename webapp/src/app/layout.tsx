"use client"; // Importante: segnala che questo file è un client component

import React from "react";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_izf16yOTp",
  client_id: "5du99sfhfn8gfeiema5on8d72p",
  redirect_uri: "http://localhost:3000",
  response_type: "code",
  scope: "openid email phone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider {...cognitoAuthConfig}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
