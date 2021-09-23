import { GetServerSideProps } from "next";
import Head from "next/head";
import { getPrismicClient } from "../../services/prismic";

import styles from "./post.module.scss"
import { RichText } from "prismic-dom";
import { getSession } from "next-auth/client";

interface Props {
  post:  {
    slug: string;
    title: string;
    content: string;
    updateAt: string;
  }
}

export default function PostPreview({ post }: Props) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updateAt}</time>
          <div 
            className={styles.postContent} 
            dangerouslySetInnerHTML={{__html: post.content}} 
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params, locale, resolvedUrl }) => {
  const session = await getSession({ req })
  const { slug } = params

  if (!session?.userActiveSubscription && !slug.includes("preview")){
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const prismic = getPrismicClient()

  const response = await prismic.getByUID("publicatio", String(slug), {})

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updateAt: new Date(response.last_publication_date).toLocaleDateString()
  }

  return {
    props: {
      post
    }
  }
}
