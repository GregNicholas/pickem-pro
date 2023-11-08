import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout/Layout";
import Loader from "../components/Loader/Loader";
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

  return (
    <Layout home>
      {isLoading ? <Loader /> 
       : <section className={`${utilStyles.pageContainer} ${utilStyles.headingMd}`}>
        <ul className={utilStyles.nav}>
          <li className={utilStyles.navItem}>
            <Link href="/auth/signin">Sign in!</Link>
          </li>
          <li className={utilStyles.navItem}>
            <Link href="/auth/signup">Sign up!</Link>
          </li>
        </ul>
      </section>}
    </Layout>
  );
}
