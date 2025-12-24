import { SITE_URL } from '@/utils/consts';
import Link from 'next/link';

function Footer() {
  const textColorDark = 'text-[#222]';
  const glassEffect =
    'rounded-[50px] bg-[rgba(0,0,0,0.08)] backdrop-blur-[4px]';
  const linkHover =
    'font-bold transition-colors duration-300 hover:text-[#FA8604]';

  return (
    <footer className="my-10 mx-0 max-md:my-5">
      <div className="container">
        <div
          className={`${glassEffect} px-5 py-2.5 flex items-center justify-between max-md:p-2.5 max-md:pr-[18px]`}
        >
          <Link
            href={SITE_URL.HOME}
            className={`${textColorDark} ${linkHover} max-md:hidden`}
          >
            ARAKELIANS DRIVE
          </Link>
          <Link
            href={SITE_URL.HOME}
            className="ml-[150px] max-lg:ml-5 max-md:ml-0"
          >
            <img src="/images/logo.svg" alt="" />
          </Link>
          <span
            className={`${textColorDark} max-lg:max-w-[190px] max-md:max-w-[160px] max-md:text-[13px] max-md:text-right`}
          >
            Բոլոր իրավուքները պաշտպանված են 2025
          </span>
        </div>
      </div>
      <div className="container mt-6!">
        <div className="flex items-center justify-end">
          <p className="text-[#8D8D8D] text-base">
            Կայքը պատրաստված է{' '}
            <Link
              href="https://torgomyan-studio.am"
              className="text-[#FA8604] text-base"
            >
              Torgomyan Studio
            </Link>{' '}
            կողմից
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
