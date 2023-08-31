import { Card } from 'antd';
import { getReq, postReq } from 'api';
import { Button, Space } from 'antd';
import type { NextPage } from 'next';
import styles from './unlisted.module.scss';
import { Image, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import Blockies from 'react-blockies';
import { Pagination } from 'antd';
import { Spin } from 'antd';
import { useWeb3React } from '@web3-react/core';
import { getMarketplaceContract, getMinterContract } from 'utils/contracts';
import { ethers } from 'ethers';

const { Meta } = Card;
const antIcon = <LoadingOutlined style={{ fontSize: 42 }} spin />;

const Unlisted: NextPage = () => {
  const { account, chainId, library } = useWeb3React();

  const [fetchedPosts, setFecthedPosts] = useState<any>({ docs: [] });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  });

  async function fetchNFTs() {
    if (loading || !account) return;
    window.scrollTo({ top: 0 });
    setLoading(true);
    try {
      const { data: response } = await getReq(
        `/marketplace/unlisted?address=${account}&page=${pagination.page}&limit=${pagination.limit}`
      );
      setFecthedPosts(response.data);
    } catch (err: any) {
      alert(`error loading data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const buyNFT = async (post: any) => {
    const tokenId = post.nft.tokenId;

    const minterContract = getMinterContract(`${chainId}`, library.getSigner());
    const tokenIdSignature = await library.getSigner().signMessage(tokenId);
    const tokenPrice = 0.05 * 10 ** 18; //hardcode token price
    setLoading(true);
    try {
      const tx = await minterContract.listNFT(tokenId, `${tokenPrice}`);
      await tx.wait();
      const { hash: blockHash } = tx;
      const response = await postReq('/marketplace/listnft', {
        price: `${tokenPrice}`,
        approvalTransactionHash: blockHash,
        tokenId: tokenId,
        address: account,
        tokenIdSgnature: tokenIdSignature
      });
      await fetchNFTs();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [pagination, account]);

  const onpaginationChange = (page: number, pageSize: number) => {
    setPagination({
      page,
      limit: pageSize
    });
  };

  return (
    <div className={styles.unlisted}>
      <Spin spinning={loading} indicator={antIcon}>
        <Typography.Title level={1} style={{ marginBottom: '50px' }}>
          Unlisted NFT
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
                    List NFT for sale
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

export default Unlisted;
