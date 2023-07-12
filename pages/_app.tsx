import "../styles/globals.css";
import { AuthContextProvider } from '../context/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  )
}
