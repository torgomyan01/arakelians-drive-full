'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { InputMask } from '@react-input/mask';

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
  const [focusedFields, setFocusedFields] = useState({
    firstName: false,
    lastName: false,
    phone: false,
    message: false,
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
            Զանգի և ասա ինչ-որ բան՝ ուղիղ զրույց սկսելու համար։
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
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100/50 border-l-4 border-red-500 text-red-700 rounded-[12px] text-sm shadow-md animate-fade-in">
              <div className="flex items-center gap-2">
                <i className="fas fa-exclamation-circle text-red-500"></i>
                <span>{error}</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-8 mb-10 max-md:grid-cols-1 max-md:gap-6 max-md:mb-8">
            {/* First Name Input */}
            <div className="relative group">
              <div className="absolute left-0 top-2.5 text-[#8D8D8D] transition-all duration-300 ease-out group-focus-within:text-[#FA8604]">
                <i className="fas fa-user text-lg"></i>
              </div>
              <label
                className={`absolute left-8 transition-all duration-300 ease-out pointer-events-none ${
                  focusedFields.firstName || formData.firstName
                    ? 'top-0 text-xs text-[#FA8604] font-semibold'
                    : 'top-2.5 text-[17px] text-[#8D8D8D]'
                }`}
              >
                Անուն
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                onFocus={() =>
                  setFocusedFields({ ...focusedFields, firstName: true })
                }
                onBlur={() =>
                  setFocusedFields({ ...focusedFields, firstName: false })
                }
                required
                className="w-full border-0 border-b-2 border-b-[#E0E0E0] py-3 pl-8 pr-0 bg-transparent focus:outline-none focus:border-b-[#FA8604] transition-all duration-300 ease-out text-[#1A2229] text-[17px] pt-7 hover:border-b-[#FA8604]/60 focus:bg-gradient-to-b from-transparent to-orange-50/20"
              />
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#FA8604] via-[#FF9A3C] to-[#FA8604] transition-all duration-500 ease-out group-focus-within:w-full shadow-[0_2px_8px_rgba(250,134,4,0.4)] rounded-full"></div>
            </div>

            {/* Last Name Input */}
            <div className="relative group">
              <div className="absolute left-0 top-2.5 text-[#8D8D8D] transition-all duration-300 ease-out group-focus-within:text-[#FA8604]">
                <i className="fas fa-user text-lg"></i>
              </div>
              <label
                className={`absolute left-8 transition-all duration-300 ease-out pointer-events-none ${
                  focusedFields.lastName || formData.lastName
                    ? 'top-0 text-xs text-[#FA8604] font-semibold'
                    : 'top-2.5 text-[17px] text-[#8D8D8D]'
                }`}
              >
                Ազգանուն
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                onFocus={() =>
                  setFocusedFields({ ...focusedFields, lastName: true })
                }
                onBlur={() =>
                  setFocusedFields({ ...focusedFields, lastName: false })
                }
                required
                className="w-full border-0 border-b-2 border-b-[#E0E0E0] py-3 pl-8 pr-0 bg-transparent focus:outline-none focus:border-b-[#FA8604] transition-all duration-300 ease-out text-[#1A2229] text-[17px] pt-7 hover:border-b-[#FA8604]/60 focus:bg-gradient-to-b from-transparent to-orange-50/20"
              />
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#FA8604] via-[#FF9A3C] to-[#FA8604] transition-all duration-500 ease-out group-focus-within:w-full shadow-[0_2px_8px_rgba(250,134,4,0.4)] rounded-full"></div>
            </div>
          </div>

          {/* Phone Input */}
          <div className="relative group mb-10">
            <div className="absolute left-0 top-2.5 text-[#8D8D8D] transition-all duration-300 ease-out group-focus-within:text-[#FA8604]">
              <i className="fas fa-phone text-lg"></i>
            </div>
            <label
              className={`absolute left-8 transition-all duration-300 ease-out pointer-events-none ${
                focusedFields.phone || formData.phone
                  ? 'top-0 text-xs text-[#FA8604] font-semibold'
                  : 'top-2.5 text-[17px] text-[#8D8D8D]'
              }`}
            >
              Հեռախոսահամար
            </label>
            <InputMask
              mask="+374 __ ___ ___"
              replacement={{ _: /\d/ }}
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              onFocus={() =>
                setFocusedFields({ ...focusedFields, phone: true })
              }
              onBlur={() =>
                setFocusedFields({ ...focusedFields, phone: false })
              }
              required
              className="w-full border-0 border-b-2 border-b-[#E0E0E0] py-3 pl-8 pr-0 bg-transparent focus:outline-none focus:border-b-[#FA8604] transition-all duration-300 ease-out text-[#1A2229] text-[17px] pt-7 hover:border-b-[#FA8604]/60 focus:bg-gradient-to-b from-transparent to-orange-50/20"
            />
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#FA8604] via-[#FF9A3C] to-[#FA8604] transition-all duration-500 ease-out group-focus-within:w-full shadow-[0_2px_8px_rgba(250,134,4,0.4)] rounded-full"></div>
          </div>

          {/* Message Textarea */}
          <div className="relative group mb-8">
            <div className="absolute left-0 top-5 text-[#8D8D8D] transition-all duration-300 ease-out group-focus-within:text-[#FA8604]">
              <i className="fas fa-comment-dots text-lg"></i>
            </div>
            <label
              className={`absolute left-8 transition-all duration-300 ease-out pointer-events-none ${
                focusedFields.message || formData.message
                  ? 'top-0 text-xs text-[#FA8604] font-semibold'
                  : 'top-5 text-[17px] text-[#8D8D8D]'
              }`}
            >
              Հաղորդագրություն
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              onFocus={() =>
                setFocusedFields({ ...focusedFields, message: true })
              }
              onBlur={() =>
                setFocusedFields({ ...focusedFields, message: false })
              }
              required
              rows={5}
              className="w-full border-0 border-b-2 border-b-[#E0E0E0] py-3 pl-8 pr-0 bg-transparent focus:outline-none focus:border-b-[#FA8604] transition-all duration-300 ease-out text-[#1A2229] text-[17px] pt-9 mb-8 resize-none min-h-[140px] hover:border-b-[#FA8604]/60 focus:bg-gradient-to-b from-transparent to-orange-50/20"
            />
            <div className="absolute bottom-8 left-0 w-0 h-1 bg-gradient-to-r from-[#FA8604] via-[#FF9A3C] to-[#FA8604] transition-all duration-500 ease-out group-focus-within:w-full shadow-[0_2px_8px_rgba(250,134,4,0.4)] rounded-full"></div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="relative rounded-[12px] bg-gradient-to-r from-[#FA8604] via-[#FF9A3C] to-[#FA8604] cursor-pointer py-3.5 px-[45px] text-[20px] font-semibold text-white self-end max-lg:self-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl hover:shadow-[#FA8604]/40 hover:from-[#e67503] hover:via-[#FF9A3C] hover:to-[#e67503] active:scale-95 overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Ուղարկվում է...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  <span>Ուղարկել</span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
