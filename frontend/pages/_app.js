import '../styles/globals.css';
import { useTheme } from '../hooks/useTheme';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    document.body.className = theme;
  }, [theme]);

  if (!isMounted) {
    return null; 
  }

  return <Component {...pageProps} />;
}

export default MyApp;
