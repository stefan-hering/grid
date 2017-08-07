%lex

%%

\s+                                 /* Whitespace */;
(left|right|up|down|end|print)      return "DIRECTION";
(\<|\>|\>\=|\<\=|\=)                return "COMPARE";
\,                                  return ",";
\/                                  return "/";
\*                                  return "*";
\-                                  return "-";
\+                                  return "+";
\%                                  return "%";
\(                                  return "(";
\)                                  return ")";
[a-zA-Z\_]{1}[a-zA-Z0-9\_]*         return "VAR";
\-?[0-9]+(\.[0-9]+)?                return "NUMBER";
\"[^"]*\"                           yytext = yytext.slice(1,-1); return "STRING";
<<EOF>>                             return "EOF";

/lex


/* operator associations and precedence */

%left "+" "-"
%left "*" "/"
%left "%"

%start gridcell

%% /* language grammar */

gridcell
    : declarations functions EOF
        {return { 
            "declarations":$1,
            "functions":$2
            }
        }
    | EOF
        {return "empty cell"}
    ;


declarations
    : declarations "," VAR
        {$$ = $1.concat([$3]);}
    | VAR
        {$$ = [$1]}
    ;

functions
    : functions function 
        {$$ = $1.concat($2);}
    | function 
        {$$ = [$1];}
    ;

function
    : condition DIRECTION "(" params ")"
        {$$ = {
            "type": "direction",
            "condition" : $1,
            "direction" : $2,
            "params": $4
            }
        }
    | DIRECTION "(" params ")"
        {$$ = {
            "type": "direction",
            "direction" : $1,
            "params": $3
            }
        }
    | condition DIRECTION "(" ")"
        {$$ = {
            "type": "direction",
            "condition" : $1,
            "direction": $2
            }
        }
    | DIRECTION "(" ")"
        {$$ = {
            "type": "direction",
            "direction" : $1
            }
        }
    ;

params
    : params "," param
        {$$ = $1.concat($3);}
    | param
        {$$ = [$1]}
    ;

param
    : me
        {$$ = $1}
    | STRING
        {$$ = $1}
    ;

condition
    : me COMPARE me
        {$$ = {
            "type": "comparison",
            "operator": $2,
            "values": [$1,$3]
            };
        }
    ;

/* Math expressions */
me
    : me "+" me
        {$$ = {
            "type": "math",
            "operator":"+",
            "params":[$1,$3]
            }
        }
    | me "-" me
        {$$ = {
            "type": "math",
            "operator":"-",
            "params":[$1,$3]
            }
        }
    | me "*" me
        {$$ = {
            "type": "math",
            "operator":"*",
            "params":[$1,$3]
            }
        }
    | me "/" me
        {$$ = {
            "type": "math",
            "operator":"/",
            "params":[$1,$3]
            }
        }
    | me "%" me
        {$$ = {
            "type": "math",
            "operator":"%",
            "params":[$1,$3]
            }
        }
    | "-" me %prec UMINUS
        {$$ = -$2}
    | "(" me ")"
        {$$ = $2}
    | NUMBER
        {$$ = Number(yytext)}
    | VAR
        {$$ = {
            "type": "var",
            "identifier" : $1
            }
        }
    ;
