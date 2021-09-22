import { faunadb } from "../../../services/faunadb";
import { query as q } from "faunadb"
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
) {
  const userRef = await faunadb.query(
    q.Select(
      "ref",
      q.Get(
        q.Match(
          q.Index("users_by_striper_customer_id"),
          customerId
        )
      )
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const subscriptionData = {
    id: subscriptionId,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id
  }

  if(createAction) {
    await faunadb.query(
      q.Create(
        q.Collection("subscriptions"),
        { data: subscriptionData }
      )
    )
  }
  else {
    await faunadb.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index("subscriptions_by_id"),
              subscriptionId
            )
          )
        ),
        { data: subscriptionData }
      )
    )
  }
}