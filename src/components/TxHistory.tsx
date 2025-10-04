import { useEffect, useState } from 'react';
import { formatEther } from 'viem';
import { usePublicClient, useWaitForTransactionReceipt } from 'wagmi';
import { useIsMobile } from '../hooks/useIsMobile';

export function TxHistory({ hashes }: { hashes: `0x${string}`[] }) {
  const client = usePublicClient();

  if (hashes.length === 0) return null;

  return (
    <div className="tx-history">
      <h3>Останні транзакції</h3>
      <table className="tx-table">
        <thead>
          <tr>
            <th>Хеш</th>
            <th>Отримувач</th>
            <th>Сума (ETH)</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {hashes.map((hash) => (
            <TransactionRow key={hash} hash={hash} client={client} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TransactionRow({ hash, client }: { hash: `0x${string}`; client: ReturnType<typeof usePublicClient> }) {
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({ hash });
  const isMobile = useIsMobile()
  const [txInfo, setTxInfo] = useState<{ to?: string; value?: string }>({});

  useEffect(() => {
    async function fetchTx() {
      try {
        const tx = await client?.getTransaction({ hash });
        if (tx) setTxInfo({ to: tx.to ?? 'N/A', value: formatEther(tx.value) });
      } catch (err) {
        console.error(err);
      }
    }
    fetchTx();
  }, [client, hash]);

  const status = isLoading
    ? 'Pending...'
    : isSuccess
    ? 'Success!'
    : isError
    ? 'Fail!'
    : 'Pending...';

  const statusClass = isLoading
    ? 'status-pending'
    : isSuccess
    ? 'status-success'
    : 'status-fail';

  return (
    <tr>
      <td>
        <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noreferrer">
          {isMobile ? `${hash.slice(0, 6)}...` : `${hash.slice(0, 10)}...`}
        </a>
      </td>
      <td>{txInfo.to ? `${txInfo.to.slice(0, 4)}...${txInfo.to.slice(-4)}` : '—'}</td>
      <td>{txInfo.value || '—'}</td>
      <td className={statusClass}>{status}</td>
    </tr>
  );
}
