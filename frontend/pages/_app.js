import '../styles/variables.css';
import '../styles/globals.css';
import '../styles/theme.css';
import '../styles/animations.css';
import { useTheme } from '../hooks/useTheme';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; 
  }

  return (
    <div className={theme}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
