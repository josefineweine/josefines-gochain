import React, { useEffect, useState } from 'react';
import { calculateBalance, sendTransaction } from '../services/wallet';
import { formatTimestamp, getToken, shortenKey } from '../services/etc';
import { Popup } from '../components/Popup';

export const Transact = () => {
  const [tx, setTx] = useState({ recipient: "", amount: "" });
  const [txInput, setTxInput] = useState("");
  const [txReceipt, setTxReceipt] = useState("");
  const [displayPopup, setDisplayPopup] = useState("");
  const [senderInfo, setSenderInfo] = useState({ address: "", balance: "" });

  useEffect(() => {
    const fetchSenderInfo = async () => {
      try {
        const response = await calculateBalance();
        if (response.statusCode === 200) {
          setSenderInfo({ address: response.data.address, balance: response.data.balance });
        }
      } catch (error) {
        setDisplayPopup({ title: "Error", text: "Server error" });
      }
    };
    fetchSenderInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTx((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      return setDisplayPopup({ title: "Error", text: 'You need to be logged in to proceed.' });
    }

    if (!tx.recipient || !tx.amount) {
      return setDisplayPopup({ title: "Error", text: "Input field(s) cannot be empty." });
    }

    const response = await sendTransaction(tx, token);
    if (response.statusCode === 201) {
      setTxReceipt(response.data);
      setTxInput(tx);
      setTx({ recipient: "", amount: "" });
    } else {
      setDisplayPopup({ title: "Error", text: response.error });
    }
  };

  const formatOutputMap = (data) => {
    if (txReceipt) {
      const senderBalance = data[txReceipt.inputMap.address];
      return (
        <>
          <div>Recipient: {txInput.recipient}</div>
          <div>Amount to be received: {txInput.amount}</div>
          <div>Sender: {shortenKey(txReceipt.inputMap.address)}</div>
          <div>Sender remaining balance: {senderBalance}</div>
        </>
      );
    }
  };

  return (
    <>
      <main className="transact-wrapper">
        <h2><IconCoinMoneroFilled /> Send</h2>
        {senderInfo.address && senderInfo.balance && (
          <div className="sender-info">
            <div className="info-item">Sender: {shortenKey(senderInfo.address)}</div>
            <div className="info-item">Starting balance: {senderInfo.balance}</div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tx-recipient">Recipient:</label>
            <input
              type="text"
              id="tx-recipient"
              name="recipient"
              value={tx.recipient}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="tx-amount">Amount:</label>
            <input
              type="number"
              id="tx-amount"
              name="amount"
              value={tx.amount}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="form-actions">
            <button type="submit">Go!</button>
          </div>
        </form>
        {txReceipt && (
          <section className="receipt-section">
            <h2>Verification</h2>
            <div className="receipt">
              <h3>Transaction added to queue:</h3>
              <div className="details">
                {formatOutputMap(txReceipt.outputMap)}
                <div className="detail-item">ID: {txReceipt.id}</div>
                <div className="detail-item">Time: {formatTimestamp(txReceipt.inputMap.timestamp)}</div>
              </div>
            </div>
          </section>
        )}
      </main>
      {displayPopup && <Popup setDisplayPopup={setDisplayPopup} displayPopup={displayPopup} />}
    </>
  );
};
