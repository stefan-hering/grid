%lex

%%

\s+                                 /* Whitespace */;
(left|right|up|down|end|print)      return "DIRECTION";
\<[a-zA-Z\_]{1}[a-zA-Z0-9\_]*\>     yytext = yytext.slice(1,-1); return "GENERIC";
[a-zA-Z\_]{1}[a-zA-Z0-9\_]*         return "VAR";
\-\>                                return "POP";
\<\-                                return "PUSH";
(\<|\>|\>\=|\<\=|\=|\!\=)           return "COMPARE";
\?                                  return "EXISTS";
\,                                  return ",";
\/                                  return "/";
\*                                  return "*";
\-                                  return "-";
\+                                  return "+";
\%                                  return "%";
\(                                  return "(";
\)                                  return ")";
\:                                  return ":";
\.                                  return ".";
\-?[0-9]+(\.[0-9]+)?                return "NUMBER";
\"[^"]*\"                           yytext = yytext.slice(1,-1); return "STRING";
<<EOF>>                             return "EOF";

/lex


/* operator associations and precedence */

%left "."
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
    | functions EOF
        {return { 
            "declarations":[],
            "functions":$1
            }
        }
    | EOF
        {return "empty cell"}
    ;


declarations
    : declarations "," declaration
        {$$ = $1.concat([$3]);}
    | declaration
        {$$ = [$1]}
    ;

declaration
    : VAR ":" VAR GENERIC POP VAR
        {$$ = {
            "varname": $1,
            "type": $3,
            "generic": $4,
            "pop" : $6
        }}
    |VAR ":" VAR GENERIC
        {$$ = {
            "varname": $1,
            "type": $3,
            "generic": $4
        }}
    | VAR ":" VAR
        {$$ = {
            "varname": $1,
            "type": $3
        }} 
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
            "direction": $1
            };
        }
    ;

params
    : params "," param
        {$$ = $1.concat($3);}
    | param
        {$$ = [$1]}
    ;

param
    : VAR PUSH param
        {$$ = {
            "type": "var",
            "identifier": $1,
            "push": $3
        };}
    | me
        {$$ = $1}
    ;

condition
    : me COMPARE me
        {$$ = {
            "type": "comparison",
            "operator": $2,
            "params": [$1,$3]
            };
        }
    | VAR EXISTS
        {$$ = {
            "type": "exists",
            "identifier": $1
        }}
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
    | me "." me
        {$$ = {
            "type": "concat",
            "params":[$1,$3]
            }
        }
    | "-" me %prec UMINUS
        {$$ = -$2}
    | "(" me ")"
        {$$ = $2}
    | NUMBER
        {$$ = Number(yytext)}
    | STRING
        {$$ = $1}
    | VAR
        {$$ = {
            "type": "var",
            "identifier" : $1
            }
        }
    ;
