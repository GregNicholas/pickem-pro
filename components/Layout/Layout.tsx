import Head from "next/head";
import Image from "next/image";
import styles from "./Layout.module.css";
import utilStyles from "../../styles/utils.module.css";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { useRouter } from "next/router";
import { useAuthContext } from "../../context/AuthContext";

export const siteTitle = "Pickem Hub";

export default function Layout({ children, home = false }) {
  const { user } = useAuthContext();
  const name = `${user?.displayName}` || "Welcome";

  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Pro football pickem. Create or join a league and compete."
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle,
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <title>{siteTitle}</title>
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
            <h2 className={`${utilStyles.headingLg} ${styles.headingGreet}`}>
              Welcome
            </h2>
          </>
        ) : (
          <>
            <Image
              priority
              src="/images/pickem-logo.png"
              height={104}
              width={483}
              alt=""
            />
            <h2 className={`${utilStyles.headingMd} ${styles.headingGreet}`}>
              <Link className={styles.headingLink}href="/dashboard"><FaRegUser /> {name}</Link>
            </h2>
          </>
        )}
      </header>
      <main className={styles.main}>{children}</main>
      {!home && !router.pathname.includes("dashboard") && (
        <div className={styles.backToHome}>
          {router.pathname.includes("leagues") && (
            <Link href="/dashboard">← Back to home</Link>
          )}
        </div>
      )}
    </div>
  );
}
