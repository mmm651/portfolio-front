export interface NavBubbleTitles {
  home: string;
  about: string;
  contact: string;
  services: string;
  clients: string;
}

export interface ThemeData {
  _id?: string;
  brandTitle: string;
  italicSerifStyle: boolean;
  centerpieceTitleScale: number;
  navBubbleTitles: NavBubbleTitles;
}

export interface OrbsData {
  _id?: string;
  ambientOrbsImages: string[];
}

export interface UpdateThemePayload {
  brandTitle?: string;
  italicSerifStyle?: boolean;
  centerpieceTitleScale?: number;
  navBubbleTitles?: Partial<NavBubbleTitles>;
}

export interface OrbImagePayload {
  imageUrl: string;
}
