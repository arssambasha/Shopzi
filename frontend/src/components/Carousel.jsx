import { useEffect, useRef, useState } from "react";

const images = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGiTAjCszLHOhwledpkCVIHgZX-Yh1J3Y-B_KoRIDgxg&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWv2j5W4604ca0NGqkqTPsYcUCBsjbfRn3jGODSvIhCQ&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdp4RB2CmRsTEfmR1QanHxMvF-94mJisWHzptfiILjBw&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcJgMaUBoFYDXEJTcGzxJmpeIbt1rbRvKkDm90FMbNAg&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9mcoFfqdGIncpvQPEAl7uDP8CfRYNpBndX9j6KEWyAQ&s=10",
  "https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=",
  "https://media.lombardodier.com/image/upload/f_auto,w_385/v1730138818/locom/_legacy/news/2021/May/20210521/Nature_LOcom.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTygrdEA_M2Jhj-W2oJ0lnfT6R-cYbZfrNAU3DFTtv-pQ&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXCsW10nAjoXFTDiXZW7Y-fPj9YPUX0aDKyIj-R9lhYw&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJwjfU21Deu5Uawf9EKMZ9_HMjxQhJPtsN4Rr6_gc0fw&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR31PdNyCMMzYJ36nxUAluKqaR8bdKWLQv5se6FTuM85A&s=10"
];

const Carousel = () => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
  }, []);

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (!container) return;

    const firstItem = container.firstElementChild;
    if (!firstItem) return;

    const itemWidth = firstItem.getBoundingClientRect().width;
    const gap = 16; 
    const scrollAmount = container.clientWidth - itemWidth - gap;

    container.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };
  return (
    <div className="relative px-4 py-6">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}
      </style>
      {canScrollLeft && (
        <button onClick={() => scroll(-1)} className="absolute left-4 top-1/2 z-10 flex h-[80px] w- items-center -translate-y-1/2 rounded-r-xl bg-white p-4 shadow border border-gray-400">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7.04 22L18 12 7.04 2"
              stroke="#0F1111"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="scale(-1, 1) translate(-24, 0)"
            />
          </svg>
        </button>
      )}

      <div ref={carouselRef} className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory" onScroll={checkScroll}>
        {images.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`image-${index + 1}`}
            className="h-96 w-56 flex-none rounded-lg object-cover snap-start"
          />
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-4 top-1/2 z-10 flex h-[80px] items-center -translate-y-1/2 rounded-l-xl bg-white p-4 shadow border border-gray-400"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7.04 22L18 12 7.04 2"
              stroke="#0F1111"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      
    </div>
  );
};

export default Carousel;