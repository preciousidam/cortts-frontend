import Svg, { SvgProps, Path } from "react-native-svg";
export const ProjectSvg = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={21}
    fill="none"
    {...props}
  >
    <Path
      stroke="#292929"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={0.75}
      d="M6.471 15.341H4.346c-1.191 0-1.791-.6-1.791-1.791V3.8c0-1.192.6-1.792 1.791-1.792H7.93c1.191 0 1.791.6 1.791 1.792V5.34"
    />
    <Path
      stroke="#292929"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={0.75}
      d="M15.36 7.36v9.3c0 1.342-.666 2.017-2.008 2.017H8.485c-1.341 0-2.016-.675-2.016-2.017v-9.3c0-1.341.675-2.016 2.016-2.016h4.867c1.342 0 2.008.675 2.008 2.016Z"
    />
    <Path
      stroke="#292929"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={0.75}
      d="M12.055 5.341V3.8c0-1.191.6-1.791 1.791-1.791h3.584c1.191 0 1.791.6 1.791 1.792v9.75c0 1.191-.6 1.791-1.791 1.791h-2.067M9.219 9.508h3.333M9.219 12.008h3.333M10.887 18.68v-2.5"
    />
  </Svg>
);
export default ProjectSvg

export const UsersSVG = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    {...props}
  >
    <Path
      stroke="#292929"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.111}
      d="M8.476 10.228a1.614 1.614 0 0 0-.294 0A3.929 3.929 0 0 1 4.387 6.29a3.943 3.943 0 0 1 3.946-3.946 3.943 3.943 0 0 1 .142 7.884ZM14.92 4.125a3.109 3.109 0 0 1 3.111 3.111 3.115 3.115 0 0 1-2.995 3.111 1.003 1.003 0 0 0-.231 0M4.031 13.51c-2.15 1.44-2.15 3.786 0 5.217 2.445 1.635 6.454 1.635 8.898 0 2.151-1.44 2.151-3.787 0-5.218-2.436-1.627-6.444-1.627-8.898 0ZM16.637 18.345a4.3 4.3 0 0 0 1.742-.773c1.387-1.04 1.387-2.756 0-3.796-.489-.373-1.085-.622-1.716-.764"
    />
  </Svg>
);

export const PaymentSVG = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={19}
    fill="none"
    {...props}
  >
    <Path
      stroke="#292929"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={0.8}
      d="M14.405 6.212v3.815c0 2.282-1.304 3.26-3.26 3.26h-6.51c-.334 0-.653-.03-.949-.097a2.883 2.883 0 0 1-.526-.14c-1.11-.415-1.785-1.378-1.785-3.023V6.212c0-2.281 1.304-3.259 3.26-3.259h6.51c1.66 0 2.852.704 3.17 2.311.053.297.09.6.09.948Z"
    />
    <Path
      stroke="#292929"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={0.8}
      d="M16.628 8.432v3.815c0 2.281-1.303 3.26-3.259 3.26H6.858c-.548 0-1.045-.075-1.474-.238-.882-.326-1.482-1-1.697-2.081.297.066.615.096.949.096h6.51c1.956 0 3.26-.978 3.26-3.26V6.21c0-.348-.03-.66-.089-.948 1.408.296 2.311 1.289 2.311 3.17Z"
    />
    <Path
      stroke="#292929"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={0.8}
      d="M7.885 10.08a1.956 1.956 0 1 0 0-3.912 1.956 1.956 0 0 0 0 3.911ZM3.652 6.492v3.26M12.125 6.492v3.26"
    />
  </Svg>
);
