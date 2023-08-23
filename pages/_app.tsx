import type { AppProps } from 'next/app';
import React from 'react';
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  MoneyCollectOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';

const { Header: LHeader, Content, Footer, Sider } = Layout;

import Head from 'next/head';
import Header from 'components/header';
import { ethers } from 'ethers';
import { Web3ReactProvider } from '@web3-react/core';
import { toast, ToastContainer } from 'react-toastify';
import '../styles/globals.scss';

const DEFAULT_WAIT = 500;
const reloadPage = () => {
  setTimeout(() => {
    window.location.reload();
  }, DEFAULT_WAIT);
};

function MyApp({ Component, pageProps }: AppProps) {
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

  const {
    token: { colorBgContainer }
  } = theme.useToken();

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
        <Header />

        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div className="demo-logo-vertical" />
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['4']}
              items={[MoneyCollectOutlined].map((icon, index) => ({
                key: String(index + 1),
                icon: React.createElement(icon),
                label: `Marketplace`
              }))}
            />
          </Sider>
          <Layout>
            {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
            {/* <Header /> */}

            <Content>
              <div className="layoutcontent">
                <Component {...pageProps} />
              </div>
            </Content>
          </Layout>
        </Layout>
      </Web3ReactProvider>
      <ToastContainer />
    </>
  );
}

export default MyApp;
