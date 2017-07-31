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
        {$$ = $1}
    | EOF
        {'empty cell'}
    ;

declarations
    : VAR ',' declarations
        {$$ = $1,$3}
    | VAR
        {$$ = $1}
    ;

functions
    : function functions
        {$$ = $1;$2;}
    | function 
        {$$ = $1}
    ;

function
    : condition DIRECTION '(' params ')'
        {$$ = $1;$3;}
    | DIRECTION '(' params ')'
        {$$ = $1;$3;}
    | condition DIRECTION '(' ')'
        {$$ = $1;}
    | DIRECTION '(' ')'
        {$$ = $1;}
    ;

params
    : param ',' params
        {$$ = $1,$3}
    | param
        {$$ = $1}
    ;

param
    : me
        {$$ = $1}
    | STRING
        {$$ = $1}
    ;

condition
    : me COMPARE me
        {$$ = $1;$3;}
    ;

me
    : me '+' me
        {$$ = $1+$3;}
    | me '-' me
        {$$ = $1-$3;}
    | me '*' me
        {$$ = $1*$3;}
    | me '/' me
        {$$ = $1/$3;}
    | me '%' me
        {$$ = $1%$3;}
    | '-' me %prec UMINUS
        {$$ = -$2;}
    | '(' me ')'
        {$$ = $2;}
    | NUMBER
        {$$ = Number(yytext);}
    | VAR
        {$$ = Number(yytext);}
    ;