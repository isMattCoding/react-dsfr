import React, { memo, forwardRef, useId } from "react";
import type { ReactNode } from "react";
import { fr } from "../lib";
import { createComponentI18nApi } from "../lib/i18n";
import { symToStr } from "tsafe/symToStr";
import { cx } from "../lib/tools/cx";
import type { RegisteredLinkProps } from "../lib/routing";
import { useLink } from "../lib/routing";
import type { MainNavigationProps } from "./MainNavigation";
import { MainNavigation } from "./MainNavigation";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import type { FrIconClassName, RiIconClassName } from "../lib/generatedFromCss/classNames";

export type HeaderProps = {
    className?: string;
    brandTop: ReactNode;
    serviceTitle?: ReactNode;
    serviceTagline?: ReactNode;
    homeLinkProps: RegisteredLinkProps & { title: string };
    navItems?: MainNavigationProps.Item[];
    /** There should be at most three of them */
    quickAccessItems?: HeaderProps.QuickAccessItem[];
    operatorLogo?: {
        orientation: "horizontal" | "vertical";
        /**
         * Expected ratio:
         * If "vertical": 9x16
         * If "horizontal": 16x9
         */
        imgUrl: string;
        /** Textual alternative of the image, it MUST include the text present in the image*/
        alt: string;
    };
    renderSearchInput?: (
        /**
         * id and name must be forwarded to the <input /> component
         * the others params can, but it's not mandatory.
         **/
        params: {
            id: string;
            name: string;
            type: "search";
            className: string;
            placeholder: string;
        }
    ) => JSX.Element;
    classes?: Partial<
        Record<
            | "root"
            | "body"
            | "bodyRow"
            | "brand"
            | "brandTop"
            | "logo"
            | "navbar"
            | "service"
            | "serviceTitle"
            | "serviceTagline"
            | "menu"
            | "menuLinks"
            | "nav"
            | "navList"
            | "navItem"
            | "navLink"
            | "navBtn"
            | "navMenu"
            | "navMenuList",
            string
        >
    >;
};

export namespace HeaderProps {
    export type QuickAccessItem = QuickAccessItem.Link | QuickAccessItem.Button;

    export namespace QuickAccessItem {
        export type Common = {
            iconId: FrIconClassName | RiIconClassName;
            text: ReactNode;
        };

        export type Link = Common & {
            linkProps: RegisteredLinkProps;
            buttonProps?: never;
        };

        export type Button = Common & {
            linkProps?: never;
            buttonProps: React.DetailedHTMLProps<
                React.ButtonHTMLAttributes<HTMLButtonElement>,
                HTMLButtonElement
            >;
        };
    }
}

