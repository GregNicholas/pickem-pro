import Head from "next/head";
import Image from "next/image";
import styles from "./Layout.module.css";
import utilStyles from "../../styles/utils.module.css";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useAuthContext } from '../../context/AuthContext';

export const siteTitle = "Pickem Hub";

export default function Layout({ children, home=false }) {
  const { user } = useAuthContext();
  const name = user?.displayName || "Welcome";

  const router = useRouter();
  // console.log("LAYOUT ROUTING: ", router.pathname, router.query, router.asPath);
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        {home ? (
          <>
            <Image
              priority
              src="/images/pickem-logo.png"
              height={104}
              width={483}
              alt={name}
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <Image
                priority
                src="/images/pickem-logo.png"
                height={104}
                width={483}
                alt=""
              />
            </Link>
            <h2 className={utilStyles.headingLg}>
              <Link href="/dashboard" className={utilStyles.colorInherit}>
                {name}
              </Link>
            </h2>
          </>
        )}
      </header>
      <main className={styles.main}>{children}</main>
      {(!home && !router.pathname.includes("dashboard")) && (
        <div className={styles.backToHome}>
          {
            router.pathname.includes("leagues") 
            ? <Link href="/dashboard">← Back to dashboard</Link> 
            : <Link href="/">← Back to home</Link> 
          }
        </div>
      )}
    </div>
  );
}
