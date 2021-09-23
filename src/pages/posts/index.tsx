import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { getPrismicClient } from "../../services/prismic";
import Prismic from "@prismicio/client"

import styles from "./styles.module.scss"
import { RichText } from "prismic-dom";

interface Props {
  posts:  {
    slug: string;
    title: string;
    excerpt: any;
    updateAt: string;
  }[]
}

export default function Product({ posts }: Props) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {
            posts.map(({slug,excerpt,title,updateAt})=>(
              <Link href={`/posts/${slug}`} key={slug}>
                <a>
                  <time>{updateAt}</time>
                  <strong>{title}</strong>
                  <p>{excerpt}</p>
                </a>
              </Link>
            ))
          }
        </div>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query([
    Prismic.Predicates.at("document.type", "publicatio")
  ], {
    fetch: ["publicatio.title", "publicatio.content"],
    pageSize: 100
  })

  const posts = response.results.map((post)=>({
    slug: post.uid,
    title: RichText.asText(post.data.title),
    excerpt: post.data.content.find(content => content.type === "paragraph")?.text ?? "",
    updateAt: new Date(post.last_publication_date).toLocaleDateString()
  }))

  return {
    props: {
      posts
    }
  }
}
