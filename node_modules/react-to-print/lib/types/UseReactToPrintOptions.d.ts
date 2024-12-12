import { RefObject } from "react";
import type { Font } from "./font";
export interface UseReactToPrintOptions {
    bodyClass?: string;
    contentRef?: RefObject<Element | Text>;
    documentTitle?: string;
    fonts?: Font[];
    ignoreGlobalStyles?: boolean;
    nonce?: string;
    onAfterPrint?: () => void;
    onBeforePrint?: () => Promise<void>;
    onPrintError?: (errorLocation: "onBeforePrint" | "print", error: Error) => void;
    pageStyle?: string;
    preserveAfterPrint?: boolean;
    print?: (target: HTMLIFrameElement) => Promise<any>;
    suppressErrors?: boolean;
    copyShadowRoots?: boolean;
}
