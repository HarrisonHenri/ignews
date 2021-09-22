import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { faunadb } from "../../services/faunadb";
import { stripe } from "../../services/stripe";
import { query as q } from "faunadb"

type User = {
  data: {
    striper_customer_id: string
  },
  ref: {
    id: string
  }
}

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })

  const user = await faunadb.query<User>(
    q.Get(
      q.Match(
        q.Index("users_by_email"),
        q.Casefold(session.user.email)
      )
    )
  )

  let customerId = user.data.striper_customer_id

  if (!customerId){
    const newCustomer = await stripe.customers.create({
      email: session.user.email,
    })

    customerId = newCustomer.id

    await faunadb.query(
      q.Update(
        q.Ref(q.Collection("users"), user.ref.id),
        {
          data: {
            striper_customer_id: customerId
          }
        }
      )
    )
  }

  if (req.method === "POST") {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        { price: "price_1JcAZ8KExm12hxBdUkcwdD7R", quantity: 1 }
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: `${process.env.APP_URL}/posts`,
      cancel_url: process.env.APP_URL,
    })

    return res.status(200).json({ sessionId: checkoutSession.id })
  }
  else {
    res.setHeader("Allow", "POST")
    res.status(405).end("Method not allowed")
  }
}

export default subscribe;