import React, { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { products } from "../assets/assets";
import { Link } from "react-router-dom";

const TOTAL = products.length;
const SLIDE_MS = 5000;
const ANIM_S = 0.85;
const RESUME_MS = 7000;
const START_IDX = TOTAL;

const extended = [...products, ...products, ...products];
const toReal = (idx) => ((idx % TOTAL) + TOTAL) % TOTAL;

export default function Hero() {
  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const textRef = useRef(null);
  const isAnim = useRef(false);
  const isPaused = useRef(false);
  const idxRef = useRef(START_IDX);
  const autoTimer = useRef(null);
  const resumeTimer = useRef(null);

  const [realIdx, setRealIdx] = useState(toReal(START_IDX));

  const getW = useCallback(() => {
    return wrapRef.current ? wrapRef.current.offsetWidth : 0;
  }, []);

  const snapTo = useCallback(
    (idx) => {
      if (!trackRef.current) return;
      gsap.killTweensOf(trackRef.current);
      idxRef.current = idx;
      gsap.set(trackRef.current, {
        x: -(getW() * idx),
        force3D: true,
        overwrite: "auto",
      });
    },
    [getW],
  );

  const animateText = useCallback((newRealIdx) => {
    const el = textRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      ease: "power2.in",
      onComplete() {
        setRealIdx(newRealIdx);
        gsap.fromTo(
          el,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        );
      },
    });
  }, []);

  const slideTo = useCallback(
    (targetIdx) => {
      if (!trackRef.current || isAnim.current) return;
      isAnim.current = true;

      const nextReal = toReal(targetIdx);
      animateText(nextReal);

      gsap.to(trackRef.current, {
        x: -(getW() * targetIdx),
        duration: ANIM_S,
        ease: "expo.inOut",
        force3D: true,
        overwrite: true,
        onComplete() {
          idxRef.current = targetIdx;

          let corrected = targetIdx;
          if (targetIdx >= TOTAL * 2) corrected = TOTAL + nextReal;
          else if (targetIdx < TOTAL) corrected = TOTAL + nextReal;

          if (corrected !== targetIdx) {
            requestAnimationFrame(() => {
              gsap.set(trackRef.current, {
                x: -(getW() * corrected),
                force3D: true,
                overwrite: "auto",
              });
              idxRef.current = corrected;
              isAnim.current = false;
            });
          } else {
            isAnim.current = false;
          }
        },
      });
    },
    [animateText, getW],
  );

  const startAuto = useCallback(() => {
    clearInterval(autoTimer.current);
    autoTimer.current = setInterval(() => {
      if (!isPaused.current && !isAnim.current) {
        slideTo(idxRef.current + 1);
      }
    }, SLIDE_MS);
  }, [slideTo]);

  const stopAuto = useCallback(() => clearInterval(autoTimer.current), []);

  const handleNav = useCallback(
    (dir) => {
      if (isAnim.current) return;
      stopAuto();
      clearTimeout(resumeTimer.current);
      slideTo(idxRef.current + dir);
      resumeTimer.current = setTimeout(startAuto, RESUME_MS);
    },
    [slideTo, startAuto, stopAuto],
  );

  const handleDot = useCallback(
    (dotIdx) => {
      if (isAnim.current) return;
      const cur = toReal(idxRef.current);
      if (dotIdx === cur) return;
      stopAuto();
      clearTimeout(resumeTimer.current);
      slideTo(idxRef.current + (dotIdx - cur));
      resumeTimer.current = setTimeout(startAuto, RESUME_MS);
    },
    [slideTo, startAuto, stopAuto],
  );

  //  set --slide-w CSS variable
  useEffect(() => {
    const update = () => {
      const w = getW();
      if (w && wrapRef.current) {
        wrapRef.current.style.setProperty("--slide-w", `${w}px`);
      }
    };

    let f2;
    const f1 = requestAnimationFrame(() => {
      f2 = requestAnimationFrame(update);
    });

    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(f1);
      cancelAnimationFrame(f2);
      window.removeEventListener("resize", update);
    };
  }, [getW]);

  // ── resize
  useEffect(() => {
    const onResize = () => {
      gsap.killTweensOf(trackRef.current);
      isAnim.current = false;
      snapTo(idxRef.current);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [snapTo]);

  //  keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") handleNav(-1);
      if (e.key === "ArrowRight") handleNav(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNav]);

  // ── mount
  useEffect(() => {
    let f2;
    const f1 = requestAnimationFrame(() => {
      f2 = requestAnimationFrame(() => {
        snapTo(START_IDX);
        startAuto();
      });
    });

    return () => {
      cancelAnimationFrame(f1);
      cancelAnimationFrame(f2);
      stopAuto();
      clearTimeout(resumeTimer.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const product = products[realIdx];

  return (
    <section
      className="relative flex flex-col-reverse sm:flex-row w-full overflow-hidden
                 border border-gray-200 bg-white shadow-sm
                 sm:min-h-[450px] xl:min-h-[600px]"
      onMouseEnter={() => {
        isPaused.current = true;
      }}
      onMouseLeave={() => {
        isPaused.current = false;
      }}
    >
      {/*  LEFT — Text*/}
      <div
        className="relative z-10 flex w-full sm:w-1/2 items-center
                      justify-center px-8 py-10 lg:px-14 bg-white"
      >
        <div
          className="pointer-events-none absolute inset-0
                        bg-[radial-gradient(ellipse_at_10%_60%,#f0ede8_0%,transparent_65%)]"
        />

        <div
          ref={textRef}
          className="relative w-full max-w-md xl:max-w-lg space-y-6"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gray-400" />
            <span
              className="text-[11px] font-semibold tracking-[0.2em]
                             uppercase text-gray-400"
            >
              Our Bestsellers
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-[3.25rem] font-bold
                         leading-[1.1] text-gray-900 tracking-tight"
          >
            {product?.name}
          </h1>

          <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xs">
            {product?.description}
          </p>

          <Link
            to={`/product/${product.id}`}
            className="group inline-flex items-center gap-3 text-sm font-semibold
             uppercase tracking-widest text-gray-900
             hover:text-gray-600 transition-colors"
          >
            Shop Now
            <span className="block h-px w-8 bg-current transition-all duration-300 group-hover:w-16" />
          </Link>

          <div className="flex items-center gap-2 pt-1">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDot(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-800
                  ${
                    i === realIdx
                      ? "w-7 h-[7px] bg-gray-900"
                      : "w-[7px] h-[7px] bg-gray-300 hover:bg-gray-500"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ══ RIGHT — Slider */}
      {/*
        "group" on this div lets children use group-hover
        to show/hide on hover of the entire slider area
      */}
      <div
        ref={wrapRef}
        className="group/slider relative w-full sm:w-1/2 overflow-hidden bg-gray-100
                   h-[300px] sm:h-auto sm:self-stretch"
      >
        {/* Track */}
        <div ref={trackRef} className="flex h-full will-change-transform">
          {extended.map((item, i) => (
            <div
              key={i}
              className="relative h-full flex-none overflow-hidden"
              style={{ width: "var(--slide-w, 100%)" }}
            >
              <Link to={`/product/${item.id}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover object-center select-none"
                />
              </Link>
            </div>
          ))}
        </div>

        {/*  Nav Buttons: hidden by default, visible on hover */}
        <NavBtn dir="left" onClick={() => handleNav(-1)} />
        <NavBtn dir="right" onClick={() => handleNav(1)} />

        {/* Counter */}
        <div
          className="absolute bottom-3 right-3 rounded-full bg-black/40
                        px-3 py-1 text-xs font-medium text-white
                        backdrop-blur-sm select-none pointer-events-none
                        opacity-0 group-hover/slider:opacity-100
                        transition-opacity duration-300"
        >
          {realIdx + 1}&thinsp;/&thinsp;{TOTAL}
        </div>
      </div>
    </section>
  );
}

//  Nav Button
// Starts invisible + shifted inward
// On parent hover → fades in + slides to position
function NavBtn({ dir, onClick }) {
  const left = dir === "left";

  return (
    <button
      onClick={onClick}
      aria-label={left ? "Previous slide" : "Next slide"}
      className={`
        absolute top-1/2 -translate-y-1/2 z-10

        /*  Position */
        ${left ? "left-3" : "right-3"}

        /* ── Size & Shape */
        flex h-8 w-8 sm:h-10 sm:w-10
        items-center justify-center rounded-full

        /*  Appearance  */
        bg-white/90 shadow-lg backdrop-blur-sm
*/
        opacity-0
        ${left ? "-translate-x-4" : "translate-x-4"}
        pointer-events-none

        /* VISIBLE on slider hover  */
        group-hover/slider:opacity-100
        group-hover/slider:translate-x-0
        group-hover/slider:pointer-events-auto

        /*  Transition */
        transition-all duration-300 ease-out

        /*  Button hover  */
        hover:bg-white hover:scale-110 hover:shadow-xl

        /*  Focus  */
        focus:outline-none focus-visible:ring-2
        focus-visible:ring-gray-800
        focus-visible:opacity-100
        focus-visible:translate-x-0
        focus-visible:pointer-events-auto
      `}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-700
          transition-transform duration-200
          ${
            left
              ? "group-hover/slider:-translate-x-0.5"
              : "group-hover/slider:translate-x-0.5"
          }
        `}
      >
        {left ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 18 15 12 9 6" />
        )}
      </svg>
    </button>
  );
}
