import Link from "next/link";
import Head from "next/head";
import Script from "next/script";
import Layout from "../../components/layout";
import styles from "./posts.module.css";

export default function FirstPost() {
  return (
    <Layout home={undefined}>
      <div className={styles.post}>
      <Head>
        <title>First Post</title>
      </Head>
      {/* // example of loading 3rd party script */}
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      />

      <h1 className={styles.postHeading}>First Post</h1>
      <p>Hello paragraph Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, corrupti ut! Vel nihil velit suscipit? Eius, veniam iusto! Omnis ipsum modi tempore beatae perferendis odio magnam a sequi reprehenderit dolor.</p>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
      </div>
    </Layout>
  );
}
