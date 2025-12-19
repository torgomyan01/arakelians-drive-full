import Footer from '../footer/footer';
import Navbar from '../navbar/navbar';

function MainTemplate({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />

      {children}

      <Footer />
    </>
  );
}

export default MainTemplate;
