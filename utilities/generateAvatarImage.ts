

type Props = {
  name: string;
  background?: string;
  color?: string;
  size?: number;
};

export default function generateAvatarImage({
  name,
  background = 'D9EBF7',
  color = '292929',
  size = 40
}: Props): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&size=${size}&background=${background}&color=${color}&bold=true&rounded=true`;
}
