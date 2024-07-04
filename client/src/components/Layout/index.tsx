import { ReactNode } from "react";
import { Header } from "../Header";
import "./index.css";

// TODO @Lucas move styling to CSS
export const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ flex: "0 0 auto" }}>
                <Header />
            </div>
            <div
                style={{ flex: "1 1 auto", paddingTop: "2rem" }}
                className="container"
            >
                <div className="container-inner">{children}</div>
            </div>
        </div>
    );
};
