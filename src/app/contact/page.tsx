import Navbar from '@/components/layout/navbar/navbar';
import Footer from '@/components/layout/footer/footer';
import Contact from '@/components/layout/contact/contact';
import { getSetting } from '@/app/actions/admin-settings';

export default async function ContactPage() {
  const phoneNumber = (await getSetting('phone_number')) || '+374 77 76-96-68';
  const address = (await getSetting('address')) || 'Ք․ Սիսիան';
  const telegram = await getSetting('telegram');
  const whatsapp = await getSetting('whatsapp');

  return (
    <>
      <Navbar />
      <main className="overflow-hidden rounded-[20px]">
        <div className="container mx-auto px-0! py-[60px] max-md:py-[40px]">
          <Contact
            phoneNumber={phoneNumber}
            address={address}
            telegram={telegram || undefined}
            whatsapp={whatsapp || undefined}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
