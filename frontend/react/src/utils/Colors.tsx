export interface ColorMap {
  UNCLASSIFIED: string;
  CONSTRUCTION: string;
  NOT_CONSTRUCTION: string;
  POSSIBLE_CONSTRUCTION: string;
  DUPLICATE: string;
}

export const colorMap: ColorMap = {
  UNCLASSIFIED: "#FFFFFF",
  CONSTRUCTION: "#CCFFCC",
  NOT_CONSTRUCTION: "#FFCCCC",
  POSSIBLE_CONSTRUCTION: "#FFFF99",
  DUPLICATE: "#ffdb99",
};

export const borderColorMap: ColorMap = {
  UNCLASSIFIED: "#EEE",
  CONSTRUCTION: " #00CC00",
  NOT_CONSTRUCTION: "#FF0000",
  POSSIBLE_CONSTRUCTION: "#DDDD00",
  DUPLICATE: "#FFA500",
};

export const altColorMap: ColorMap = {
  UNCLASSIFIED: "#777",
  CONSTRUCTION: " #006600",
  NOT_CONSTRUCTION: "#d60000",
  POSSIBLE_CONSTRUCTION: "#6e6e00",
  DUPLICATE: "#a86d00",
};