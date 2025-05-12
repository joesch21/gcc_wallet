const backendUrl = import.meta.env.VITE_BACKEND_URL

export const stripeCheckout = async (walletAddress) => {
  console.log('📡 Calling backend with wallet:', walletAddress)
  console.log('🌐 Backend URL:', `${backendUrl}/create-checkout-session`)

  const response = await fetch(`${backendUrl}/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ walletAddress }),
  })

  if (!response.ok) {
    console.error('❌ Stripe session creation failed')
    throw new Error('Failed to create checkout session')
  }

  const data = await response.json()
  console.log('✅ Stripe session created:', data)
  return data
}
