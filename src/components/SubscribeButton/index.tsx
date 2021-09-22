import { signIn, useSession } from "next-auth/client"
import { useCallback } from "react"
import { api } from "../../services/api"
import { getStripeJs } from "../../services/stripe-js"
import styles from "./styles.module.scss"

interface Props {
  priceId: string;
}

export function SubscribeButton({ priceId }: Props) {
  const [session] = useSession()

  const handleSubscribe = useCallback(
    async () => {
      if (!session){
        signIn("github")
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
    [session],
  )

  return (
    <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
      Subscribe now
    </button>
  )
}