/** @see <https://react-dsfr-components.etalab.studio/?path=/docs/components-header> */
export const Header = memo(
    forwardRef<HTMLDivElement, HeaderProps>((props, ref) => {
        const {
            className,
            brandTop,
            serviceTitle,
            serviceTagline,
            homeLinkProps,
            navItems = [],
            quickAccessItems = [],
            operatorLogo,
            renderSearchInput,
            classes = {},
            ...rest
        } = props;

        assert<Equals<keyof typeof rest, never>>();

        const menuButtonId = `button-${useId()}`;
        const menuModalId = `modal-${useId()}`;
        const searchModalId = `modal-${useId()}`;
        const searchInputId = `search-${useId()}-input`;

        const { t } = useTranslation();

        const { Link } = useLink();

        return (
            <header
                role="banner"
                className={cx(fr.cx("fr-header"), classes.root, className)}
                ref={ref}
                {...rest}
            >
                <div className={cx(fr.cx("fr-header__body" as any), classes.body)}>
                    <div className={fr.cx("fr-container")}>
                        <div className={cx(fr.cx("fr-header__body-row"), classes.bodyRow)}>
                            <div
                                className={cx(
                                    fr.cx("fr-header__brand", "fr-enlarge-link"),
                                    classes.brand
                                )}
                            >
                                <div
                                    className={cx(fr.cx("fr-header__brand-top"), classes.brandTop)}
                                >
                                    <div className={cx(fr.cx("fr-header__logo"), classes.logo)}>
                                        {(() => {
                                            const children = (
                                                <p className={fr.cx("fr-logo")}>{brandTop}</p>
                                            );

                                            return serviceTitle !== undefined ? (
                                                children
                                            ) : (
                                                <Link {...homeLinkProps}>{children}</Link>
                                            );
                                        })()}
                                    </div>
                                    {operatorLogo !== undefined && (
                                        <div className={fr.cx("fr-header__operator")}>
                                            <Link {...homeLinkProps}>
                                                <img
                                                    className={fr.cx("fr-responsive-img")}
                                                    style={(() => {
                                                        switch (operatorLogo.orientation) {
                                                            case "vertical":
                                                                return { "width": "3.5rem" };
                                                            case "horizontal":
                                                                return { "maxWidth": "9.0625rem" };
                                                        }
                                                    })()}
                                                    src={operatorLogo.imgUrl}
                                                    alt={operatorLogo.alt}
                                                />
                                            </Link>
                                        </div>
                                    )}

                                    {(quickAccessItems.length > 0 ||
                                        renderSearchInput !== undefined) && (
                                        <div
                                            className={cx(
                                                fr.cx("fr-header__navbar"),
                                                classes.navbar
                                            )}
                                        >
                                            {renderSearchInput !== undefined && (
                                                <button
                                                    className={fr.cx("fr-btn--search", "fr-btn")}
                                                    data-fr-opened={false}
                                                    aria-controls={searchModalId}
                                                    title={t("search")}
                                                >
                                                    {t("search")}
                                                </button>
                                            )}
                                            <button
                                                className={fr.cx("fr-btn--menu", "fr-btn")}
                                                data-fr-opened="false"
                                                aria-controls={menuModalId}
                                                aria-haspopup="menu"
                                                id={menuButtonId}
                                                title={t("menu")}
                                            >
                                                {t("menu")}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {serviceTitle !== undefined && (
                                    <div
                                        className={cx(fr.cx("fr-header__service"), classes.service)}
                                    >
                                        <Link {...homeLinkProps}>
                                            <p
                                                className={cx(
                                                    fr.cx("fr-header__service-title"),
                                                    classes.serviceTitle
                                                )}
                                            >
                                                {serviceTitle}
                                            </p>
                                        </Link>
                                        {serviceTagline !== undefined && (
                                            <p
                                                className={cx(
                                                    fr.cx("fr-header__service-tagline" as any),
                                                    classes.serviceTagline
                                                )}
                                            >
                                                {serviceTagline}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {(quickAccessItems.length > 0 || renderSearchInput !== undefined) && (
                                <div className={fr.cx("fr-header__tools")}>
                                    {quickAccessItems.length > 0 && (
                                        <div className={fr.cx("fr-header__tools-links")}>
                                            <ul className={fr.cx("fr-btns-group")}>
                                                {quickAccessItems.map(
                                                    (
                                                        { iconId, text, buttonProps, linkProps },
                                                        i
                                                    ) => (
                                                        <li key={i}>
                                                            {linkProps !== undefined ? (
                                                                <Link
                                                                    {...linkProps}
                                                                    className={cx(
                                                                        fr.cx("fr-btn", iconId),
                                                                        linkProps.className
                                                                    )}
                                                                >
                                                                    {text}
                                                                </Link>
                                                            ) : (
                                                                <button
                                                                    {...buttonProps}
                                                                    className={cx(
                                                                        fr.cx("fr-btn", iconId),
                                                                        buttonProps.className
                                                                    )}
                                                                >
                                                                    {text}
                                                                </button>
                                                            )}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                    {renderSearchInput !== undefined && (
                                        <div
                                            className={fr.cx("fr-header__search", "fr-modal")}
                                            id={searchModalId}
                                        >
                                            <div
                                                className={fr.cx(
                                                    "fr-container",
                                                    "fr-container-lg--fluid"
                                                )}
                                            >
                                                <button
                                                    className={fr.cx("fr-btn--close", "fr-btn")}
                                                    aria-controls={searchModalId}
                                                    title={t("close")}
                                                >
                                                    {t("close")}
                                                </button>
                                                <div
                                                    className={fr.cx("fr-search-bar")}
                                                    role="search"
                                                >
                                                    <label
                                                        className={fr.cx("fr-label")}
                                                        htmlFor={searchInputId}
                                                    >
                                                        {t("search")}
                                                    </label>
                                                    {renderSearchInput({
                                                        "className": fr.cx("fr-input"),
                                                        "id": searchInputId,
                                                        "name": searchInputId,
                                                        "placeholder": t("search"),
                                                        "type": "search"
                                                    })}
                                                    <button
                                                        className={fr.cx("fr-btn")}
                                                        title={t("search")}
                                                    >
                                                        {t("search")}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {(navItems.length !== 0 || quickAccessItems.length !== 0) && (
                    <div
                        className={cx(fr.cx("fr-header__menu", "fr-modal"), classes.menu)}
                        id={menuModalId}
                        aria-labelledby={menuButtonId}
                    >
                        <div className={fr.cx("fr-container")}>
                            <button
                                className={fr.cx("fr-btn--close", "fr-btn")}
                                aria-controls={menuModalId}
                                title={t("close")}
                            >
                                {t("close")}
                            </button>
                            <div
                                className={cx(fr.cx("fr-header__menu-links"), classes.menuLinks)}
                            />
                            {navItems.length !== 0 && (
                                <MainNavigation
                                    items={navItems}
                                    classes={{
                                        "root": classes.nav,
                                        "list": classes.navList,
                                        "item": classes.navItem,
                                        "link": classes.navLink,
                                        "btn": classes.navBtn,
                                        "menu": classes.navMenu,
                                        "menuList": classes.navMenuList
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </header>
        );
    })
);

Header.displayName = symToStr({ Header });

const { useTranslation, addHeaderTranslations } = createComponentI18nApi({
    "componentName": symToStr({ Header }),
    "frMessages": {
        /* spell-checker: disable */
        "menu": "Menu",
        "close": "Fermer",
        "search": "Rechercher"
        /* spell-checker: enable */
    }
});

addHeaderTranslations({
    "lang": "en",
    "messages": {
        "close": "Close",
        "search": "Search"
    }
});

export { addHeaderTranslations };
