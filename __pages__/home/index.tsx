import { Card } from 'antd';
import { postReq } from 'api';
import { Button, Space } from 'antd';
import type { NextPage } from 'next';
import styles from './home.module.scss';
import { Image, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import Blockies from 'react-blockies';
import { Pagination } from 'antd';
import { Spin } from 'antd';
import { ethers } from 'ethers';
import { getMarketplaceContract, getMinterContract } from 'utils/contracts';
import { useWeb3React } from '@web3-react/core';

const { Meta } = Card;
const antIcon = <LoadingOutlined style={{ fontSize: 42 }} spin />;

const Home: NextPage = () => {
  const { account, chainId, library } = useWeb3React();
  const [fetchedPosts, setFecthedPosts] = useState<any>({ docs: [] });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  });

  async function fetchWagers() {
    if (loading) return;
    window.scrollTo({ top: 0 });
    setLoading(true);
    try {
      const { data: response } = await postReq('/bets/all', {
        ...pagination
      });
      setFecthedPosts(response.data);
    } catch (err: any) {
      alert(`error loading data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const buyNFT = async (post: any) => {
    const marketContract = getMarketplaceContract(
      `${chainId}`,
      library.getSigner()
    );

    setLoading(true);

    try {
      const buyTx = await marketContract.buyNFT(post.nft.tokenId, {
        value: post.marketplace.price
      });
      const { hash: blockHash } = buyTx;
      const signature = await library.getSigner().signMessage(blockHash);
      await buyTx.wait();

      const payload = {
        blockHash: buyTx.hash,
        tokenId: post.nft.tokenId,
        buyer: account,
        signature: signature
      };
      const response = await postReq('/marketplace/verifysale', payload);
      await fetchWagers();
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWagers();
  }, [pagination]);

  const onpaginationChange = (page: number, pageSize: number) => {
    setPagination({
      page,
      limit: pageSize
    });
  };

  return (
    <div className={styles.marketplace}>
      <Spin spinning={loading} indicator={antIcon}>
        <Typography.Title level={1} style={{ marginBottom: '50px' }}>
          MarketPlace
        </Typography.Title>

        <div className={styles.items}>
          {fetchedPosts.docs?.map((post: any, index: Number) => {
            return (
              <Card
                key={`${index}`}
                style={{ width: 300 }}
                cover={
                  <Image
                    height={'300px'}
                    style={{ objectFit: 'cover' }}
                    alt="example"
                    src={post.nft.image}
                  />
                }
                actions={[
                  <Button onClick={() => buyNFT(post)} key="buy" type="primary">
                    Buy NFT for{' '}
                    {ethers.utils.formatEther(post.marketplace.price)}ETH
                  </Button>
                ]}
              >
                <Meta
                  avatar={
                    <Blockies
                      seed={post.nft.owner}
                      size={10}
                      scale={3}
                      className="identicon"
                    />
                  }
                  title={post.nft.name}
                  description={post.nft.description}
                />
              </Card>
            );
          })}
        </div>
        <div className={styles.pagination_wrapper}>
          <Pagination
            onChange={onpaginationChange}
            defaultCurrent={6}
            total={fetchedPosts.totalDocs}
          />
          ;
        </div>
      </Spin>
    </div>
  );
};

export default Home;
