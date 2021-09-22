import { query as q } from "faunadb"
import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { faunadb } from "../../../services/faunadb"

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET_KEY,
      scope: "read:user"
    }),
  ],
  callbacks: {
    async signIn(user) {
      const { email } = user

      try {        
        await faunadb.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index("users_by_email"),
                  q.Casefold(email)
                )
              )
            ),
            q.Create(
              q.Collection("users"),
              {
                data: { email }
              }
            ),
            q.Get(
              q.Match(
                q.Index("users_by_email"),
                q.Casefold(email)
              )
            )
          ),    
        )
        
        return true
      } catch (error) {
        console.log("error", error.responseContent)
        return false
      }
    }
  }
})