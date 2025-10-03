import { useState } from 'react';
import { WalletConnect } from './components/WalletConnect';
import { SendTxForm } from './components/SendTxForm';
import { TxHistory } from './components/TxHistory';
import { useAccount } from 'wagmi';

function App() {
  const { isConnected } = useAccount();
  const [txHashes, setTxHashes] = useState<`0x${string}`[]>([]);

  const handleNewTransaction = (hash: `0x${string}`) => {
    setTxHashes((prev) => [hash, ...prev]);
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
    </div>
  );
}

export default App;