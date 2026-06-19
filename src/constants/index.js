import {
  blackImg,
  blueImg,
  highlightFirstVideo,
  highlightFirstVideoMobile,
  highlightSecondVideo,
  highlightSecondVideoMobile,
  highlightThirdVideo,
  highlightThirdVideoMobile,
  whiteImg,
  yellowImg,
} from "../utils";

// 414 x 737  w x h

// export const navLists = ["Store", "Mac", "iPhone", "Support"];

export const hightlightsSlides = [
  {
    id: 1,
    textLists: [
      "True Materials. No markup. No guesswork"
    ],
    video: highlightFirstVideo,
    videoMobile: highlightFirstVideoMobile,
    videoDuration: 4,
    captionTitle: "The Marketplace",
    caption: "A transparent creative supply marketplace that connects you directly to the best materials — curated by quality, skill level, and intent.",
  },
  {
    id: 2,
    textLists: ["Art, uninterrupted"],
    video: highlightSecondVideo,
    videoMobile: highlightSecondVideoMobile,
    videoDuration: 5,
    captionTitle: "A creator focused social platform where your art isn't buried by algorithms.",
    caption: "Where art work is discovered for its craft, collected for its meaning, and valued for its story.",
  },
  {
    id: 3,
    textLists: [
      "A creative home, not just a workspace"
    ],
    video: highlightThirdVideo,
    videoMobile: highlightThirdVideoMobile,
    videoDuration: 2,
    captionTitle: "The Studio",
    caption: "Our Dallas flagship will be a member based studio that blends creation, wellness, and community. workshops, Pilates, dinners, and shared inspiration under one roof.",
  },
];

export const models = [
  {
    id: 1,
    title: "iPhone 15 Pro in Natural Titanium",
    color: ["#8F8A81", "#ffe7b9", "#6f6c64"],
    img: yellowImg,
  },
  {
    id: 2,
    title: "iPhone 15 Pro in Blue Titanium",
    color: ["#53596E", "#6395ff", "#21242e"],
    img: blueImg,
  },
  {
    id: 3,
    title: "iPhone 15 Pro in White Titanium",
    color: ["#C9C8C2", "#ffffff", "#C9C8C2"],
    img: whiteImg,
  },
  {
    id: 4,
    title: "iPhone 15 Pro in Black Titanium",
    color: ["#454749", "#3b3b3b", "#181819"],
    img: blackImg,
  },
];

export const sizes = [
  { label: '6.1"', value: "small" },
  { label: '6.7"', value: "large" },
];

export const footerLinks = [
  "Privacy Policy",
  "Terms of Use",
  "Sales Policy",
  "Legal",
  "Site Map",
];