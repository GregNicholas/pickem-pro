import { GetStaticProps } from 'next'
import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle, name } from "../components/layout";
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

  console.log(allPostsData);
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
