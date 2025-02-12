"use client"; // Indica che questa pagina è client-side (può usare useAuth)

import { useAuth } from "react-oidc-context";

export default function HomePage() {
  const auth = useAuth();

  // Esempio di logout con redirect su Cognito
  const signOutRedirect = () => {
    const clientId = "5du99sfhfn8gfeiema5on8d72p";
    const logoutUri = "http://localhost:3000";
    const cognitoDomain = "https://eu-central-1izf16yotp.auth.eu-central-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre>Hello: {auth.user?.profile.email}</pre>
        <pre>ID Token: {auth.user?.id_token}</pre>
        <pre>Access Token: {auth.user?.access_token}</pre>
        <pre>Refresh Token: {auth.user?.refresh_token}</pre>

        {/* 
          Fai attenzione: auth.removeUser() tipicamente
          rimuove il token dalla sessione locale, 
          ma per un logout completo su Cognito potresti usare signOutRedirect 
        */}
        <button onClick={() => auth.removeUser()}>Sign out (local)</button>
        <button onClick={signOutRedirect}>Sign out (Cognito)</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
    </div>
  );
}
