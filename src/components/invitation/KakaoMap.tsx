"use client";

import { useEffect, useRef, useState } from "react";

type KakaoMapProps = {
  address: string;
  javaScriptKey?: string;
  mapUrl?: string;
  venueName: string;
};

type KakaoMapStatus = "idle" | "loading" | "ready" | "error";

type KakaoLatLng = object;

type KakaoMapInstance = {
  relayout: () => void;
  setCenter: (position: KakaoLatLng) => void;
};

type KakaoGeocoderResult = {
  x: string;
  y: string;
};

type KakaoMapsApi = {
  LatLng: new (latitude: number, longitude: number) => KakaoLatLng;
  Map: new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level: number },
  ) => KakaoMapInstance;
  Marker: new (options: {
    map: KakaoMapInstance;
    position: KakaoLatLng;
  }) => object;
  load: (callback: () => void) => void;
  services: {
    Geocoder: new () => {
      addressSearch: (
        address: string,
        callback: (result: KakaoGeocoderResult[], status: string) => void,
      ) => void;
    };
    Status: {
      OK: string;
    };
  };
};

declare global {
  interface Window {
    kakao?: {
      maps: KakaoMapsApi;
    };
  }
}

const KAKAO_MAP_SDK_ID = "kakao-map-sdk";
const ADDRESS_DETAIL_PATTERN = /\s*\([^)]*\)\s*$/;

let kakaoMapSdkPromise: Promise<KakaoMapsApi> | null = null;

function getMapSearchAddress(address: string) {
  return address.replace(ADDRESS_DETAIL_PATTERN, "").trim();
}

function resolveKakaoMaps() {
  return new Promise<KakaoMapsApi>((resolve, reject) => {
    const maps = window.kakao?.maps;

    if (!maps) {
      reject(new Error("kakao_map_sdk_not_loaded"));
      return;
    }

    maps.load(() => resolve(maps));
  });
}

function loadKakaoMapSdk(javaScriptKey: string) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("kakao_map_sdk_unavailable"));
  }

  if (window.kakao?.maps) {
    return resolveKakaoMaps();
  }

  if (kakaoMapSdkPromise) {
    return kakaoMapSdkPromise;
  }

  kakaoMapSdkPromise = new Promise<KakaoMapsApi>((resolve, reject) => {
    const existingScript = document.getElementById(
      KAKAO_MAP_SDK_ID,
    ) as HTMLScriptElement | null;

    const handleLoaded = () => {
      resolveKakaoMaps().then(resolve).catch(reject);
    };

    const handleError = () => {
      kakaoMapSdkPromise = null;
      reject(new Error("kakao_map_sdk_load_failed"));
    };

    existingScript?.remove();

    const script = document.createElement("script");
    script.async = true;
    script.id = KAKAO_MAP_SDK_ID;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(javaScriptKey)}&autoload=false&libraries=services`;
    script.addEventListener("load", handleLoaded, { once: true });
    script.addEventListener("error", handleError, { once: true });
    document.head.appendChild(script);
  });

  return kakaoMapSdkPromise;
}

export function KakaoMap({
  address,
  javaScriptKey,
  mapUrl,
  venueName,
}: KakaoMapProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [status, setStatus] = useState<KakaoMapStatus>("idle");

  const trimmedAddress = address.trim();
  const trimmedKey = javaScriptKey?.trim() ?? "";
  const trimmedMapUrl = mapUrl?.trim() ?? "";

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mapContainer = mapRef.current;

    if (!shouldLoad || !mapContainer) {
      return;
    }

    if (!trimmedKey || !trimmedAddress) {
      setStatus("error");
      return;
    }

    let isCancelled = false;
    setStatus("loading");

    loadKakaoMapSdk(trimmedKey)
      .then((maps) => {
        const geocoder = new maps.services.Geocoder();

        geocoder.addressSearch(
          getMapSearchAddress(trimmedAddress),
          (result, geocoderStatus) => {
            if (isCancelled) {
              return;
            }

            const location = result[0];

            if (geocoderStatus !== maps.services.Status.OK || !location) {
              setStatus("error");
              return;
            }

            const position = new maps.LatLng(
              Number(location.y),
              Number(location.x),
            );
            const map = new maps.Map(mapContainer, {
              center: position,
              level: 3,
            });

            new maps.Marker({ map, position });

            window.requestAnimationFrame(() => {
              map.relayout();
              map.setCenter(position);
              setStatus("ready");
            });
          },
        );
      })
      .catch(() => {
        if (!isCancelled) {
          setStatus("error");
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [shouldLoad, trimmedAddress, trimmedKey]);

  const statusMessage =
    status === "error"
      ? "카카오 지도를 불러오지 못했습니다."
      : "카카오 지도를 불러오는 중입니다.";

  return (
    <div
      className="relative h-[310px] overflow-hidden border border-white/40 bg-[#ebe8df] shadow-[0_18px_45px_rgba(47,45,42,0.1)]"
      ref={wrapperRef}
    >
      <div
        aria-label={`${venueName} 카카오 지도`}
        className="absolute inset-0"
        ref={mapRef}
        role="region"
      />

      {status !== "ready" ? (
        <div
          aria-live="polite"
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#ebe8df] px-8 text-center"
        >
          <p className="text-[12px] leading-6 text-[#65635d]">{statusMessage}</p>
          {status === "error" && trimmedMapUrl ? (
            <a
              aria-label={`${venueName} 카카오맵에서 위치 보기`}
              className="inline-flex min-h-10 items-center rounded-full bg-[#191d1b] px-5 text-[11px] font-medium text-white shadow-[0_8px_20px_rgba(30,33,31,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              href={trimmedMapUrl}
              rel="noreferrer"
              target="_blank"
            >
              카카오맵에서 위치 보기
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
