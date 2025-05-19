const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const createWalletFromBackend = async (token) => {
  const response = await fetch(`${backendUrl}/create_wallet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}) // or remove body if your backend doesn't require it
  });

  if (!response.ok) {
    console.error('❌ Wallet creation failed with status', response.status);
    throw new Error('Wallet creation failed');
  }

  return await response.json();
};
