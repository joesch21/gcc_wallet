const backendUrl = import.meta.env.VITE_BACKEND_URL

export const stripeCheckout = async (walletAddress, tokenId) => {
  console.log('📡 Calling backend with wallet:', walletAddress)
  console.log('🆔 Token ID:', tokenId)
  console.log('🌐 Backend URL:', `${backendUrl}/create_checkout_session`)

  const response = await fetch(`${backendUrl}/create_checkout_session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ walletAddress, tokenId }),
  })

  if (!response.ok) {
    console.error('❌ Stripe session creation failed')
    throw new Error('Failed to create checkout session')
  }

  const data = await response.json()
  console.log('✅ Stripe session created:', data)
  return data
}
