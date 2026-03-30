import Svg, { SvgProps, Path } from "react-native-svg";
type ExtendedSvgProps = SvgProps & { size?: number };
export const ProjectSvg = (props: ExtendedSvgProps) => (
  <Svg

    width={props.width ?? props.size ?? 21}
    height={props.height ?? props.size ?? 21}
    fill='none'
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

export const UsersSVG = (props: ExtendedSvgProps) => (
  <Svg

    width={props.width ?? props.size ?? 20}
    height={props?.height ?? props.size ?? 21}
    fill="none"
    {...props}
  >
    <Path
      stroke={props.color ?? "#676767"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.633 9.11a1.514 1.514 0 0 0-.275 0A3.683 3.683 0 0 1 3.8 5.42c0-2.042 1.65-3.7 3.7-3.7a3.696 3.696 0 0 1 .133 7.392Z"
    />
    <Path
      stroke={props.color ?? "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M7.633 9.11a1.514 1.514 0 0 0-.275 0A3.683 3.683 0 0 1 3.8 5.42c0-2.042 1.65-3.7 3.7-3.7a3.696 3.696 0 0 1 .133 7.392Z"
    />
    <Path
      stroke={props.color ?? "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M7.633 9.11a1.514 1.514 0 0 0-.275 0A3.683 3.683 0 0 1 3.8 5.42c0-2.042 1.65-3.7 3.7-3.7a3.696 3.696 0 0 1 .133 7.392Z"
    />
    <Path
      stroke={props.color ?? "#676767"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13.675 3.383a2.915 2.915 0 0 1 2.916 2.916 2.92 2.92 0 0 1-2.808 2.917.94.94 0 0 0-.217 0"
    />
    <Path
      stroke={props.color ?? "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M13.675 3.383a2.915 2.915 0 0 1 2.916 2.916 2.92 2.92 0 0 1-2.808 2.917.94.94 0 0 0-.217 0"
    />
    <Path
      stroke={props.color ?? "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M13.675 3.383a2.915 2.915 0 0 1 2.916 2.916 2.92 2.92 0 0 1-2.808 2.917.94.94 0 0 0-.217 0"
    />
    <Path
      stroke={props.color ?? "#676767"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.467 12.183c-2.017 1.35-2.017 3.55 0 4.892 2.291 1.533 6.05 1.533 8.341 0 2.017-1.35 2.017-3.55 0-4.892-2.283-1.525-6.041-1.525-8.341 0Z"
    />
    <Path
      stroke={props.color ?? "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M3.467 12.183c-2.017 1.35-2.017 3.55 0 4.892 2.291 1.533 6.05 1.533 8.341 0 2.017-1.35 2.017-3.55 0-4.892-2.283-1.525-6.041-1.525-8.341 0Z"
    />
    <Path
      stroke={props.color ?? "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M3.467 12.183c-2.017 1.35-2.017 3.55 0 4.892 2.291 1.533 6.05 1.533 8.341 0 2.017-1.35 2.017-3.55 0-4.892-2.283-1.525-6.041-1.525-8.341 0Z"
    />
    <Path
      stroke={props.color ?? "#676767"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.283 16.719a4.03 4.03 0 0 0 1.633-.725c1.3-.975 1.3-2.584 0-3.559-.458-.35-1.016-.583-1.608-.716"
    />
    <Path
      stroke={props.color ?? "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M15.283 16.719a4.03 4.03 0 0 0 1.633-.725c1.3-.975 1.3-2.584 0-3.559-.458-.35-1.016-.583-1.608-.716"
    />
    <Path
      stroke={props.color ?? "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M15.283 16.719a4.03 4.03 0 0 0 1.633-.725c1.3-.975 1.3-2.584 0-3.559-.458-.35-1.016-.583-1.608-.716"
    />
  </Svg>
);

export const PaymentSVG = (props: ExtendedSvgProps) => (
  <Svg

    width={20}
    height={21}
    fill="none"
    {...props}
  >
    <Path
      stroke={props.color ?? "#676767"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M16.083 6.651v4.292c0 2.566-1.466 3.666-3.666 3.666H5.09c-.375 0-.733-.033-1.066-.108a3.235 3.235 0 0 1-.592-.158c-1.25-.467-2.008-1.55-2.008-3.4V6.65c0-2.567 1.466-3.667 3.666-3.667h7.325c1.867 0 3.209.792 3.567 2.6.058.334.1.675.1 1.067Z"
    />
    <Path
      stroke={props.color ?? "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M16.083 6.651v4.292c0 2.566-1.466 3.666-3.666 3.666H5.09c-.375 0-.733-.033-1.066-.108a3.235 3.235 0 0 1-.592-.158c-1.25-.467-2.008-1.55-2.008-3.4V6.65c0-2.567 1.466-3.667 3.666-3.667h7.325c1.867 0 3.209.792 3.567 2.6.058.334.1.675.1 1.067Z"
    />
    <Path
      stroke={props.color ?? "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M16.083 6.651v4.292c0 2.566-1.466 3.666-3.666 3.666H5.09c-.375 0-.733-.033-1.066-.108a3.235 3.235 0 0 1-.592-.158c-1.25-.467-2.008-1.55-2.008-3.4V6.65c0-2.567 1.466-3.667 3.666-3.667h7.325c1.867 0 3.209.792 3.567 2.6.058.334.1.675.1 1.067Z"
    />
    <Path
      stroke={props.color ?? "#676767"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M18.584 9.153v4.291c0 2.567-1.467 3.667-3.667 3.667H7.592c-.617 0-1.175-.083-1.658-.267-.992-.366-1.667-1.125-1.909-2.341.334.075.692.108 1.067.108h7.325c2.2 0 3.667-1.1 3.667-3.667V6.653c0-.392-.034-.742-.1-1.067 1.583.333 2.6 1.45 2.6 3.567Z"
    />
    <Path
      stroke={props.color ?? "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M18.584 9.153v4.291c0 2.567-1.467 3.667-3.667 3.667H7.592c-.617 0-1.175-.083-1.658-.267-.992-.366-1.667-1.125-1.909-2.341.334.075.692.108 1.067.108h7.325c2.2 0 3.667-1.1 3.667-3.667V6.653c0-.392-.034-.742-.1-1.067 1.583.333 2.6 1.45 2.6 3.567Z"
    />
    <Path
      stroke={props.color ?? "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M18.584 9.153v4.291c0 2.567-1.467 3.667-3.667 3.667H7.592c-.617 0-1.175-.083-1.658-.267-.992-.366-1.667-1.125-1.909-2.341.334.075.692.108 1.067.108h7.325c2.2 0 3.667-1.1 3.667-3.667V6.653c0-.392-.034-.742-.1-1.067 1.583.333 2.6 1.45 2.6 3.567Z"
    />
    <Path
      stroke={props.color ?? "#676767"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M8.749 11.002a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
    />
    <Path
      stroke={props.color ?? "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M8.749 11.002a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
    />
    <Path
      stroke={props.color ?? "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M8.749 11.002a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
    />
    <Path
      stroke={props.color ?? "#676767"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M3.983 6.969v3.666"
    />
    <Path
      stroke={props.color ?? "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M3.983 6.969v3.666M3.983 6.969v3.666"
    />
    <Path
      stroke={props.color ?? "#676767"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M13.518 6.969v3.666"
    />
    <Path
      stroke={props.color ?? "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M13.518 6.969v3.666M13.518 6.969v3.666"
    />
  </Svg>
);

export const UnitSVG = (props: ExtendedSvgProps) => (
  <Svg

    width={props.width ?? props.size ?? 20}
    height={props.height ?? props.size ?? 21}
    fill="none"
    {...props}
  >
    <Path
      stroke={props.color || "#292929"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M5.584 15.052H3.459c-1.192 0-1.792-.6-1.792-1.792V3.51c0-1.191.6-1.791 1.792-1.791h3.583c1.192 0 1.792.6 1.792 1.791v1.542"
    />
    <Path
      stroke={props.color || "#292929"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M14.475 7.067v9.3c0 1.342-.667 2.017-2.009 2.017H7.6c-1.342 0-2.017-.675-2.017-2.017v-9.3c0-1.341.675-2.016 2.017-2.016h4.866c1.342 0 2.009.675 2.009 2.016Z"
    />
    <Path
      stroke={props.color || "#292929"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M11.167 5.052V3.51c0-1.191.6-1.791 1.792-1.791h3.583c1.192 0 1.792.6 1.792 1.791v9.75c0 1.192-.6 1.792-1.792 1.792h-2.067M8.333 9.219h3.333M8.333 11.719h3.333M10 18.383v-2.5"
    />
  </Svg>
)