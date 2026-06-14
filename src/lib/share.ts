export type SharePayload = {
  imageUrl?: string;
  text: string;
  title: string;
  url: string;
};

export type KakaoShareStatus = "shared" | "missing-key" | "unavailable";

type KakaoShareOptions = {
  buttons: Array<{
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
    title: string;
  }>;
  content: {
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
    title: string;
  };
  objectType: "feed";
};

type KakaoShareApi = {
  sendDefault: (options: KakaoShareOptions) => void;
};

type KakaoSdk = {
  init: (javaScriptKey: string) => void;
  isInitialized: () => boolean;
  Link?: KakaoShareApi;
  Share?: KakaoShareApi;
};

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

const KAKAO_SDK_ID = "kakao-javascript-sdk";
const KAKAO_SDK_SRC =
  "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";

let kakaoSdkPromise: Promise<KakaoSdk> | null = null;

export function getCurrentShareUrl(fallbackUrl: string) {
  if (typeof window === "undefined") {
    return fallbackUrl;
  }

  return window.location.href || fallbackUrl;
}

export function getAbsoluteUrl(pathOrUrl: string, baseUrl: string) {
  try {
    return new URL(pathOrUrl, baseUrl).toString();
  } catch {
    return pathOrUrl;
  }
}

export async function copyTextToClipboard(text: string) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    throw new Error("empty_copy_text");
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(trimmedText);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("clipboard_unavailable");
  }

  const textArea = document.createElement("textarea");
  textArea.value = trimmedText;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  document.body.appendChild(textArea);
  textArea.select();

  try {
    const isCopied = document.execCommand("copy");

    if (!isCopied) {
      throw new Error("fallback_copy_failed");
    }
  } finally {
    document.body.removeChild(textArea);
  }
}

export function canUseWebShare(payload: SharePayload) {
  if (typeof navigator === "undefined" || !navigator.share) {
    return false;
  }

  if (navigator.canShare) {
    return navigator.canShare({
      text: payload.text,
      title: payload.title,
      url: payload.url,
    });
  }

  return true;
}

export async function shareWithWebShare(payload: SharePayload) {
  if (!canUseWebShare(payload)) {
    throw new Error("web_share_unavailable");
  }

  await navigator.share({
    text: payload.text,
    title: payload.title,
    url: payload.url,
  });
}

export function isKakaoShareConfigured(javaScriptKey?: string) {
  return Boolean(javaScriptKey?.trim());
}

function loadKakaoSdk() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("kakao_sdk_unavailable"));
  }

  if (window.Kakao) {
    return Promise.resolve(window.Kakao);
  }

  if (kakaoSdkPromise) {
    return kakaoSdkPromise;
  }

  kakaoSdkPromise = new Promise<KakaoSdk>((resolve, reject) => {
    const existingScript = document.getElementById(
      KAKAO_SDK_ID,
    ) as HTMLScriptElement | null;

    const handleLoaded = () => {
      if (window.Kakao) {
        resolve(window.Kakao);
        return;
      }

      reject(new Error("kakao_sdk_not_loaded"));
    };

    const handleError = () => {
      kakaoSdkPromise = null;
      reject(new Error("kakao_sdk_load_failed"));
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleLoaded, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.id = KAKAO_SDK_ID;
    script.src = KAKAO_SDK_SRC;
    script.addEventListener("load", handleLoaded, { once: true });
    script.addEventListener("error", handleError, { once: true });
    document.head.appendChild(script);
  });

  return kakaoSdkPromise;
}

export async function shareWithKakao(
  payload: SharePayload,
  javaScriptKey?: string,
) {
  const trimmedKey = javaScriptKey?.trim();

  if (!trimmedKey) {
    return "missing-key" satisfies KakaoShareStatus;
  }

  const kakao = await loadKakaoSdk();

  if (!kakao.isInitialized()) {
    kakao.init(trimmedKey);
  }

  const shareApi = kakao.Share ?? kakao.Link;

  if (!shareApi?.sendDefault) {
    return "unavailable" satisfies KakaoShareStatus;
  }

  const imageUrl = payload.imageUrl ?? payload.url;
  const link = {
    mobileWebUrl: payload.url,
    webUrl: payload.url,
  };

  shareApi.sendDefault({
    objectType: "feed",
    content: {
      title: payload.title,
      description: payload.text,
      imageUrl,
      link,
    },
    buttons: [
      {
        title: "청첩장 보기",
        link,
      },
    ],
  });

  return "shared" satisfies KakaoShareStatus;
}
