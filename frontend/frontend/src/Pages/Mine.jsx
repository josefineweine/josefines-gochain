import React, { useEffect, useState } from 'react';
import { listTransactions, mine } from '../services/wallet';
import { formatTimestamp, getToken, shortenKey } from '../services/etc';
import { Popup } from '../components/Popup';

export const Mine = () => {
  const [newBlock, setNewBlock] = useState(null);
  const [pendingTx, setPendingTx] = useState(null);
  const [displayPopup, setDisplayPopup] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const showTransactions = async () => {
      try {
        const response = await listTransactions();
        if (response.statusCode === 200) {
          setPendingTx(Object.values(response.data)[0]);
        } else {
          setDisplayPopup({ title: 'Error', text: response.error });
        }
      } catch (error) {
        setDisplayPopup({ title: 'Error', text: 'Server error' });
      }
    };
    showTransactions();
  }, [newBlock]);

  const handleClick = async () => {
    const token = getToken();
    if (!token || token === 'undefined') {
      return setDisplayPopup({ title: 'Error', text: 'You need to be logged in to proceed.' });
    }

    try {
      setLoading(true);
      const response = await mine(token);
      if (response.statusCode === 200) {
        setTimeout(() => {
          setLoading(false);
          setNewBlock(response.data);
        }, 3000);
      } else {
        setDisplayPopup({ title: 'Error', text: response.error });
      }
    } catch (error) {
      setDisplayPopup({ title: 'Error', text: 'Server error' });
    }
  };

  const formatPending = (data) => {
    if (data) {
      const senderAddress = pendingTx.inputMap.address;
      const senderValue = data[senderAddress];
      const formattedData = Object.entries(data).filter(([key]) => key !== senderAddress);
      return (
        <>
          <div>Sender: {shortenKey(senderAddress)}, Remaining balance: {senderValue}</div>
          {formattedData.map(([key, value], index) => (
            <div key={index}>
              Recipient: {shortenKey(key)}, Amount: {value}
            </div>
          ))}
        </>
      );
    }
  };

  const formatLatest = (data) => (
    data.map((tx, txIndex) => (
      <React.Fragment key={txIndex}>
        <div className="latest-value">Batch {txIndex === 0 ? 'A' : 'B'}:</div>
        <div className="latest-value">Sender: {shortenKey(tx.inputMap.address)}</div>
        {Object.entries(tx.outputMap).map(([address, value], index) => (
          address !== tx.inputMap.address && (
            <div className="latest-value" key={index}>
              Recipient: {shortenKey(address)}, Amount: {value}
            </div>
          )
        ))}
        <br />
      </React.Fragment>
    ))
  );

  return (
    <>
      <main className="mine-wrapper">
        <section className="mine-button">
          <div className="button-control">
            <button onClick={handleClick}>
              <span>Let's mine!</span><br /><br />
            </button>
          </div>
        </section>

        <section className="pending-transactions">
          {pendingTx && (
            <>
              <h2>Pending transactions</h2>
              <div className="pending">
                <h3><IconRotateDot /> Transaction pool:</h3>
                <div className="pending-multi">{formatPending(pendingTx.outputMap)}</div>
                <br />
                <div className="pending-single">Transaction id: {pendingTx.id}</div>
                <div className="pending-single">Timestamp: {formatTimestamp(pendingTx.inputMap.timestamp)}</div>
              </div>
            </>
          )}
        </section>

        {loading && (
          <div className="loading-wrapper">
            <div className="loading"></div>
            <h3>Mining...</h3>
          </div>
        )}

        <section className="latest-block-wrapper">
          {newBlock && !loading && (
            <>
              <h2>Mined block</h2>
              <div className="latest-block">
                <h3><IconBox /> Block data:</h3>
                <div className="latest-single">Hash: {newBlock.hash}</div>
                <div className="latest-single">Difficulty: {newBlock.difficulty}</div>
                <div className="latest-single">Nonce: {newBlock.nonce}</div>
                <div className="latest-single">Time: {formatTimestamp(newBlock.timestamp)}</div>
                <div className="latest-single">Last hash: {newBlock.lastHash}</div>
                <h3><IconSquareChevronsRight /> Transactions in the block:</h3>
                <div className="latest-multi">{formatLatest(newBlock.data)}</div>
              </div>
            </>
          )}
        </section>
      </main>
      {displayPopup && <Popup setDisplayPopup={setDisplayPopup} displayPopup={displayPopup} />}
    </>
  );
};
