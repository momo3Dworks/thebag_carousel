import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

// Imágenes Mobile
import brisketCheesesteakMobile from './assets/brisket_cheesesteak.webp';
import chickenCheesesteakMobile from './assets/chicken_cheesesteak.webp';
import chickenTenderMobile from './assets/chicken_tender.webp';
import dobleHumoMobile from './assets/doble_humo.webp';
import elSantoHeavyMobile from './assets/el_santo_heavy.webp';
import hhCubanMobile from './assets/hh_cuban.webp';
import jamonSwissMobile from './assets/jamon_swiss.webp';
import kimchiMobile from './assets/kimchi.webp';
import pastramiMobile from './assets/pastrami.webp';
import pavoMuensterMobile from './assets/pavo_muenster.webp';
import theUnforgettableMobile from './assets/the_unforgettable.webp';
import tunaMeltMobile from './assets/tuna_melt.webp';

// Imágenes Desktop (_desktop.webp)
import brisketCheesesteakDesktop from './assets/brisket_cheesesteak_desktop.webp';
import chickenCheesesteakDesktop from './assets/chicken_cheesesteak_desktop.webp';
import chickenTenderDesktop from './assets/chicken_tender_desktop.webp';
import dobleHumoDesktop from './assets/doble_humo_desktop.webp';
import elSantoHeavyDesktop from './assets/el_santo_heavy_desktop.webp';
import hhCubanDesktop from './assets/hh_cuban_desktop.webp';
import jamonSwissDesktop from './assets/jamon_swiss_desktop.webp';
import kimchiDesktop from './assets/kimchi_desktop.webp';
import pastramiDesktop from './assets/pastrami_desktop.webp';
import pavoMuensterDesktop from './assets/pavo_muenster_desktop.webp';
import theUnforgettableDesktop from './assets/the_unfergettable_desktop.webp';
import tunaMeltDesktop from './assets/tuna_melt_desktop.webp';

const ORDER_URL = 'https://app.ipos247.com/contactless/#/bc3795f482a7649811dab74d29562fd54c5a4925ac98d4e84150d58b188c24b7';

const slides = [
  {
    id: 1,
    title: 'Brisket Cheesesteak',
    mobileImage: brisketCheesesteakMobile,
    desktopImage: brisketCheesesteakDesktop,
  },
  {
    id: 2,
    title: 'Chicken Cheesesteak',
    mobileImage: chickenCheesesteakMobile,
    desktopImage: chickenCheesesteakDesktop,
  },
  {
    id: 3,
    title: 'Chicken Tender',
    mobileImage: chickenTenderMobile,
    desktopImage: chickenTenderDesktop,
  },
  {
    id: 4,
    title: 'Doble Humo',
    mobileImage: dobleHumoMobile,
    desktopImage: dobleHumoDesktop,
  },
  {
    id: 5,
    title: 'El Santo Heavy',
    mobileImage: elSantoHeavyMobile,
    desktopImage: elSantoHeavyDesktop,
  },
  {
    id: 6,
    title: 'HH Cuban',
    mobileImage: hhCubanMobile,
    desktopImage: hhCubanDesktop,
  },
  {
    id: 7,
    title: 'Jamón & Swiss',
    mobileImage: jamonSwissMobile,
    desktopImage: jamonSwissDesktop,
  },
  {
    id: 8,
    title: 'Kimchi',
    mobileImage: kimchiMobile,
    desktopImage: kimchiDesktop,
  },
  {
    id: 9,
    title: 'Pastrami',
    mobileImage: pastramiMobile,
    desktopImage: pastramiDesktop,
  },
  {
    id: 10,
    title: 'Pavo & Muenster',
    mobileImage: pavoMuensterMobile,
    desktopImage: pavoMuensterDesktop,
  },
  {
    id: 11,
    title: 'The Unforgettable',
    mobileImage: theUnforgettableMobile,
    desktopImage: theUnforgettableDesktop,
  },
  {
    id: 12,
    title: 'Tuna Melt',
    mobileImage: tunaMeltMobile,
    desktopImage: tunaMeltDesktop,
  },
];

