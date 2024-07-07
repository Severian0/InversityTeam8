import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { SolidTyper } from "solid-typer";

interface NameProps {
  className?: string;
  cursorClassName?: string;

  names?: string[];
  settleIndex?: number;
  settleAfterMS?: number;
  backspaceSpeed?: number;
  typingSpeed?: number;
  backspacePause?: number;
  startDelay?: number;
  noFancy?: boolean;
  loop?: boolean;
}

const Name = (props: NameProps) => {
  let {
    className,
    cursorClassName,
    names,
    settleIndex,
    settleAfterMS,
    noFancy,
    loop,
  } = props;
  let { backspaceSpeed, backspacePause, startDelay, typingSpeed } = props;

  const navigate = useNavigate();
  names = names || ["Testing-0", "Something-Has-Gone-Wrong"];
  settleIndex = settleIndex || 1; // this should point to my full name
  settleAfterMS = settleAfterMS || 10000;
  noFancy = noFancy || false;
  loop = loop || false;

  backspaceSpeed = backspaceSpeed || 30;
  typingSpeed = typingSpeed || 100;
  backspacePause = backspacePause || 100;
  startDelay = startDelay || 100;
  cursorClassName =
    cursorClassName || "opacity-0 animate-pulse text-orange-500";
  // className="opacity-0 animate-pulse text-orange-500"

  let [nameList, setNameList] = createSignal(noFancy ? names : [...names, ""]);
  let [stateBit, setStateBit] = createSignal(0);
  let [timestamp, _] = createSignal(Date.now());

  let getTyper = (
    text: string[],
    callback: (finished?: boolean) => void,
    stateBit: number,
    className?: string,
  ) => {
    console.log("get typer ran");
    let component = (
      <SolidTyper
        text={nameList()}
        backspaceSpeed={backspaceSpeed}
        typingSpeed={typingSpeed}
        onBackspaceEnd={() => callback()}
        backspacePause={backspacePause}
        startDelay={startDelay}
        onFinish={() => callback(true)}
        cursor={true}
        cursorClassName={cursorClassName}
        loop={loop}
        className={className}
      />
    );
    return component;
  };

  let rerunOrSettle = (finished: boolean = false) => {
    console.log(Date.now() - timestamp(), "re-running");
    if (Date.now() - timestamp() > (settleAfterMS as number)) {
      if (nameList().length !== 1) {
        console.log("Settling on name");
        setNameList([nameList()[settleIndex as number]]);
      }
      console.log("Name already settled");
    } else {
      if (finished) setStateBit(stateBit() ^ 1);
    }
  };

  rerunOrSettle = noFancy ? (_ = false) => {} : rerunOrSettle;

  return getTyper(nameList(), rerunOrSettle, stateBit(), className);
};

export default Name;
