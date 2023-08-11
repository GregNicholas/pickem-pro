import { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/Layout";
import { useRouter } from 'next/router';
import { useAuthContext } from '../context/AuthContext';
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from '../lib/posts';

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = await getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    } 
  }, [user]);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>(Let's play ball!)</p>
        <ul className={utilStyles.nav}>
          <li className={utilStyles.navItem}>
            <Link href="/posts/first-post">See our first post! -{">"}</Link>
          </li>
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
