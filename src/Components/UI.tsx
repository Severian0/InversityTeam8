interface UIProps {
    costalStart: any;
    setCostalStart: any;
    costalEnd: any;
    setCostalEnd: any;
    topLeft: any;
    setTopLeft: any;
    bottomRight: any;
    setBottomRight: any;
    calculatePath: () => void;
}

let UI = (props: UIProps) => {
    return (
        <div class="sticky left-10 w-1/3 h-fit my-auto mb-40 mt-40 bg-black bg-opacity-80 rounded-xl flex flex-col">
            <h1 class="text-xl m-4 font-roboto font-bold">Place waypoints</h1>
            <div class="flex flex-row text-md m-4">
                <div class="font-roboto">Costal Start - </div>
                <input
                    type="text"
                    class="mx-2 coastal-start"
                    oninput={(ev) => {
                        // get the value from the input
                        let value = (ev.target as HTMLInputElement).value;
                        console.log(value);
                        props.setCostalStart(Number(value));
                    }}
                />
            </div>
            <div class="flex flex-row text-md m-4">
                <div class="font-roboto coastal-end">Costal End - </div>
                <input
                    type="text"
                    class="mx-2"
                    oninput={(ev) => {
                        // get the value from the input
                        let value = (ev.target as HTMLInputElement).value;
                        console.log(value);
                        props.setCostalEnd(Number(value));
                    }}
                />
            </div>

            <h1 class="text-xl m-4 font-roboto font-bold">
                Select surveying zone
            </h1>
            <div class="flex flex-row text-md m-4">
                <div class="font-roboto">Top Left - </div>
                <input
                    type="text"
                    class="mx-2 tl"
                    oninput={(ev) => {
                        // get the value from the input
                        let value = (ev.target as HTMLInputElement).value;
                        console.log(value);
                        props.setTopLeft(Number(value));
                    }}
                />
            </div>
            <div class="flex flex-row text-md m-4">
                <div class="font-roboto">Bottom Right - </div>
                <input
                    type="text"
                    class="mx-2 br"
                    oninput={(ev) => {
                        // get the value from the input
                        let value = (ev.target as HTMLInputElement).value;
                        console.log(value);
                        props.setBottomRight(Number(value));
                    }}
                />
            </div>

            <button
                class="border-neutral-800 rounded-xl border-2 mx-5 text-lg my-7 hover:border-neutral-500 hover:bg-neutral-500 hover:text-white p-2 font-roboto font-bold"
                onclick={props.calculatePath}
            >
                Calculate Path
            </button>
        </div>
    );
};

export default UI;
