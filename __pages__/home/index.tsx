import React from 'react';
import { Menu, Spin } from 'antd';
import type { NextPage } from 'next';
import { LoadingOutlined } from '@ant-design/icons';

import NoSafe from 'components/nosafe';
import SafeInformation from './components/safeinformation';

import { useFetchSafe } from 'hooks/safe/usefetchsafe';

const antIcon = <LoadingOutlined style={{ fontSize: 42 }} spin />;
const Home: NextPage = () => {

  return (
    <div>
      <p>The market place</p>
      <p>list all wagers</p>
    </div>
  );
};

export default Home;
