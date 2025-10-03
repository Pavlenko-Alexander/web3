import { useWaitForTransactionReceipt } from 'wagmi';

function TransactionItem({ hash }: { hash: `0x${string}` }) {
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({ hash });

  const getStatus = () => {
    if (isLoading) return 'pending...';
    if (isSuccess) return 'success!';
    if (isError) return 'fail!';
    return 'pending...';
  };

  return (
    <li>
      <p>Хеш: <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank">{hash}</a></p>
      <p>Статус: {getStatus()}</p>
    </li>
  );
}

export function TxHistory({ hashes }: { hashes: `0x${string}`[] }) {
  if (hashes.length === 0) {
    return null;
  }

  return (
    <div className="tx-history">
      <h3>Останні транзакції</h3>
      <ul>
        {hashes.map((hash) => (
          <TransactionItem key={hash} hash={hash} />
        ))}
      </ul>
    </div>
  );
}