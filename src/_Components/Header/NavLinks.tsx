import { useNavigate } from "@solidjs/router";
import { For } from "solid-js";

interface NavLinksProps {
  links?: [string, string][]; // Name, URL
  className?: string;
}

const NavLinks = (props: NavLinksProps) => {
  const navigate = useNavigate();
  let { className, links } = props;
  links = links || [
    ["About", "/about"],
    ["Post", "/post"],
    ["Projects", "/#project"],
    ["Contact", "/contact"],
  ];

  let onClick = (route: string) => {
    if (route?.[1] == "#") location.href = route;
    else navigate(route);
  };

  return (
    <div class={`${className}`}>
      <For each={links}>
        {([page, link]: [string, string]) => (
          <a
            href={`${link}`}
            class="cursor-pointer hover:underline m-3"
            onClick={() => onClick(link)}
          >
            {page}
          </a>
        )}
      </For>
    </div>
  );
};

export default NavLinks;
