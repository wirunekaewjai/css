
export type CSSObject = {
  type: '@' | 'tag' | 'node' | 'selector';
}

export type CSSAtPage = CSSObject & {
  name: string;
  children: CSSProperty[];
}

export type CSSAtMedia = CSSObject & {
  name: string;
  rules: string[];
  children: CSSObject[];
}

export type CSSTag = CSSObject & {
  name: string;
  children: CSSObject[];
}

export type CSSNode = CSSObject & {
  nodes: string[];
  children?: CSSSelector[];
}

export type CSSSelector = CSSObject & {
  name: string;
  children: CSSProperty[];
}

/*
[
  {
    type: '@',
    name: 'page',
    children: [
      {
        type: 'property',
        value: 'margin: 0',
      },
      {
        type: 'property',
        value: `size: 210mm 297mm`,
      }
    ],
  },
  {
    type: '@',
    name: 'media',
    rules: [],
    children: [
      {
        type: 'property',
        children: [`font-family: var(--font-sans)`],
      },
      {
        type: 'property',
        children: [`font-size: 12pt`],
      },
    ],
  },
  {
    type: '@',
    name: 'media',
    rules: [
      [
        'only screen',
        '(min-width: 320px)',
        '(hover: hover)'
      ],
      [
        'print'
      ],
    ],
    children: [
      {
        type: 'property',
        value: `font-family: var(--font-sans)`,
      },
      {
        type: 'property',
        value: `font-size: 12pt`,
      },
      {
        type: 'selector',
        name: ':hover',
        children: [
          {
            type: 'selector',
            name: '> * + *',
            children: [
              {
                type: 'property',
                value: `margin-left: 16px`,
              },
              {
                type: 'property',
                value: `margin-right: 16px`,
              },
            ],
          },
        ],
      },
    ],
  }
]

// global
[
  {
    type: '@',
    name: 'page',
    children: [
      {
        type: 'property',
        value: 'margin: 0',
      },
      {
        type: 'property',
        value: `size: 210mm 297mm`,
      }
    ],
  },
  {
    type: '@',
    name: 'media',
    rules: [],
    children: [
      {
        type: 'tag',
        name: 'html',
        children: [
          {
            type: 'property',
            children: [`font-family: var(--font-sans)`],
          },
          {
            type: 'property',
            children: [`font-size: 12pt`],
          },
        ],
      },
    ],
  },
  {
    type: '@',
    name: 'media',
    rules: [
      [
        'only screen',
        '(min-width: 320px)',
        '(hover: hover)'
      ],
      [
        'print'
      ],
    ],
    children: [
      {
        type: 'tag',
        name: 'body',
        children: [
          {
            type: 'property',
            value: `font-family: var(--font-sans)`,
          },
          {
            type: 'property',
            value: `font-size: 12pt`,
          },
          {
            type: 'selector',
            name: ':hover',
            children: [
              {
                type: 'selector',
                name: '> * + *',
                children: [
                  {
                    type: 'property',
                    value: `margin-left: 16px`,
                  },
                  {
                    type: 'property',
                    value: `margin-right: 16px`,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
]

// global
{
  type: 'global',
  children: [
    {
      'wk-index': [
        s.at_media(m => ({
          rules: [
            [
              m.only_screen, 
              m.min_width(
                m.screen_size('sm')
              ),
            ],
          ],
          children: [
            s.at_page([
              s.margin(0),
              s.size(210mm, 297mm),
            ]),

            s.tag_html([
              s.font_family(e => e.sans),
              
              {
                '> * + *': [
                  s.font_size('12pt'),
                  s.font_weight(e => e.medium),
                ],
              },
            ]),
          ],
        })),
      ],
    }
  ],
}

// module
{
  type: 'module',
  children: [
    {
      'container': [
        s.margin(0, 12),
        s.padding(12),
        s.transition(e => e.default),

        `display: flex`,
        `flex-direction: row`,
        `flex-wrap: nowrap`,

        [
          `border-left-width: 1px`,
          `border-right-width: 1px`,
        ],
        
        [
          [
            `cursor: -webkit-grab`,
            `cursor: grab`,
          ]
        ],

        {
          ':hover': [
            s.background_color('red'),
            s.color('white'),

            {
              ':first-child': [
                s.font_size('10px'),
              ],
            },
          ],
        },

        // { type: 'media', rules: [], children: [] }
        s.at_media(m => ({
          rules: [
            m.only_screen,
            m.min_width(
              m.screen_size('md')
            ),
          ],
          children: [
            s.appearance('none'),
          ],
        })),
      ],

      'row': [
        s.display('grid'),
        s.grid_cols(12),
        s.gap(12),
      ],

      'col: :[
        s.grid_col(12),
        s.at_media(m => ({
          rules: [
            [
              m.only_screen,
              m.min_width(
                m.screen_size('md')
              ),
            ]
          ],
          children: [
            s.grid_col(6),
          ],
        }))
      ],
    }
  ],
}

*/

const d = {
  type: 'module',
  children: [
    {
      'container': [
        `display: flex`,
        `flex-direction: row`,
        `flex-wrap: nowrap`,

        [
          `border-left-width: 1px`,
          `border-right-width: 1px`,
        ],
        
        [
          [
            `cursor: -webkit-grab`,
            `cursor: grab`,
          ]
        ],

        {
          ':hover': [
            `background-color: red`,

            {
              ':first-child': [
                `font-size: 10px`,
              ],
            },
          ],
        },

        {
          type: 'media',
          rules: [
            `only screen`,
            `(min-width: 768px)`,
          ],
          children: [
            `appearance: none`,
          ],
        },
      ],

      'row': [
        `display: grid`,
        `grid-template-columns: repeat(12, minmax(0, 1fr))`,
        `gap: 12px`,
      ],

      'col': [
        `grid-column: span 12 / span 12`,

        {
          type: 'media',
          rules: [
            `only screen`,
            `(min-width: 768px)`,
          ],
          children: [
            `grid-column: span 6 / span 6`,
          ],
        },
      ],
    }
  ],
};