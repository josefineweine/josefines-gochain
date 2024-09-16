import React from 'react';
import goChainImage from '../assets/visual/gochain.webp';

export const Home = () => {
  return (
    <main className="content">
      <h1 className="title">Go-Chain</h1>
      <div className="description">
        <p>
          Welcome to Go-Chain, a simple blockchain that allows you to mine blocks, send transactions, and explore the blockchain.
          <br/><br/>This is the place for you to explore blockchain technology and learn how it works.
        </p>
        <div className="image-container">
          <img src={goChainImage} alt="Go-Chain" />
        </div>
      </div>
    </main>
  );
};
