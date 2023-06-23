import Head from "next/head";
import Layout, { siteTitle, name } from "../components/layout";
import utilStyles from "../styles/utils.module.css";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Hello, I'm {name}. I'm a software engineer.</p>
        <p>(Let's play ball!)</p>
      </section>
    </Layout>
  );
}
