const backendUrl = import.meta.env.VITE_BACKEND_URL

export const stripeCheckout = async (walletAddress) => {
  const response = await fetch(`${backendUrl}/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress }),
  })

  if (!response.ok) {
    throw new Error('Failed to create checkout session')
  }

  return await response.json()
}