const TOTAL_SLIDES = slides.length;

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [imageHeight, setImageHeight] = useState(null);

  const containerRef = useRef(null);
  const activeImgRef = useRef(null);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? TOTAL_SLIDES - 1 : prev - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === TOTAL_SLIDES - 1 ? 0 : prev + 1));
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Calcular la altura exacta de la imagen para alinear las flechas verticalmente al centro
  const updateImageHeight = useCallback(() => {
    if (activeImgRef.current) {
      setImageHeight(activeImgRef.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    updateImageHeight();

    let observer;
    if (activeImgRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        updateImageHeight();
      });
      observer.observe(activeImgRef.current);
    }

    window.addEventListener('resize', updateImageHeight);
    return () => {
      window.removeEventListener('resize', updateImageHeight);
      if (observer) observer.disconnect();
    };
  }, [updateImageHeight, currentIndex]);

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Gestos táctiles (Swipe)
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Drag con ratón (Desktop)
  const handleMouseDown = (e) => {
    if (e.target.closest('button, a')) return;
    setIsDragging(true);
    setTouchStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || touchStartX === null) return;
    const diff = e.clientX - touchStartX;
    setDragOffset(diff);
  };

  const handleMouseUp = (e) => {
    if (!isDragging || touchStartX === null) return;
    const diff = e.clientX - touchStartX;
    const minDistance = 50;

    if (diff < -minDistance) {
      nextSlide();
    } else if (diff > minDistance) {
      prevSlide();
    }

    setIsDragging(false);
    setTouchStartX(null);
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setTouchStartX(null);
      setDragOffset(0);
    }
  };

  // Posición 'top' de las flechas: mitad exacta de la imagen si está medida, o fallback proporcional
  const arrowTopStyle = imageHeight ? { top: `${imageHeight / 2}px` } : { top: '44%' };

  return (
    <main className="min-h-screen w-full bg-white flex flex-col justify-start md:justify-center items-center px-0.5 sm:px-6 pt-1 sm:pt-4 pb-4 sm:pb-8 overflow-hidden select-none">
      {/* Contenedor principal del carrusel */}
      <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Contenedor relativo de imágenes y controles */}
        <div className="relative w-full flex items-center justify-center">
          
          {/* Ventana de visualización con soporte táctil y mouse */}
          <div
            ref={containerRef}
            className="w-full overflow-hidden cursor-grab active:cursor-grabbing rounded-2xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {/* Track deslizable de slides */}
            <div
              className={`w-full flex transition-transform ease-out ${
                isDragging ? 'duration-0' : 'duration-500'
              }`}
              style={{
                transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
              }}
            >
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="w-full flex-shrink-0 flex flex-col items-center justify-center p-0 sm:p-2"
                  aria-hidden={currentIndex !== index}
                >
                  <div className="relative w-full flex flex-col items-center">
                    {/* Imagen adaptable: Desktop vs Mobile */}
                    <picture className="w-full flex items-center justify-center">
                      <source
                        media="(min-width: 768px)"
                        srcSet={slide.desktopImage}
                      />
                      <img
                        ref={index === currentIndex ? activeImgRef : null}
                        onLoad={index === currentIndex ? updateImageHeight : undefined}
                        src={slide.mobileImage}
                        alt={slide.title}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        className="w-[98%] sm:w-auto h-auto max-h-[64vh] sm:max-h-[68vh] md:max-h-[72vh] object-contain rounded-xl shadow-md border border-slate-100 transition-all pointer-events-none select-none"
                        draggable={false}
                      />
                    </picture>

                    {/* Call to Action en cada slide */}
                    <div className="w-full flex justify-center px-1 pt-2.5 sm:pt-4">
                      <a
                        href={ORDER_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-[98%] sm:w-auto min-w-[240px] md:min-w-[280px] py-3.5 px-8 rounded-full bg-white text-[#5c0d1e] font-bold text-base sm:text-lg tracking-wide border-2 border-[#5c0d1e] shadow-md hover:bg-[#5c0d1e] hover:text-white hover:shadow-xl hover:shadow-[#5c0d1e]/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer group no-underline"
                      >
                        <ShoppingBag className="w-5 h-5 text-[#5c0d1e] group-hover:text-white transition-colors duration-300" />
                        <span>Ordene THEbag</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flecha Izquierda Semitransparente - Alineada exactamente al centro vertical de la imagen */}
          <button
            type="button"
            onClick={prevSlide}
            style={arrowTopStyle}
            aria-label="Diapositiva anterior"
            className="absolute left-0.5 sm:left-4 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/55 hover:bg-white/85 text-[#5c0d1e]/90 hover:text-[#5c0d1e] backdrop-blur-md border border-white/70 shadow-sm hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#5c0d1e]/30"
          >
            <ChevronLeft className="w-4.5 h-4.5 sm:w-7 sm:h-7 -ml-0.5" />
          </button>

          {/* Flecha Derecha Semitransparente - Alineada exactamente al centro vertical de la imagen */}
          <button
            type="button"
            onClick={nextSlide}
            style={arrowTopStyle}
            aria-label="Diapositiva siguiente"
            className="absolute right-0.5 sm:right-4 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/55 hover:bg-white/85 text-[#5c0d1e]/90 hover:text-[#5c0d1e] backdrop-blur-md border border-white/70 shadow-sm hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#5c0d1e]/30"
          >
            <ChevronRight className="w-4.5 h-4.5 sm:w-7 sm:h-7 -mr-0.5" />
          </button>
        </div>

        {/* Puntos de navegación centrados abajo del carousel y del CTA */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-5 py-1.5 sm:py-2 px-3 sm:px-4 bg-gray-50/70 backdrop-blur-sm rounded-full border border-gray-100 shadow-2xs">
          {slides.map((_, index) => {
            const isActive = currentIndex === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Ir a la diapositiva ${index + 1}`}
                aria-current={isActive ? 'true' : 'false'}
                className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5c0d1e]/30 ${
                  isActive
                    ? 'w-6 sm:w-8 h-2.5 sm:h-3 bg-[#5c0d1e]'
                    : 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            );
          })}
        </div>

        {/* Contador sutil */}
        <div className="mt-1 text-xs font-semibold text-gray-400 tracking-wider">
          {currentIndex + 1} / {TOTAL_SLIDES}
        </div>
      </div>
    </main>
  );
}
