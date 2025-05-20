const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Keep backend call
export const createWalletFromBackend = async (token) => {
  const response = await fetch(`${backendUrl}/create_wallet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error('❌ Wallet creation failed with status', response.status);
    throw new Error('Wallet creation failed');
  }

  return await response.json();
};

