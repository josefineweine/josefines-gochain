import React, { useEffect, useState } from 'react';
import { listBlocks } from '../services/blockchain';
import { formatTimestamp, shortenKey } from '../services/etc';
import { Popup } from '../components/Popup';

export const Explorer = () => {
  const [blockchain, setBlockchain] = useState(false);
  const [showBlock, setShowBlock] = useState(null);
  const [displayPopup, setDisplayPopup] = useState("");

  const formatLatest = (data) => {
    return data.map((tx, txIndex) => (
      <React.Fragment key={txIndex}>
        <div className="blockchain-value">Batch {txIndex === 0 ? "A" : "B"}:</div>
        <div className="blockchain-value">Sender: {shortenKey(tx.inputMap.address)}</div>
        {Object.entries(tx.outputMap).map(([address, value], index) => {
          const senderAddress = tx.inputMap.address;
          if (address !== senderAddress) {
            return (
              <div className="blockchain-value" key={index}>
                Recipient: {shortenKey(address)}, Amount: {value}
              </div>
            );
          }
          return null;
        })}
        <br />
      </React.Fragment>
    ));
  };

  useEffect(() => {
    const showBlockchain = async () => {
      try {
        const chain = await listBlocks();
        setBlockchain(true);
        if (chain) {
          const blocks = chain.data.map((block, index) => (
            <section key={block.hash} className="block">
              <h2><IconSquaresFilled /> Block</h2>
              <div className="blockchain-single">Time: {formatTimestamp(block.timestamp)}</div>
              <div className="blockchain-single">Hash: {block.hash}</div>
              <div className="blockchain-single">lastHash: {block.lastHash}</div>
              <div className="blockchain-single">Nonce: {block.nonce}</div>
              <div className="blockchain-single">Difficulty: {block.difficulty}</div>
              {index !== 0 && (
                <>
                  <h2><IconTransactionBitcoin /> Transaction</h2>
                  <div className="blockchain-multi">{formatLatest(block.data)}</div>
                </>
              )}
              <div className="connector-wrapper">
                <div className="connector">
                  {index !== 0 ? <IconSeparatorHorizontal /> : <IconSeparator />}
                </div>
              </div>
            </section>
          ));
          setShowBlock(blocks);
        }
      } catch (error) {
        setDisplayPopup({ title: "Error", text: "Server error" });
      }
    };
    showBlockchain();
  }, []);

  return (
    <>
      <main className="explorer-wrapper">
        <h2>Blockchain Overview</h2>
        <section className="show-blocks">
          {blockchain && showBlock}
        </section>
      </main>
      {displayPopup !== "" && (
        <Popup setDisplayPopup={setDisplayPopup} displayPopup={displayPopup} />
      )}
    </>
  );
};
