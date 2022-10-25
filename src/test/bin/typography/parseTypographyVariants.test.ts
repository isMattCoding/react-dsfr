import { parseTypographyVariants } from "../../../bin/css_to_ts/typography";
import type { TypographyVariant } from "../../../bin/css_to_ts/typography";
import { assert } from "tsafe/assert";
import { same } from "evt/tools/inDepth/same";
import * as fs from "fs";

console.log(`Running test ${__filename}`);

const rawCssCode = `

:root {
    --title-spacing: 0 0 1.5rem;
}

h6 {
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.5rem;
  margin: var(--title-spacing);
}

h5 {
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.75rem;
  margin: var(--title-spacing);
}

h4 {
  font-weight: 700;
  font-size: 1.375rem;
  line-height: 1.75rem;
  margin: var(--title-spacing);
}

h3 {
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 2rem;
  margin: var(--title-spacing);
}

h2 {
  font-weight: 700;
  font-size: 1.75rem;
  line-height: 2.25rem;
  margin: var(--title-spacing);
}

h1 {
  font-weight: 700;
  font-size: 2rem;
  line-height: 2.5rem;
  margin: var(--title-spacing);
}

p {
  font-size: 1rem;
  line-height: 1.5rem;
  margin: var(--text-spacing);
}

ul,
ol {
  margin: 0;
  padding: 0;
  margin-block-start: var(--xl-block);
  margin-block-end: var(--xl-block);

  --xl-size: var(--xl-base);
}

ul {
  list-style-type: var(--ul-type);
  padding-inline-start: var(--ul-start);
}

ul > li::marker {
  font-size: calc(var(--xl-size) * 0.9);
}

ol {
  list-style-type: var(--ol-type);
  padding-inline-start: var(--ol-start);
  counter-reset: li-counter;
}

ol > li {
  counter-increment: li-counter;
}

ol > li::marker {
  content: var(--ol-content);
  font-size: var(--xl-size);
  font-weight: bold;
}

li {
  --xl-base: calc(var(--xl-size) * 0.9);
  padding-bottom: var(--li-bottom);
}

.fr-raw-list {
  --ul-type: none;
  --ol-type: none;
  --ul-start: 0;
  --ol-start: 0;
  --xl-block: 0;
  --li-bottom: 0;
  --ol-content: none;
}

.fr-list {
  --ul-type: disc;
  --ol-type: decimal;
  --ul-start: 1rem;
  --ol-start: 1.5rem;
  --xl-block: 0.5rem;
  --li-bottom: 0.25rem;
  --xl-base: 1em;
  --ol-content: counters(li-counter, ".") ". ";
}

sub {
  line-height: 1;
}

sup {
  line-height: 1;
}

.fr-text--light {
  font-weight: 300 !important;
}

.fr-text--regular {
  font-weight: 400 !important;
}

.fr-text--bold {
  font-weight: 700 !important;
}

.fr-text--heavy {
  font-weight: 900 !important;
}

.fr-h6 {
  font-weight: 700 !important;
  font-size: 1.125rem !important;
  line-height: 1.5rem !important;
  margin: var(--title-spacing);
}

.fr-h5 {
  font-weight: 700 !important;
  font-size: 1.25rem !important;
  line-height: 1.75rem !important;
  margin: var(--title-spacing);
}

.fr-h4 {
  font-weight: 700 !important;
  font-size: 1.375rem !important;
  line-height: 1.75rem !important;
  margin: var(--title-spacing);
}

.fr-h3 {
  font-weight: 700 !important;
  font-size: 1.5rem !important;
  line-height: 2rem !important;
  margin: var(--title-spacing);
}

.fr-h2 {
  font-weight: 700 !important;
  font-size: 1.75rem !important;
  line-height: 2.25rem !important;
  margin: var(--title-spacing);
}

.fr-h1 {
  font-weight: 700 !important;
  font-size: 2rem !important;
  line-height: 2.5rem !important;
  margin: var(--title-spacing);
}

.fr-display--xs {
  font-weight: 700 !important;
  font-size: 2.5rem !important;
  line-height: 3rem !important;
  margin: var(--display-spacing);
}

.fr-display--sm {
  font-weight: 700 !important;
  font-size: 3rem !important;
  line-height: 3.5rem !important;
  margin: var(--display-spacing);
}

.fr-display--md {
  font-weight: 700 !important;
  font-size: 3.5rem !important;
  line-height: 4rem !important;
  margin: var(--display-spacing);
}

.fr-display--lg {
  font-weight: 700 !important;
  font-size: 4rem !important;
  line-height: 4.5rem !important;
  margin: var(--display-spacing);
}

.fr-display--xl {
  font-weight: 700 !important;
  font-size: 4.5rem !important;
  line-height: 5rem !important;
  margin: var(--display-spacing);
}

.fr-text--alt {
  font-family: "Spectral", georgia, serif !important;
}

.fr-text--xs {
  font-size: 0.75rem !important;
  line-height: 1.25rem !important;
  margin: var(--text-spacing);
}

.fr-text--sm {
  font-size: 0.875rem !important;
  line-height: 1.5rem !important;
  margin: var(--text-spacing);
}

.fr-text--md {
  font-size: 1rem !important;
  line-height: 1.5rem !important;
  margin: var(--text-spacing);
}

.fr-text--lg {
  font-size: 1.125rem !important;
  line-height: 1.75rem !important;
  margin: var(--text-spacing);
}

.fr-text--xl,
.fr-text--lead {
  font-size: 1.25rem !important;
  line-height: 2rem !important;
  margin: var(--text-spacing);
}

@media (min-width: 48em) {
  /*! media md */

  /*! media md */
  h6 {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  h5 {
    font-size: 1.375rem;
    line-height: 1.75rem;
  }

  h4 {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  h3 {
    font-size: 1.75rem;
    line-height: 2.25rem;
  }

  h2 {
    font-size: 2rem;
    line-height: 2.5rem;
  }

  h1 {
    font-size: 2.5rem;
    line-height: 3rem;
  }

  .fr-h6 {
    font-size: 1.25rem !important;
    line-height: 1.75rem !important;
  }

  .fr-h5 {
    font-size: 1.375rem !important;
    line-height: 1.75rem !important;
  }

  .fr-h4 {
    font-size: 1.5rem !important;
    line-height: 2rem !important;
  }

  .fr-h3 {
    font-size: 1.75rem !important;
    line-height: 2.25rem !important;
  }

  .fr-h2 {
    font-size: 2rem !important;
    line-height: 2.5rem !important;
  }

  .fr-h1 {
    font-size: 2.5rem !important;
    line-height: 3rem !important;
  }

  .fr-display--xs {
    font-size: 3rem !important;
    line-height: 3.5rem !important;
  }

  .fr-display--sm {
    font-size: 3.5rem !important;
    line-height: 4rem !important;
  }

  .fr-display--md {
    font-size: 4rem !important;
    line-height: 4.5rem !important;
  }

  .fr-display--lg {
    font-size: 4.5rem !important;
    line-height: 5rem !important;
  }

  .fr-display--xl {
    font-size: 5rem !important;
    line-height: 5.5rem !important;
  }

}

@media (min-width: 36em) { }


@media (min-width: 78em) { }

@media (min-width: 62em) { }

`;

const got = parseTypographyVariants(rawCssCode);

fs.writeFileSync("./view.json", Buffer.from(got as any, "utf8"));

//console.log(got);

const expected: TypographyVariant[] = [
    {
        "selector": "h6",
        "style": {
            "fontWeight": 700,
            "fontSize": "1.125rem",
            "lineHeight": "1.5rem",
            "margin": "0 0 1.5rem",
            "@media (min-width: 48em)": {
                "fontSize": "1.25rem",
                "lineHeight": "1.75rem"
            }
        }
    },
    {
        "selector": "h5",
        "style": {
            "fontWeight": 700,
            "fontSize": "1.25rem",
            "lineHeight": "1.75rem",
            "margin": "0 0 1.5rem",
            "@media (min-width: 48em)": {
                "fontSize": "1.375rem",
                "lineHeight": "1.75rem"
            }
        }
    }
    /* ... */
];

assert(same(got, expected));

console.log("PASS");
