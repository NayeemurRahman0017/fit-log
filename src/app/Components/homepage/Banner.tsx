import Image from "next/image";
import banner from "@/assets/banner.png";

const Banner = () => {
  return (
    <section className="relative overflow-hidden border-b border-[#24282E] bg-[#0B0D10]">
      
      {/* Background glow */}
      <div className="
        pointer-events-none
        absolute
        -right-32
        top-1/2
        h-112.5
        w-112.5
        -translate-y-1/2
        rounded-full
        bg-[#C2F800]/6
        blur-[100px]
      " />

      <div className="
        container
        mx-auto
        px-4
        sm:px-6
        lg:px-8
      ">

        <div className="
          grid
          min-h-150
          grid-cols-1
          items-center
          gap-12
          py-16
          md:py-20
          lg:grid-cols-2
          lg:gap-16
          lg:py-24
        ">

          {/* ================= LEFT CONTENT ================= */}
          <div className="relative z-10 max-w-2xl">

            {/* Eyebrow */}
            <p className="
              mb-5
              text-[11px]
              font-extrabold
              uppercase
              tracking-[0.3em]
              text-[#C2F800]
              sm:text-xs
            ">
              WORKOUT LIBRARY
            </p>

            {/* Main heading */}
            <h1 className="
              font-display
              text-5xl
              font-bold
              uppercase
              leading-[0.95]
              tracking-tight
              text-white
              sm:text-6xl
              md:text-7xl
              lg:text-[72px]
              xl:text-[82px]
            ">
              TRAIN WITH{" "}
              <span className="text-[#C2F800]">
                INTENT.
              </span>

              <br />

              LOG EVERY SET.
            </h1>

            {/* Description */}
            <p className="
              mt-7
              max-w-xl
              text-sm
              leading-7
              text-[#8D949E]
              sm:text-base
              sm:leading-8
            ">
              FitLog is a dark, no-nonsense gym
              companion: pick a lift, lock it into
              today&apos;s plan, and watch the
              week&apos;s work add up.
            </p>

            {/* CTA */}
            <a
              href="#library"
              className="
                group
                mt-8
                inline-flex
                items-center
                gap-3
                rounded-full
                bg-[#C2F800]
                px-6
                py-3.5
                text-[11px]
                font-black
                uppercase
                tracking-[0.16em]
                text-[#080A0D]
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:brightness-110
                active:scale-95
                sm:px-7
                sm:py-4
              "
            >
              BROWSE WORKOUTS

              {/* Arrow */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>

          </div>

          {/* ================= RIGHT IMAGE ================= */}
          <div className="
            relative
            flex
            items-center
            justify-center
            lg:justify-end
          ">

            {/* Image glow */}
            <div className="
              absolute
              h-70
              w-70
              rounded-full
              bg-[#C2F800]/10
              blur-[80px]
              sm:h-95
              sm:w-95
            " />

            {/* Image frame */}
            <div className="
              relative
              w-full
              max-w-142.5
              overflow-hidden
              rounded-3xl
              border
              border-[#292E35]
              bg-[#111419]
              p-2
              shadow-2xl
              sm:p-3
            ">

              <div className="
                relative
                aspect-[1.1]
                overflow-hidden
                rounded-[18px]
              ">

                <Image
                  src={banner}
                  alt="FitLog workout"
                  fill
                  priority
                  sizes="
                    (max-width: 768px) 100vw,
                    (max-width: 1200px) 50vw,
                    570px
                  "
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    hover:scale-105
                  "
                />

                {/* Dark overlay */}
                <div className="
                  absolute
                  inset-0
                  bg-linear-to-t
                  from-[#080A0D]/40
                  via-transparent
                  to-transparent
                " />

              </div>

              {/* Small accent line */}
              <div className="
                absolute
                bottom-0
                left-8
                right-8
                h-0.5
                rounded-full
                bg-[#C2F800]
              " />

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Banner;
