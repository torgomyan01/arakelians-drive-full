'use client';

import { motion, Variants } from 'framer-motion';

function Category() {
  const carVariants: Variants = {
    hidden: {
      opacity: 0,
      x: 200,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 50,
        damping: 15,
        mass: 1,
      },
    },
  };

  return (
    <div className="relative z-0 py-20 max-md:pt-[50px] max-md:pb-[130px]">
      <div className="flex max-md:relative max-md:z-0">
        <div className="max-w-[380px] mr-20 max-md:max-w-full max-md:mr-0">
          <h2 className="global-title">Ստանալու եք </h2>
          <p className="text-[22px] text-black max-md:relative max-md:z-1 max-md:text-base">
            Ստացեք B կարգի ավտոմեքենա վարելու արտոնագիր՝ երաշխավորված
            հաջողությամբ։ Մեր դասընթացը պատրաստում է իսկական վարորդների՝ ապահով
            և վստահ ճանապարհին։ Սկսեք ձեր ազատ շարժումը այսօր։
          </p>
        </div>
        <img
          src="/images/b.svg"
          alt=""
          className="max-md:absolute max-md:right-0 max-md:top-[60px] max-md:w-[170px]"
        />
      </div>
      <motion.img
        src="/images/car.png"
        alt=""
        className="car2 absolute -bottom-[60px] -right-[210px] z-1 max-[1200px]:w-[800px] max-[1024px]:w-[80vw] max-md:right-0 max-md:-bottom-5 max-md:w-[300px] max-md:z-1"
        variants={carVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          ease: 'easeOut',
          delay: 0.5,
        }}
      />
    </div>
  );
}

export default Category;
