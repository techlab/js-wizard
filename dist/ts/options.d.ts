export declare const defaultOptions: {
    selected: number;
    theme: string;
    justified: boolean;
    autoAdjustHeight: boolean;
    backButtonSupport: boolean;
    enableUrlHash: boolean;
    transition: {
        name: string;
        animationShow: string;
        animationHide: string;
        animation: string;
        speed: string;
        easing: string;
        prefixCss: string;
        fwdShowCss: string;
        fwdHideCss: string;
        bckShowCss: string;
        bckHideCss: string;
    };
    toolbar: {
        position: string;
        showNextButton: boolean;
        showPreviousButton: boolean;
        extraHtml: string;
    };
    anchor: {
        enableNavigation: boolean;
        enableNavigationAlways: boolean;
        enableDoneState: boolean;
        markPreviousStepsAsDone: boolean;
        unDoneOnBackNavigation: boolean;
        enableDoneStateNavigation: boolean;
    };
    keyboard: {
        keyNavigation: boolean;
        keyLeft: number[];
        keyRight: number[];
    };
    lang: {
        next: string;
        previous: string;
    };
    style: {
        mainCss: string;
        navCss: string;
        navLinkCss: string;
        contentCss: string;
        contentPanelCss: string;
        themePrefixCss: string;
        anchorDefaultCss: string;
        anchorDoneCss: string;
        anchorActiveCss: string;
        anchorDisabledCss: string;
        anchorHiddenCss: string;
        anchorErrorCss: string;
        anchorWarningCss: string;
        justifiedCss: string;
        btnCss: string;
        btnNextCss: string;
        btnPrevCss: string;
        loaderCss: string;
        progressCss: string;
        progressBarCss: string;
        toolbarCss: string;
        toolbarPrefixCss: string;
    };
    disabledSteps: never[];
    errorSteps: never[];
    warningSteps: never[];
    hiddenSteps: never[];
    getContent: null;
};
