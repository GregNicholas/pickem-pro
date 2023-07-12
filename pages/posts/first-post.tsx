import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/Layout";
import styles from "./posts.module.css";

export default function FirstPost() {
  return (
    <Layout home={undefined}>
      <div className={styles.post}>
      <Head>
        <title>First Post</title>
      </Head>
      <h1 className={styles.postHeading}>First Post</h1>
      <p>Hello paragraph Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, corrupti ut! Vel nihil velit suscipit? Eius, veniam iusto! Omnis ipsum modi tempore beatae perferendis odio magnam a sequi reprehenderit dolor.</p>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
      </div>
    </Layout>
  );
}
