import type { SVGProps } from "react";

export function PlayerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path d="M14 6a2 2 0 10-4 0 2 2 0 004 0zM8.5 7H7.75A2.75 2.75 0 005 9.75V11h1.5v7h1.25a1.25 1.25 0 001.25-1.25V13h1v4.25a1.25 1.25 0 001.25 1.25h1.25v-7H14v-1.25A2.75 2.75 0 0011.25 7H10.5"/>
    </svg>
  );
}
