import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { injected } from "wagmi/connectors";
import axios from "axios";
import { formatUnits } from "viem";

const useEthPrice = (): number | null => {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        setPrice(response.data.ethereum.usd);
      } catch (error) {
        console.error("Error fetching ETH price:", error);
      }
    };
    fetchPrice();
  }, []);

  return price;
};

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const ethPrice = useEthPrice();

  const balance = balanceData ? Number(formatUnits(balanceData.value, balanceData.decimals)) : 0;

  const balanceInUsd =
    balanceData && ethPrice ? balance * ethPrice : 0;

  if (isConnected && balanceData) {
    return (
      <div className="wallet-info">
        <p className="wallet-info__address">Адреса: <strong>{address}</strong></p>
        <p>Баланс: <strong>{balance.toFixed(4)} {balanceData.symbol}</strong></p>
        <p>В доларах (USD): <strong>${balanceInUsd.toFixed(4)}</strong></p>
        <button onClick={() => disconnect()}>Відключити гаманець</button>
      </div>
    );
  }

  return (
    <button className="connect-btn" onClick={() => connect({ connector: injected() })}>
      Підключити гаманець
    </button>
  );
}

