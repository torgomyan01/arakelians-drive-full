'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ContactProps {
  phoneNumber?: string;
  address?: string;
  telegram?: string;
  whatsapp?: string;
}

function Contact({
  phoneNumber = '+374 77 76-96-68',
  address = 'Ք․ Սիսիան',
  telegram,
  whatsapp,
}: ContactProps) {
  const textWhite = 'text-white';
  const textSizeBase = 'text-[17px]';
  const textSizeSmall = 'text-[16px]';
  const inputBorder =
    'border-0 border-b border-b-[#8D8D8D] py-2.5 px-0 focus:outline-none focus:border-b-[#FA8604]';
  const contactItem = 'flex items-center mb-5';
  const textColorGray = 'text-[#8D8D8D]';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError('Խնդրում ենք լրացնել բոլոր դաշտերը');
        setLoading(false);
        return;
      }

      if (!formData.phone.trim()) {
        setError('Հեռախոսահամարը պարտադիր է');
        setLoading(false);
        return;
      }

      if (!formData.message.trim()) {
        setError('Հաղորդագրությունը պարտադիր է');
        setLoading(false);
        return;
      }

      const { createContact } = await import('@/app/actions/contacts');
      const result = await createContact(
        formData.firstName,
        formData.lastName,
        formData.phone,
        formData.message
      );

      if (result.success) {
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          message: '',
        });
        alert('Շնորհակալություն! Մենք շուտով կապ կհաստատենք ձեզ հետ:');
      } else {
        setError(result.error || 'Սխալ է տեղի ունեցել');
      }
    } catch (err: any) {
      console.error('Contact form error:', err);
      setError(err.message || 'Սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-12 mx-0">
      <h2 className="global-title">Կապ մեզ հետ</h2>
      <div className="rounded-[10px] bg-white shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] flex justify-between p-2.5 max-lg:flex-col">
        <div
          className="w-[43%] p-10 rounded-[6px] max-xl:px-8 max-lg:w-full max-lg:mb-8 max-md:p-5 bg-[#FA8604]"
          style={{
            backgroundImage: 'url(/images/contact-img.svg)',
            backgroundPosition: 'right bottom',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <h3
            className={`${textWhite} text-[28px] font-bold max-xl:text-[26px] max-md:text-2xl`}
          >
            Կոնտակտային տվյալներ
          </h3>
          <p
            className={`${textWhite} ${textSizeBase} mb-4 max-md:text-base max-md:mb-6`}
          >
            Զնգի և ասա ինչ-որ բան՝ ուղիղ զրույց սկսելու համար։
          </p>
          <div className="flex mb-[60px] max-md:mb-5">
            <div className="flex rounded-[10px] overflow-hidden min-w-[170px] h-[190px] mr-5 max-md:min-w-[100px] max-md:h-auto max-md:mr-4">
              <Image
                src="/images/person.png"
                alt="Arsen Arakelian Founder"
                width={170}
                height={190}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <b
                className={`${textWhite} text-[28px] font-bold leading-[125%] max-md:text-2xl`}
              >
                Արսեն Առաքելյան
              </b>
              <span className={`${textWhite} ${textSizeBase} mt-2 block`}>
                Հրահանգիչ
              </span>
            </div>
          </div>
          <div className={contactItem}>
            <img src="images/phone-call.svg" alt="" className="mr-5" />
            <a
              href={`tel:${phoneNumber.replace(/\s|-/g, '')}`}
              className={`${textWhite} ${textSizeBase}`}
            >
              {phoneNumber}
            </a>
          </div>
          <div className={contactItem}>
            <img src="images/location-filled.svg" alt="" className="mr-5" />
            <span className={`${textWhite} ${textSizeBase}`}>{address}</span>
          </div>
          {(whatsapp || telegram) && (
            <div className="flex items-center mt-8 max-md:mt-5">
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-2.5 hover:opacity-80 transition-opacity"
                  aria-label="WhatsApp"
                >
                  <img src="/images/whatsapp-fill.svg" alt="WhatsApp" />
                </a>
              )}
              {telegram && (
                <a
                  href={telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  aria-label="Telegram"
                >
                  <img src="/images/baseline-telegram.svg" alt="Telegram" />
                </a>
              )}
            </div>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-[53%] flex flex-col pr-12 max-lg:w-full max-lg:pr-0 max-md:mb-5 mt-[70px] max-[1024px]:mt-2.5"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-[10px] text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-8 mb-10 max-md:grid-cols-1 max-md:gap-5 max-md:mb-5">
            <input
              type="text"
              placeholder="Անուն"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
              className={inputBorder}
            />
            <input
              type="text"
              placeholder="Ազգանուն"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
              className={inputBorder}
            />
          </div>
          <input
            type="tel"
            placeholder="Հեռախոսահամար"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
            className={`${inputBorder} mb-8`}
          />
          <span className={`text-xs font-medium ${textColorGray}`}>
            Հաղորդագրություն
          </span>
          <textarea
            placeholder="Գրեք ձեր խնդիրը կամ հարցը"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            required
            className={`${inputBorder} mt-5 mb-8 resize-none`}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-[10px] bg-[linear-gradient(90deg,#FA8604_0%,rgba(250,134,4,0.6)_100%)] cursor-pointer py-2 px-[35px] text-[22px] text-white self-end max-lg:self-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#FA8604]/50 hover:bg-[linear-gradient(90deg,#e67503_0%,rgba(230,117,3,0.7)_100%)] active:scale-95"
          >
            {loading ? 'Ուղարկվում է...' : 'Ուղարկել'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
