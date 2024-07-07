// Header.tsx

import { Show, createEffect, createSignal, type Component } from 'solid-js';

import Name from './Name';
import NavLinks from './NavLinks';
import { RiUserFacesUser3Fill } from 'solid-icons/ri';
import { getUsername, userSignedIn } from '../../Tools/Auth';
import { Logo } from './Logo';

interface HeaderProps {
    slim?: boolean;
}

const Header = (props: HeaderProps) => {
    const { slim } = props;
    const [signedInInfo, setSignedInInfo] = createSignal<any>();
    const [loading, setLoading] = createSignal(true);

    createEffect(async () => {
        if (!(await userSignedIn())) {
            setLoading(false);
            return;
        }

        let username = await getUsername();
        setSignedInInfo({ username });
        setLoading(false);
    });

    return (
        <header
            class="flex items-center flex-row  justify-between  px-4 lg:left-1/2 2xl:text-xl sticky top-0 z-50"
            classList={{
                'mt-8 md:my-3 py-4 md:mx-8 mx-4 md:px-10': !slim,
                'py-1 mt-1': slim,
            }}
        >
            <a
                href="/"
                class="overflow-clip flex md:flex-row items-center md:justify-center py-2 font-bold font-cantarell group flex-grow md:flex-grow-0"
            >
                <Logo class="h-7 mr-3  text-white group-hover:animate-wiggle transition-all hover:h-8" />
                <div class="text-2xl md:block">{'SmartSurvey'}</div>
            </a>
            <div class="flex flex-row items-center flex-grow justify-end">
                <Show when={!loading() && !signedInInfo()}>
                    <a
                        href="/sign-in"
                        class="mx-[0.3em] font-cantarell hover:bg-neutral-400 hover:bg-opacity-20 rounded-md px-1 transition-all"
                    >
                        {/* Sign In */}
                    </a>
                </Show>
                <div class="flex flex-row items-center">
                    <a
                        href="/profile/me"
                        class="flex flex-row items-center"
                        title="profile"
                    >
                        <RiUserFacesUser3Fill
                            class="md:h-5 hover:cursor-pointer hover:text-orange-400 mx-1 md:mx-0 h-6 w-9"
                            classList={{
                                'text-gray-200': loading() || !signedInInfo(),
                                'text-orange-400': !loading() && signedInInfo(),
                            }}
                        />
                        <Show when={!loading() && signedInInfo()}>
                            <div class="mr-[0.3em] font-cantarell hover:bg-neutral-400 hover:bg-opacity-20 rounded-md px-1 transition-all hidden md:block">
                                {signedInInfo().username}
                            </div>
                        </Show>
                    </a>
                    <Show when={!loading() && signedInInfo()}>
                        <div
                            class="font-cantarell bg-neutral-400 bg-opacity-20 rounded-md px-1 text-sm md:-mb-1"
                            title="problems solved"
                        >
                            {10}
                        </div>
                    </Show>
                </div>
            </div>
        </header>
    );
};

export default Header;
