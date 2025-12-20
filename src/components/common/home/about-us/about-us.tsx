'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, memo } from 'react';
import { InputMask } from '@react-input/mask';

// Counter component for animated numbers - memoized to prevent unnecessary re-renders
const AnimatedCounter = memo(
  ({
    value,
    suffix = '',
    cardValue,
  }: {
    value: number;
    suffix?: string;
    cardValue: string;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimatedRef = useRef(false);
    const motionValue = useMotionValue(0);
    const spring = useSpring(motionValue, {
      damping: 60,
      stiffness: 100,
    });
    const display = useTransform(spring, (current) =>
      Math.floor(current).toLocaleString()
    );
    const [displayValue, setDisplayValue] = useState('0');

    useEffect(() => {
      const unsubscribe = spring.on('change', (latest) => {
        setDisplayValue(Math.floor(latest).toLocaleString());
      });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            motionValue.set(value);
            // Unobserve after animation starts to prevent re-triggering
            if (ref.current) {
              observer.unobserve(ref.current);
            }
          }
        },
        { threshold: 0.5 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        unsubscribe();
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [motionValue, value, spring]);

    return (
      <b ref={ref} className={cardValue}>
        {displayValue}
        {suffix}
      </b>
    );
  }
);

AnimatedCounter.displayName = 'AnimatedCounter';

function AboutUs() {
  const cardStyle =
    'rounded-[20px] bg-white shadow-[0_0_34px_rgba(0,0,0,0.16)] p-5 mb-10 flex flex-col items-center justify-center min-h-[190px] max-md:mb-5';
  const cardTitle =
    'text-[30px] text-[#FA8604] mb-4 font-light text-center max-lg:text-2xl';
  const cardValue = 'font-bold text-[30px] text-black';
  const textColorDark = 'text-[#222]';

  // Countdown timer logic with localStorage
  const COUNTDOWN_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
  const STORAGE_KEY = 'registration_countdown_end';

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  useEffect(() => {
    // Function to get or initialize end time
    const getEndTime = (): number => {
      const savedEndTime = localStorage.getItem(STORAGE_KEY);
      if (savedEndTime) {
        const endTime = parseInt(savedEndTime, 10);
        // Check if countdown has expired
        if (Date.now() >= endTime) {
          // Reset countdown
          const newEndTime = Date.now() + COUNTDOWN_DURATION;
          localStorage.setItem(STORAGE_KEY, newEndTime.toString());
          return newEndTime;
        }
        return endTime;
      } else {
        // First time - start countdown
        const newEndTime = Date.now() + COUNTDOWN_DURATION;
        localStorage.setItem(STORAGE_KEY, newEndTime.toString());
        return newEndTime;
      }
    };

    // Initial calculation
    const endTime = getEndTime();
    const initialRemaining = Math.max(0, endTime - Date.now());
    setTimeLeft(initialRemaining);

    // Update countdown every second
    const interval = setInterval(() => {
      const currentEndTime = getEndTime();
      const remaining = Math.max(0, currentEndTime - Date.now());
      setTimeLeft(remaining);

      if (remaining === 0) {
        // Reset countdown when it reaches 0
        const newEndTime = Date.now() + COUNTDOWN_DURATION;
        localStorage.setItem(STORAGE_KEY, newEndTime.toString());
        setTimeLeft(COUNTDOWN_DURATION);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time as MM:SS
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRegisterClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ name: '', phone: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Check if registration is within discount time (10 minutes)
      const hasDiscount = timeLeft > 0;

      // Import and call server action
      const { createRegistration } =
        await import('@/app/actions/registrations');
      const result = await createRegistration(
        formData.name,
        formData.phone,
        hasDiscount
      );

      if (result.success) {
        // Close modal after submission
        handleModalClose();
        // Show success message
        alert(
          hasDiscount
            ? 'Շնորհակալություն! Դուք գրանցվել եք զեղչով: Մենք շուտով կապ կհաստատենք ձեզ հետ:'
            : 'Շնորհակալություն! Մենք շուտով կապ կհաստատենք ձեզ հետ:'
        );
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      alert('Սխալ է տեղի ունեցել: ' + (error.message || 'Անհայտ սխալ'));
    }
  };

  return (
    <div className="mt-[120px] mb-10 max-lg:mt-[60px]">
      <h2 className="global-title">Մեր մասին</h2>
      <div className="flex max-md:flex-col">
        <div className="grow max-md:mb-10">
          <div className="max-md:h-[150px] max-md:overflow-hidden">
            <p className="mb-8">
              Անձնական ավտոմեքենան ազատություն է։ Բայց իրական ազատությունը
              ճանապարհին գալիս է ոչ թե մետաղից ու ապակուց, այլ վստահությունից,
              հմտությունից և անվտանգությունից։ Մենք հավատում ենք, որ ճիշտ
              ուսուցումը կյանք է փրկում։
            </p>
            <p className="mb-8">
              Arakelians Drive-ը միայն ավտոդպրոց չէ։ Սա հաջողության ապացուցված
              համակարգ է Հայաստանում, որը տասնյակ հազարավոր ուսանողների վերածել
              է անվտանգ ու վստահ վարորդների։ Մեր առաքելությունը պարզ է՝ ձեզ
              սովորեցնել վարել այնպես, ինչպես մենք կսովորեցնեինք մեր ընտանիքի
              անդամներին։
            </p>
            <p className="mb-8">
              Ինչո՞ւ Arakelians Drive ընտրողների 98%-ը հաջողությամբ հանձնում է
              քննությունները առաջին փորձից: Հաջողության երաշխիք. Մենք առաջարկում
              ենք ոչ միայն դասընթաց, այլ հստակ արդյունք: Մեր ուսանողների ճնշող
              մեծամասնությունը ստանում է իր արտոնագիրը առաջին փորձից՝
              պայմանավորված անհատական մոտեցմամբ և արդյունավետ մեթոդաբանությամբ։
            </p>
            <p className="mb-8">
              Ժամանակակից նավատորմ և տեխնոլոգիաներ. Դուք կսովորեք նոր, անվտանգ
              ավտոմեքենաներով, որոնք հագեցված են կրկնակի կառավարման համակարգով:
              Տեսական դասերն անցկացվում են ինտերակտիվ դասարաններում և առցանց
              հարթակի միջոցով։
            </p>
            <p className="mb-8">
              Փորձառու հրահանգիչներ-հոգեբաններ. Մեր հրահանգիչները ոչ միայն
              վարպետ վարորդներ են, այլև հատուկ պատրաստված են աշխատելու ամեն
              տեսակի ուսանողների հետ՝ առանց նյարդայնացնելու կամ ճնշելու։
            </p>
            <p className="mb-8">
              Ճկուն գրաֆիկ և մատչելիություն. Մենք հասկանում ենք զբաղված կյանքի
              իրականությունը։ Ընտրեք դասերի ձեր հարմար ժամերը՝ առավոտյան,
              երեկոյան կամ հանգստյան օրերին։
            </p>
            <p className="mb-8">Մեր աճը ձեր հաջողության ապացույցն է</p>
          </div>
          <a
            href="#"
            className="text-[#FA8604] text-sm hidden max-md:flex max-md:items-center max-md:justify-center mt-2.5"
          >
            Կարդալ ամբողջը
            <img src="/images/arrow-down.svg" alt="" className="ml-2.5" />
          </a>
        </div>
        <div className="ml-10 min-w-[410px] max-lg:min-w-[320px] max-lg:ml-5 max-md:ml-0">
          <div className={cardStyle}>
            <span className={cardTitle}>Շրջանավարտ</span>
            <AnimatedCounter value={2000} suffix="+" cardValue={cardValue} />
          </div>
          <div className={cardStyle}>
            <span className={cardTitle}>Մեր փորձը</span>
            <AnimatedCounter value={8} suffix="+ տարի " cardValue={cardValue} />
          </div>
          <div className={`${cardStyle} text-center relative z-0`}>
            <span className={cardTitle}>Ունենք ակցիա քո համար</span>
            <span
              className={`${textColorDark} text-[22px] text-center font-bold mb-4 max-lg:text-lg`}
            >
              Եթե 10 րոպեի ընթացքում գրանցվես
            </span>
            <button
              onClick={handleRegisterClick}
              className="rounded-[10px] bg-[linear-gradient(90deg,#FA8604_0%,rgba(250,134,4,0.6)_100%)] py-2 px-[35px] text-[22px] text-white self-center z-0 cursor-pointer hover:opacity-90 transition-opacity"
            >
              Գրանցվել
            </button>
            <span className="absolute rounded-[10px] bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] -top-2.5 right-5 py-0.5 px-2.5 text-sm text-[#FA8604] font-bold">
              {formatTime(timeLeft)}
            </span>
            <img
              src="/images/podarok.svg"
              alt=""
              className="absolute -top-5 -right-5 -z-1 max-md:-right-2.5"
            />
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-[20px] p-8 max-w-[500px] w-full relative"
          >
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-[#1A2229] mb-6 text-center">
              Գրանցում
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#222] mb-2"
                >
                  Անուն
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#FA8604]"
                  placeholder="Մուտքագրեք ձեր անունը"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-[#222] mb-2"
                >
                  Հեռախոսահամար
                </label>
                <InputMask
                  mask="+374 __ ___ ___"
                  replacement={{ _: /\d/ }}
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#FA8604]"
                  placeholder="+374 XX XXX XXX"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-[10px] bg-[linear-gradient(90deg,#FA8604_0%,rgba(250,134,4,0.6)_100%)] py-3 px-[35px] text-[18px] text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Գրանցվել
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AboutUs;
