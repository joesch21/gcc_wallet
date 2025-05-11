export const stripeCheckout = async (walletAddress) => {
  // Replace this with your actual backend endpoint
  const response = await fetch('http://localhost:5000/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress }),
  })

  if (!response.ok) {
    throw new Error('Failed to create checkout session')
  }

  return await response.json()
}
