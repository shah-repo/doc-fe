module.exports = {
  "env": {
    "browser": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "ignorePatterns": [],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "tsconfig.json",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": [
    "@typescript-eslint",
    "react",
    "jsx-a11y",
    "react-hooks"
  ],
  "rules": {
    "array-callback-return": [
      "warn"
    ],
    "default-case": [
      "warn",
      {
        "commentPattern": "^no default$"
      }
    ],
    "dot-location": [
      "warn",
      "property"
    ],
    "eqeqeq": [
      "error",
      "smart"
    ],
    "new-parens": "error",
    "no-caller": "error",
    "no-cond-assign": "error",
    "no-control-regex": [
      "warn"
    ],
    "no-delete-var": [
      "warn"
    ],
    "no-duplicate-case": [
      "warn"
    ],
    "no-empty-character-class": [
      "warn"
    ],
    "no-empty-pattern": [
      "warn"
    ],
    "no-eval": "error",
    "no-ex-assign": [
      "warn"
    ],
    "no-extend-native": [
      "warn"
    ],
    "no-extra-bind": [
      "warn"
    ],
    "no-extra-label": [
      "warn"
    ],
    "no-fallthrough": "off",
    "no-func-assign": [
      "warn"
    ],
    "no-implied-eval": [
      "warn"
    ],
    "no-invalid-regexp": [
      "warn"
    ],
    "no-iterator": [
      "warn"
    ],
    "no-label-var": [
      "warn"
    ],
    "no-labels": [
      "warn",
      {
        "allowLoop": true,
        "allowSwitch": false
      }
    ],
    "no-lone-blocks": [
      "warn"
    ],
    "no-loop-func": [
      "warn"
    ],
    "no-mixed-operators": [
      "warn",
      {
        "groups": [
          [
            "&",
            "|",
            "^",
            "~",
            "<<",
            ">>",
            ">>>"
          ],
          [
            "==",
            "!=",
            "===",
            "!==",
            ">",
            ">=",
            "<",
            "<="
          ],
          [
            "&&",
            "||"
          ],
          [
            "in",
            "instanceof"
          ]
        ],
        "allowSamePrecedence": false
      }
    ],
    "no-multi-str": [
      "warn"
    ],
    "no-native-reassign": [
      "warn"
    ],
    "no-negated-in-lhs": [
      "warn"
    ],
    "no-new-func": [
      "warn"
    ],
    "no-new-object": [
      "warn"
    ],
    "no-new-wrappers": "error",
    "no-obj-calls": [
      "warn"
    ],
    "no-octal": [
      "warn"
    ],
    "no-octal-escape": [
      "warn"
    ],
    "no-regex-spaces": [
      "warn"
    ],
    "no-restricted-syntax": [
      "warn",
      "WithStatement"
    ],
    "no-script-url": [
      "warn"
    ],
    "no-self-assign": [
      "warn"
    ],
    "no-self-compare": [
      "warn"
    ],
    "no-sequences": [
      "warn"
    ],
    "no-shadow-restricted-names": [
      "warn"
    ],
    "no-sparse-arrays": [
      "warn"
    ],
    "no-template-curly-in-string": [
      "warn"
    ],
    "no-throw-literal": "error",
    "no-restricted-globals": [
      "error",
      "addEventListener",
      "blur",
      "close",
      "closed",
      "confirm",
      "defaultStatus",
      "defaultstatus",
      "event",
      "external",
      "find",
      "focus",
      "frameElement",
      "frames",
      "history",
      "innerHeight",
      "innerWidth",
      "length",
      "location",
      "locationbar",
      "menubar",
      "moveBy",
      "moveTo",
      "name",
      "onblur",
      "onerror",
      "onfocus",
      "onload",
      "onresize",
      "onunload",
      "open",
      "opener",
      "opera",
      "outerHeight",
      "outerWidth",
      "pageXOffset",
      "pageYOffset",
      "parent",
      "print",
      "removeEventListener",
      "resizeBy",
      "resizeTo",
      "screen",
      "screenLeft",
      "screenTop",
      "screenX",
      "screenY",
      "scroll",
      "scrollbars",
      "scrollBy",
      "scrollTo",
      "scrollX",
      "scrollY",
      "self",
      "status",
      "statusbar",
      "stop",
      "toolbar",
      "top"
    ],
    "no-unused-expressions": "off",
    "no-unused-labels": "error",
    "no-useless-computed-key": [
      "warn"
    ],
    "no-useless-concat": [
      "warn"
    ],
    "no-useless-constructor": [
      "warn"
    ],
    "no-useless-escape": [
      "warn"
    ],
    "no-useless-rename": [
      "warn",
      {
        "ignoreDestructuring": false,
        "ignoreImport": false,
        "ignoreExport": false
      }
    ],
    "no-with": [
      "warn"
    ],
    "no-whitespace-before-property": [
      "warn"
    ],
    "react-hooks/exhaustive-deps": [
      "warn"
    ],
    "require-yield": [
      "warn"
    ],
    "react/jsx-uses-vars": "error",
    "rest-spread-spacing": [
      "warn",
      "never"
    ],
    "strict": [
      "warn",
      "never"
    ],
    "unicode-bom": [
      "warn",
      "never"
    ],
    "use-isnan": "error",
    "no-restricted-properties": [
      "error",
      {
        "object": "require",
        "property": "ensure",
        "message": "Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting"
      },
      {
        "object": "System",
        "property": "import",
        "message": "Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting"
      }
    ],
    "react/style-prop-object": [
      "warn"
    ], 
    "react/prop-types": "off",
    "jsx-a11y/accessible-emoji": [
      "warn"
    ],
    "jsx-a11y/alt-text": [
      "warn"
    ],
    "jsx-a11y/anchor-has-content": [
      "warn"
    ],
    "jsx-a11y/anchor-is-valid": [
      "warn",
      {
        "aspects": [
          "noHref",
          "invalidHref"
        ]
      }
    ],
    "jsx-a11y/aria-activedescendant-has-tabindex": [
      "warn"
    ],
    "jsx-a11y/aria-props": [
      "warn"
    ],
    "jsx-a11y/aria-proptypes": [
      "warn"
    ],
    "jsx-a11y/aria-role": [
      "warn",
      {
        "ignoreNonDOM": true
      }
    ],
    "jsx-a11y/aria-unsupported-elements": [
      "warn"
    ],
    "jsx-a11y/heading-has-content": [
      "warn"
    ],
    "jsx-a11y/iframe-has-title": [
      "warn"
    ],
    "jsx-a11y/img-redundant-alt": [
      "warn"
    ],
    "jsx-a11y/no-access-key": [
      "warn"
    ],
    "jsx-a11y/no-distracting-elements": [
      "warn"
    ],
    "jsx-a11y/no-redundant-roles": [
      "warn"
    ],
    "jsx-a11y/role-has-required-aria-props": [
      "warn"
    ],
    "jsx-a11y/role-supports-aria-props": [
      "warn"
    ],
    "jsx-a11y/scope": [
      "warn"
    ],
    "react-hooks/rules-of-hooks": [
      "error"
    ],
    "@typescript-eslint/no-unused-vars": ["error", { "ignoreRestSiblings": true, "args": "none" }],
    "@typescript-eslint/explicit-function-return-type": "off", // should we warn? remove : leave
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/consistent-type-definitions": "error",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "indent": "off",
    "@typescript-eslint/indent": [
      "error",
      2,
      {
        "FunctionDeclaration": {
          "parameters": 1
        },
        "FunctionExpression": {
          "parameters": 1
        },
        "SwitchCase": 1,
        "ignoredNodes": ['TSTypeParameterInstantiation']
      }
    ],
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        "multiline": {
          "delimiter": "semi",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "semi",
          "requireLast": false
        }
      }
    ],
    "@typescript-eslint/member-ordering": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/quotes": [
      "error",
      "double", 
      { "allowTemplateLiterals": true }
    ],
    "@typescript-eslint/semi": [
      "error",
      "always"
    ],
    "@typescript-eslint/unified-signatures": "error",
    "arrow-body-style": [
      "error"
    ],
    "arrow-parens": "error",
    "comma-dangle": [
      "error",
      "always-multiline"
    ],
    "complexity": "off",
    "constructor-super": "error",
    "curly": "error",
    "dot-notation": "error",
    "eol-last": "error",
    "guard-for-in": "error",
    "id-blacklist": "error",
    "id-match": "error",
    "max-classes-per-file": [
      "error",
      1
    ],
    "max-len": [
      "error",
      {
        "ignorePattern": "^import |^export |class [^,]+ implements |queryRunner\\.query|`,$",
        "code": 120
      }
    ],
    "no-bitwise": "error",
    "no-console": "error",
    "no-debugger": "error",
    "no-empty": "off",
    "no-invalid-this": "off",
    "no-multiple-empty-lines": "error",
    "no-shadow": [
      "off",
      {
        "hoist": "all"
      }
    ],
    "no-trailing-spaces": "error",
    "no-undef-init": "error",
    "no-underscore-dangle": "error",
    "no-unsafe-finally": "error",
    "object-shorthand": "error",
    "one-var": [
      "error",
      "never"
    ],
    "quote-props": [
      "error",
      "consistent-as-needed"
    ],
    "radix": "error",
    "space-before-function-paren": [
      "error",
      {
        "anonymous": "never",
        "asyncArrow": "always",
        "named": "never"
      }
    ],
    "spaced-comment": "error",
    "space-infix-ops":"error",
    "semi-spacing": "error",
    "comma-spacing":"error",
    "arrow-spacing": "error",
    "space-infix-ops": "error",
    "semi-spacing": "error",
    "comma-spacing": "error",
    "object-curly-spacing": ["error", "always"],
    "object-curly-newline":["error", {"multiline":true, "consistent":true,}],
    "key-spacing": "error",
    "keyword-spacing": [
      "error",
      { "before": true, "after": true }
    ],
    "space-before-blocks": "error",
    "block-spacing": "error",
    "func-call-spacing": "error",
    "switch-colon-spacing": "error",
    "space-unary-ops": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
};
