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
  getLevel: () => number;
  relayout: () => void;
  setCenter: (position: KakaoLatLng) => void;
  setLevel: (level: number) => void;
};

type KakaoCustomOverlayInstance = {
  setMap: (map: KakaoMapInstance | null) => void;
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
  CustomOverlay: new (options: {
    clickable: boolean;
    content: HTMLElement;
    map: KakaoMapInstance;
    position: KakaoLatLng;
    yAnchor: number;
  }) => KakaoCustomOverlayInstance;
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
const MIN_MAP_LEVEL = 1;
const MAX_MAP_LEVEL = 8;

let kakaoMapSdkPromise: Promise<KakaoMapsApi> | null = null;

function getMapSearchAddress(address: string) {
  return address.replace(ADDRESS_DETAIL_PATTERN, "").trim();
}

function createVenueOverlayContent(venueName: string, mapUrl: string) {
  const container = document.createElement("div");
  const label = document.createElement(mapUrl ? "a" : "div");
  const title = document.createElement("strong");
  const description = document.createElement("span");
  const pin = document.createElement("span");
  const pinCenter = document.createElement("span");

  container.className = "wedding-map-marker";
  label.className = "wedding-map-label";
  title.className = "wedding-map-label-title";
  description.className = "wedding-map-label-description";
  pin.className = "wedding-map-pin";
  pinCenter.className = "wedding-map-pin-center";

  title.textContent = venueName;
  description.textContent = mapUrl
    ? "예식장 · 카카오맵에서 보기"
    : "예식장 위치";

  if (mapUrl) {
    label.setAttribute("aria-label", `${venueName} 카카오맵에서 위치 보기`);
    label.setAttribute("href", mapUrl);
    label.setAttribute("rel", "noreferrer");
    label.setAttribute("target", "_blank");
  }

  pin.setAttribute("aria-hidden", "true");
  label.append(title, description);
  pin.append(pinCenter);
  container.append(label, pin);

  return container;
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
  const mapInstanceRef = useRef<KakaoMapInstance | null>(null);
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
    let customOverlay: KakaoCustomOverlayInstance | null = null;
    let mapInstance: KakaoMapInstance | null = null;

    mapInstanceRef.current = null;
    mapContainer.replaceChildren();
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

            mapInstance = map;
            mapInstanceRef.current = map;
            customOverlay = new maps.CustomOverlay({
              clickable: true,
              content: createVenueOverlayContent(venueName, trimmedMapUrl),
              map,
              position,
              yAnchor: 1,
            });

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
      customOverlay?.setMap(null);

      if (mapInstanceRef.current === mapInstance) {
        mapInstanceRef.current = null;
      }
    };
  }, [shouldLoad, trimmedAddress, trimmedKey, trimmedMapUrl, venueName]);

  const handleZoomIn = () => {
    const map = mapInstanceRef.current;

    if (!map) {
      return;
    }

    map.setLevel(Math.max(MIN_MAP_LEVEL, map.getLevel() - 1));
  };

  const handleZoomOut = () => {
    const map = mapInstanceRef.current;

    if (!map) {
      return;
    }

    map.setLevel(Math.min(MAX_MAP_LEVEL, map.getLevel() + 1));
  };

  const statusMessage =
    status === "error"
      ? "카카오 지도를 불러오지 못했습니다."
      : "카카오 지도를 불러오는 중입니다.";

  return (
    <div
      className="relative h-[310px] overflow-hidden rounded-[24px] border border-white/55 bg-[#ebe8df] shadow-[0_18px_45px_rgba(47,45,42,0.14)]"
      ref={wrapperRef}
    >
      <div
        aria-label={`${venueName} 카카오 지도`}
        className="absolute inset-0"
        ref={mapRef}
        role="region"
      />

      {status === "ready" ? (
        <div
          aria-label="지도 확대 및 축소"
          className="absolute right-3 top-3 z-20 overflow-hidden rounded-full border border-white/70 bg-[#f7f2eb]/95 shadow-[0_8px_24px_rgba(33,39,36,0.2)] backdrop-blur-sm"
          role="group"
        >
          <button
            aria-label="지도 확대"
            className="flex size-11 items-center justify-center text-[20px] font-light leading-none text-[#27302d] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#27302d]"
            onClick={handleZoomIn}
            type="button"
          >
            +
          </button>
          <span aria-hidden="true" className="mx-auto block h-px w-5 bg-[#27302d]/16" />
          <button
            aria-label="지도 축소"
            className="flex size-11 items-center justify-center text-[22px] font-light leading-none text-[#27302d] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#27302d]"
            onClick={handleZoomOut}
            type="button"
          >
            −
          </button>
        </div>
      ) : null}

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
