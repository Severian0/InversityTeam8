import "./logo.css";

interface LogoProps {
  class?: string;
  classList?: Record<string, boolean>;
}

export const Logo = (props: LogoProps) => {
  return (
    <svg
      fill="rgb(251 146 60)"
      // height="200px"
      // width="200px"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 324.985 324.985"
      class={`logo-svg ${props.class}`}
      classList={props.classList}
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <g>
          {" "}
          <path d="M54.324,270.626c-12.33-12.332-26.508-21.168-39.921-24.881c-2.358-0.652-4.514-1.089-6.521-1.382l-1.348,1.348 c-0.003,0.003-0.007,0.006-0.01,0.009c-12.576,12.577-6.46,38.396,13.923,58.778c12.823,12.823,28.313,20.479,41.437,20.479 c7.057,0,13.054-2.268,17.344-6.557c0.004-0.004,0.008-0.009,0.012-0.013l1.345-1.345c-0.294-2.006-0.729-4.161-1.382-6.519 C75.491,297.133,66.655,282.956,54.324,270.626z"></path>{" "}
          <path d="M323.409,51.129c-2.901-10.481-9.62-21.375-18.918-30.672C284.11,0.073,258.29-6.045,245.712,6.534L21.175,231.071 c14.74,4.594,30.43,14.206,44.464,28.241c14.033,14.032,23.645,29.722,28.237,44.46L318.413,79.235 C324.866,72.783,326.641,62.801,323.409,51.129z"></path>{" "}
        </g>{" "}
      </g>
    </svg>
  );
};
