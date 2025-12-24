import Footer from '../footer/footer';
import Navbar from '../navbar/navbar';
import CallButton from '../call-button/call-button';
import { getSetting } from '@/app/actions/admin-settings';

interface MainTemplateProps {
  children: React.ReactNode;
  phoneNumber?: string;
}

async function MainTemplate({ children, phoneNumber }: MainTemplateProps) {
  // If phoneNumber is not provided, fetch it from server
  const finalPhoneNumber =
    phoneNumber || (await getSetting('phone_number')) || '093-77-31-41';

  return (
    <>
      <Navbar />

      {children}

      <Footer />
      <CallButton phoneNumber={finalPhoneNumber} />
    </>
  );
}

export default MainTemplate;
