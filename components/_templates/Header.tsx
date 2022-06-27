import Link from 'next/link';
import Image from 'next/image';

const Header = () => (
  <header>
    <div className="container">
      <Link href="/[[...packets]]" as="/">
        <a className="site-logo">
          <Image
            width={35}
            height={35}
            className="site-logo--img"
            alt="NPM Trends Logo"
            src="/images/logos/npm_trends_logo.png"
          />
          <span className="site-logo--name">npm trends</span>
        </a>
      </Link>
    </div>
  </header>
);

export default Header;
