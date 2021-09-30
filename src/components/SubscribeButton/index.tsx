import { signIn, useSession } from "next-auth/client"
import { useRouter } from "next/router"
import { useCallback } from "react"
import { api } from "../../services/api"
import { getStripeJs } from "../../services/stripe-js"
import styles from "./styles.module.scss"

export function SubscribeButton() {
  const [session] = useSession()
  const router = useRouter()

  const handleSubscribe = useCallback(
    async () => {
      if (!session){
        signIn("github")
        return;
      }

      if (session.activeSubscription){
        router.push("/posts")
        return;
      }

      try {
        const response = await api.post("/subscribe")

        const { sessionId } = response.data

        const stripe = await getStripeJs()

        stripe.redirectToCheckout({ sessionId })
      } catch (error) {
        alert(error.message)
      }
    },
    [session, router],
  )

  return (
    <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
      Subscribe now
    </button>
  )
}