import { useState } from 'react';
import { WalletConnect } from './components/WalletConnect';
import { SendTxForm } from './components/SendTxForm';
import { TxHistory } from './components/TxHistory';
import { useAccount } from 'wagmi';
import { Toaster } from 'react-hot-toast'
import './index.css'

function App() {
  const { isConnected } = useAccount();
  const [txHashes, setTxHashes] = useState<`0x${string}`[]>([]);

  const handleNewTransaction = (hash: `0x${string}`) => {
    setTxHashes((prev) => {
      if (prev.includes(hash)) return prev;
      return [hash, ...prev];
    });
  };

  return (
    <div className="app-container">
      <header>
        <h1>Мій Web3 Додаток</h1>
        <WalletConnect />
      </header>
      <main>
        {isConnected && (
          <>
            <SendTxForm onNewTransaction={handleNewTransaction} />
            <TxHistory hashes={txHashes} />
          </>
        )}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;