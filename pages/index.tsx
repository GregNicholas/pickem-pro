import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/Layout/Layout";
import { useRouter } from 'next/router';
import { useAuthContext } from '../context/AuthContext';
import utilStyles from "../styles/utils.module.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <div>checking user authentication</div>
  }

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>(Let's go!)</p>
        <ul className={utilStyles.nav}>
          <li className={utilStyles.navItem}>          
            <Link href="/dashboard">Go to Dashboard -{">"}</Link>
          </li>
          <li className={utilStyles.navItem}>
            <Link href="/auth/signin">Sign in! -{">"}</Link>
          </li>
          <li className={utilStyles.navItem}>
            <Link href="/auth/signup">Sign up! -{">"}</Link>
          </li>
        </ul>
      </section>
    </Layout>
  );
}
