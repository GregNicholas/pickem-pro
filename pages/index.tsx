import { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle, name } from "../components/Layout";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Hello, I'm {name}. I'm a software engineer.</p>
        <p>(Let's play ball!)</p>
          <Link href="/posts/first-post">See our first post! -{">"}</Link>
      </section>
    </Layout>
  );
}
