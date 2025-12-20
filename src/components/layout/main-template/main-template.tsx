import Footer from '../footer/footer';
import Navbar from '../navbar/navbar';
import CallButton from '../call-button/call-button';

function MainTemplate({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />

      {children}

      <Footer />
      <CallButton />
    </>
  );
}

export default MainTemplate;
