%lex

%%

\s+                                 /* Whitespace */;
(left|right|up|down|end|print)      return 'DIRECTION';
(\<|\>|\>\=|\<\=|\=)                return 'COMPARE';
\,                                  return ',';
\/                                  return '/';
\*                                  return '*';
\-                                  return '-';
\+                                  return '+';
\%                                  return '%';
\(                                  return '(';
\)                                  return ')';
[a-zA-Z\_]{1}[a-zA-Z0-9\_\-]*       return 'VAR';
\-?[0-9]+                           return 'NUMBER';
\"[^"]+\"                           yytext = yytext.slice(1,-1); return 'STRING';
<<EOF>>                             return 'EOF';

/lex


/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '%'

%start gridcell

%% /* language grammar */

gridcell
    : declarations functions EOF
    | EOF
    ;

declarations
    : VAR ',' declarations
    | VAR
    ;

functions
    : function functions
    | function 
    ;

function
    : condition DIRECTION '(' params ')'
    | DIRECTION '(' params ')'
    | condition DIRECTION '(' ')'
    | DIRECTION '(' ')'
    ;

params
    : param ',' params
    | param
    ;

param
    : me
    | STRING
    ;

condition
    : me COMPARE me
    ;

me
    : me '+' me
    | me '-' me
    | me '*' me
    | me '/' me
    | me '%' me
    | '-' me %prec UMINUS
    | '(' me ')'
    | NUMBER
    | VAR
    ;
