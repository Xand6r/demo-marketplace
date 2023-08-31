import type { AppProps } from 'next/app';
import React, { useState } from 'react';
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  MoneyCollectOutlined
} from '@ant-design/icons';
import { Layout, theme } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';

const { Header: LHeader, Content, Footer, Sider } = Layout;

import Head from 'next/head';
import Header from 'components/header';
import { ethers } from 'ethers';
import { Web3ReactProvider } from '@web3-react/core';
import { toast, ToastContainer } from 'react-toastify';
import '../styles/globals.scss';
import { useRouter } from 'next/router';

const DEFAULT_WAIT = 500;
type MenuItem = Required<MenuProps>['items'][number];
const reloadPage = () => {
  setTimeout(() => {
    window.location.reload();
  }, DEFAULT_WAIT);
};
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('MarketPlace', '1', <MoneyCollectOutlined />),
  getItem('Unlisted', '2', <MoneyCollectOutlined />)
];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const routes = {
    1: '/',
    2: '/unlisted'
  };

  function getLibrary(provider: any) {
    const gottenProvider: any = new ethers.providers.Web3Provider(
      provider,
      'any'
    ); // this will vary according to whether you use e.g. ethers or web3.js
    gottenProvider.provider.on('accountsChanged', () => {
      // when account has been changed, refresh the page
      reloadPage();
    });
    gottenProvider.on('network', (_: any, oldNetwork: any) => {
      if (oldNetwork) {
        // when network has been changed, refresh the page
        reloadPage();
      }
    });
    return gottenProvider;
  }

  const changeRoute = (values: any) => {
    const key: keyof typeof routes = values.key;
    router.push(routes[key]);
  };

  const {
    token: { colorBgContainer }
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <Head>
        <title>Gnosis Safe Dapp</title>
        <meta
          name="description"
          content="A Gnosis safe solution by shuaibu alexander"
        />
        <link rel="icon" href="/assets/metamask.svg" />
      </Head>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Header onClick={toggleCollapsed} />
        <div style={{ display: 'flex' }}>
          <div
            style={{
              minWidth: collapsed ? 'fit-content' : '250px'
            }}
          >
            <Menu
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
              theme="dark"
              inlineCollapsed={collapsed}
              items={items}
              onClick={changeRoute}
            />
          </div>
          <section style={{ width: '100%' }}>
            <Component {...pageProps} />
          </section>
        </div>
      </Web3ReactProvider>
      <ToastContainer />
    </>
  );
}

export default MyApp;
