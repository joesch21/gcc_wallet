export const createWalletFromBackend = async (token) => {
  const response = await fetch('http://localhost:5000/create-wallet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) throw new Error('Wallet creation failed')
  return await response.json()
}
