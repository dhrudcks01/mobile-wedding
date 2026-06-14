export type WeddingSide = "groom" | "bride";

export type WeddingMeta = {
  title: string;
  description: string;
  url: string;
  ogImage: string;
};

export type WeddingPerson = {
  name: string;
  phone: string;
  father: string;
  mother: string;
};

export type WeddingCouple = {
  groom: WeddingPerson;
  bride: WeddingPerson;
};

export type WeddingEvent = {
  dateTime: string;
  displayDate: string;
  venueName: string;
  hallName: string;
  address: string;
  parking: string;
  transport: string;
};

export type WeddingImages = {
  hero: string;
  gallery: string[];
};

export type WeddingMapLinks = {
  kakao: string;
  naver: string;
  tmap: string;
  google: string;
};

export type WeddingAccount = {
  side: WeddingSide;
  label: string;
  bank: string;
  holder: string;
  number: string;
};

export type Wedding = {
  meta: WeddingMeta;
  couple: WeddingCouple;
  event: WeddingEvent;
  greeting: string;
  images: WeddingImages;
  mapLinks: WeddingMapLinks;
  accounts: WeddingAccount[];
};
