import { FC } from 'react'; // Use FC (FunctionComponent) instead of NextPage
import Image from 'next/image';
import ConnectButton from 'components/connect';
import styles from './header.module.scss';

interface HeaderProps {
  onClick?: () => void; // Define the onClick prop
}

const Header: FC<HeaderProps> = ({ onClick = () => {} }) => {
  return (
    <header className={styles.header}>
      <span onClick={onClick}>
        <Image layout="fill" src="/assets/logo.png" alt="" />
      </span>
      <ConnectButton />
    </header>
  );
};

export default Header;
