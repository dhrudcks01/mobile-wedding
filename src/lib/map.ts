import type { WeddingMapLinks } from "@/types/wedding";

type MapLinkKey = keyof WeddingMapLinks;

type MapLinkMeta = {
  key: MapLinkKey;
  label: string;
};

const MAP_LINKS: MapLinkMeta[] = [
  { key: "kakao", label: "카카오맵" },
  { key: "naver", label: "네이버지도" },
  { key: "tmap", label: "티맵" },
  { key: "google", label: "구글맵" },
];

export function getAvailableMapLinks(mapLinks: WeddingMapLinks) {
  return MAP_LINKS.map((mapLink) => ({
    ...mapLink,
    href: mapLinks[mapLink.key],
  })).filter((mapLink) => mapLink.href.trim().length > 0);
}
