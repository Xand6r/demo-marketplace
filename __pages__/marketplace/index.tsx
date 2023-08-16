import React from 'react';
import type { NextPage } from 'next';

import styles from './marketplace.module.scss';

const Home: NextPage = () => {
  return (
    <div className={styles.market_place}>
      <p>The market place</p>
      <p>list all wagers</p>
    </div>
  );
};

export default Home;
