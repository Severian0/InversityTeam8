import { For, Show, createEffect, createSignal } from 'solid-js';
import { MathfieldElement } from 'mathlive';
import './math-live-styling.css';
import { ComputeEngine } from '@cortex-js/compute-engine';

interface MathInputProps {
    optionals?: {
        matrix?: boolean;
    };
    noSubmit?: boolean;
    callOnInput?: (ev: any) => void;
    initialValue?: string; // Should be latex
    problemId?: string;
    callOnCorrect?: () => void;
    computeEngine: ComputeEngine;
    useMf?: MathfieldElement;
}

let MathInput = (props: MathInputProps) => {
    MathfieldElement.computeEngine = props.computeEngine as any;
    const ce = props.computeEngine as ComputeEngine;

    const mf = props.useMf || new MathfieldElement();

    if (props.initialValue) {
        mf.setValue(props.initialValue, {
            selectionMode: 'placeholder',
            focus: false,
            insertionMode: 'replaceAll',
        });
    }

    let keepMenuItems = ['copy', 'paste', 'select-all'];
    if (props.optionals?.matrix || true) keepMenuItems.unshift('insert-matrix');

    createEffect(() => {
        // console.log(mf.menuItems);
        mf.menuItems = mf.menuItems.filter(({ id }: any) =>
            keepMenuItems.includes(id)
        );
        let custom = [
            {
                label: 'Submit',
                onMenuSelect: () => onSubmit(),
            },
            {
                type: 'divider',
            },
        ];
        if (props.noSubmit) {
            custom = [];
        }
        mf.menuItems = [...custom, ...mf.menuItems] as typeof mf.menuItems;
    });

    let submitBtn: HTMLButtonElement | null = null;
    // Create the submit button
    createEffect(() => {
        if (props.noSubmit) return;
        const style = document.createElement('style');
        style.textContent = `
            .submit-btn {
                font-family: 'JetBrains Mono', monospace;
                margin-top: auto;
                margin-bottom: auto;
                padding-top: 8px;
                padding-right: 16px;
                padding-bottom: 10px;
                padding-left: 16px;
                font-size: 1.125rem;
                color: #cbd5e0;
                transition: color 0.3s ease-in-out;
                background-color: transparent;
                border: none;
                cursor: pointer;
            }

            .submit-btn:hover {
                color: rgb(96 165 250);
            }

            .submit-btn:active {
                color: #cbd5e0;
            }
        `;

        // Append the style element to the Shadow DOM
        mf.shadowRoot?.appendChild(style);

        // Create the submit button
        submitBtn = document.createElement('button');
        submitBtn.textContent = 'Submit';
        submitBtn.classList.add('submit-btn');
        submitBtn.addEventListener('click', onSubmit);

        const keyboardToggleEl = mf.shadowRoot?.querySelector(
            '.ML__virtual-keyboard-toggle'
        );
        const containerEl = mf.shadowRoot?.querySelector('.ML__container');

        if (containerEl) {
            containerEl.insertBefore(submitBtn, keyboardToggleEl as Element);
        }
    });

    // prevents entering LaTeX mode
    mf.addEventListener(
        'keydown',
        (ev) => {
            switch (ev.key) {
                case 'Escape':
                    ev.preventDefault();
                    break;
                case '\\':
                    ev.preventDefault();
                    mf.executeCommand(['insert', '\\backslash']);
                    break;
                default:
                    mf.style.borderColor = 'rgb(255, 255, 255)'; // reset border color
                    mf.style.color = 'rgb(255, 255, 255)'; // reset text color
                    if (!props.noSubmit) {
                        (submitBtn as HTMLButtonElement).style.color =
                            'rgb(255, 255, 255)';
                    }
                    break;
            }
        },
        { capture: true }
    );
    mf.addEventListener('input', (ev: any) => {
        if (ev.inputType == 'insertLineBreak') {
            if (props.noSubmit) return;
            onSubmit();
        }
        if (props.callOnInput) props.callOnInput(ev);
    });

    mf.addEventListener('blur', (ev: any) => {});

    mf.addEventListener('submit', (e) => {
        if (props.noSubmit) return;
        e.preventDefault();
        onSubmit();
    });

    let onSubmit = async () => {
        if (props.noSubmit || !props.problemId) return;

        let mathJSON = JSON.stringify(mf.expression.json);
        let res = await fetch('/api/ce/evaluate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                problem_link: `/problem/${props.problemId}`,
                submission: mathJSON,
            }),
        });

        res = await res.json();
        if ((res as any).correct) {
            mf.style.borderColor = 'rgb(34, 197, 94)';
            // mf.style.color = 'rgb(34, 197, 94)';
            (submitBtn as HTMLButtonElement).style.color = 'rgb(34, 197, 94)';
            console.log('Correct!');
            if (props.callOnCorrect) props.callOnCorrect();
        } else {
            mf.style.borderColor = 'rgb(239 68 68)';
            // mf.style.color = 'rgb(239 68 68)';

            (submitBtn as HTMLButtonElement).style.color = 'rgb(239 68 68)';
            console.log('Incorrect!');
        }
    };

    mf.defaultMode = 'math';

    return mf;
};

let randomId = () => Math.random().toString(36).substring(7);
let sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default MathInput;
