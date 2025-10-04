
import { useEffect, useState } from 'react';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import toast from "react-hot-toast";

interface SendTxFormProps {
  onNewTransaction: (hash: `0x${string}`) => void;
}

export function SendTxForm({ onNewTransaction }: SendTxFormProps) {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const { data: hash, isPending, isSuccess, sendTransaction, error } = useSendTransaction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !amount) return;
    try {
      sendTransaction({ to: to as `0x${string}`, value: parseEther(amount) });
    } catch(error) {
      if (error && typeof error === 'object' && 'message' in error) {
        toast.error(`Помилка: ${(error as { message: string }).message}`);
      } else {
        toast.error('Сталася невідома помилка');
      }
    }
  };

  useEffect(() => {
    if (hash) {
      onNewTransaction(hash);
      setTo('');
      setAmount('');
    }
  }, [hash, onNewTransaction]);

  useEffect(() => {
    if (error) toast.error(`Помилка: ${error.message}`);
    if (isSuccess) toast.success('Транзакція успішно надіслана!');
  }, [error, isSuccess]);

  return (
    <div className="send-tx-container">
      <form onSubmit={handleSubmit} className="send-tx-form">
        <h3>Надіслати транзакцію</h3>
        <input
          type="text"
          placeholder="Адреса одержувача (0x...)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Сума в ETH (наприклад, 0.01)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Надсилання...' : 'Надіслати'}
        </button>
      </form>
      {isPending && <p>Статус: очікування підтвердження у гаманці...</p>}
    </div>
  );
}
