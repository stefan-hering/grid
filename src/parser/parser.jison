%lex

%%

(left|right|up|down|end|print)      return 'DIRECTION';
(\<|\>|\>\=|\<\=|\=)                return 'COMPARE';
\,                                  return ',';
\/                                  return '/';
\*                                  return '*';
\-                                  return '-';
\+                                  return '+';
[a-zA-Z\_]{1}[a-zA-Z0-9\_\-]*       return 'VAR';
\-?[0-9]+                           return 'NUMBER';
\s+                                 return '';
<<EOF>>                             return 'EOF';

/lex


/* operator associations and precedence */

%left '+' '-'
%left '*' '/'

%start gridcell

%% /* language grammar */

gridcell
    : declarations EOF
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

me
    : me '+' me
        {$$ = $1+$3;}
    | me '-' me
        {$$ = $1-$3;}
    | me '*' me
        {$$ = $1*$3;}
    | me '/' me
        {$$ = $1/$3;}
    | '-' me %prec UMINUS
        {$$ = -$2;}
    | '(' me ')'
        {$$ = $2;}
    | NUMBER
        {$$ = Number(yytext);}
    ;

meseq
    : me ',' me
        {$$ = $1,$3}
    | me
        {$$ = $1}
    ;

function
    : direction '(' meseq ')'
        {$$ = $3;}
    ;
