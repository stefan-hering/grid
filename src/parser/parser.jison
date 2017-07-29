
/* operator associations and precedence */

%left '+' '-'
%left '*' '/'

%start expressions

%% /* language grammar */

expressions
    : me EOF
        {print($1); return $1;}
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

function
    : direction '(' me ')'
        {$$ = yytext $3;}
    ;
