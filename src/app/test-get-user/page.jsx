'use client';
import AboutCard from "../components/profileComponents/aboutCard";
import styles from "./page.module.css";
import { prisma } from '@/lib/db';

async function getUserData(){
    const posts = await prisma.fakeUser.findMany({
        where : {id: 1}
    })
    return posts
}

export default async function Home() {
    const posts = await getUserData();
    console.log({posts})
    return (
      <main className={styles.main}>
        <h1>Feed</h1>
        {
          posts.map((post) => {
            return (
              <AboutCard
                key={post.id}
                title={post.title}
                content={post.about}
                fName={post.firstName}
                lName={post.lastName}
              />
            )
          })
        }
      </main>
    )
  }
  