import { Transition, TransitionProps } from "@mantine/core";
import { PropsWithChildren, useEffect, useState } from "react";

export function TransitionOnMount({
    children,
    ...props
}: PropsWithChildren<Omit<TransitionProps, "mounted" | "children">>) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Transition
            mounted={mounted}
            duration={500}
            transition="fade-up"
            {...props}
        >
            {(style) => <div style={style}>{children}</div>}
        </Transition>
    );
}
